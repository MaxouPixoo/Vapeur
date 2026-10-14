const express = require("express");
const app = express();
const port = 8080;

const {SupprimerImage} = require("./utils");

//midleware pour l'upload d'image
const multer  = require('multer');

//il faut rajouter la verification des fichiers 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({storage}); //dossiers dans lequel il vas rentrer les images ajoutées

const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

const bodyParser = require("body-parser");
const path = require("path");
const hbs = require("hbs");

// Configuration de Handlebars pour Express
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
hbs.registerPartials(path.join(__dirname, "views", "partials"));

// On définit un middleware pour parser les données des requêtes entrantes.
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

hbs.registerHelper("eq", function (a, b) {
  return a === b;
});


//Generation des genres au lancement
const listeGenre = ['ACTION','AVENTURE','RPG','SIMULATION','SPORT','MMORPG'];
const listeImageGenre = ["action.jpg","aventure.webp","rpg.png","simulation.webp","sport.png","mmorpg.jpg"];
async function  GenresGenerations () 
{
  if(await prisma.genres.count() === 0)
  {
    listeGenre.forEach( async (element, i) => {
         await prisma.genres.create({
            data:{ name: element,
              image:listeImageGenre[i]
            }
        })
    });
  }    
}
GenresGenerations();


// Route acceuil
app.get('/', async (req, res) => {
    const featuredGames = await prisma.games.findMany({
        where:{
            featured: true
        },
        orderBy: {
        title: 'asc'
      }
    
    });
    res.render("index", {
        featuredGames
    });
});

// Route de la liste des jeux
app.get("/games", async (req, res) => {
    const games = await prisma.games.findMany({
      orderBy: {
        title: 'asc'
      }
    });
    res.render("jeux/index", {
        games
    });
});

// Créer des jeux

app.get("/games/create",async (req,res) =>{  
    const editeurs = await prisma.publishers.findMany({orderBy: {
        name: 'asc'}
    });
    const genres = await prisma.genres.findMany({orderBy: {
        name: 'asc'}
    });

    res.render("jeux/ajouter", {editeurs,genres});
})

//utilisation de 2 callbacks 
//le premier permet de recuperer le fichier grâce au middleware multer
app.post("/games/create", upload.single('image') , async (req, res) => {
  const { title, desc, image, genreId, publisherId, featured } = req.body;

  try {
    if(!req.file) // pas d'image
    {
      const newGame = await prisma.games.create({
        data: {
          title,
          desc,
          genreId: Number(genreId),
          publisherId: Number(publisherId),
          featured: featured === "on"
        }
        });
    }
     else
     {
      const newGame = await prisma.games.create({
        data: {
          title,
          desc,
          image: req.file.filename,
          genreId: Number(genreId),
          publisherId: Number(publisherId),
          featured: featured === "on"
        }
        });
     }
    res.redirect("/games");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de l'ajout du jeu");
  }
});

// Editer des jeux
app.get("/games/:id/edit",async (req,res) =>{
  const editeurs = await prisma.publishers.findMany({orderBy: {
        name: 'asc'}
    });
  const genres = await prisma.genres.findMany({orderBy: {
        name: 'asc'}
    });

  const gamesDetails = await prisma.games.findUnique({
    where : {
        id: +req.params.id
    },
    include:{
      publisher:true,
      genre:true,
    },
  });
  res.render("jeux/modifier",{
    id: gamesDetails.id,
    title : gamesDetails.title,
    desc : gamesDetails.desc,
    publisherId: gamesDetails.publisherId,
    genreId : gamesDetails.genreId,
    featured : gamesDetails.featured,
    releaseDate : gamesDetails.releaseDate,
   editeurs,
   genres,
   image: gamesDetails.image
  })
})

app.post("/games/:id/edit",upload.single('image'), async (req, res) => {
  const gameId = Number(req.params.id);
  const { title, desc, genreId, publisherId, featured } = req.body;

  try {
    if(!req.file) //pas de nouvelle image
    {
      const updatedGame = await prisma.games.update({
      where: { id: gameId },
      data: {
        title,
        desc,
        genreId: Number(genreId),
        publisherId: Number(publisherId),
        featured: featured === "on",
      },
    });
    }
    else
    {

      //je recupère le nom de l'image déjà enregistré et je la supprime
      const image = await prisma.games.findUnique({where : { id: gameId}});

      //je supprime l'ancienne image
      SupprimerImage(image.image);

      const updatedGame = await prisma.games.update({
      where: { id: gameId },
      data: {
        title,
        desc,
        genreId: Number(genreId),
        publisherId: Number(publisherId),
        featured: featured === "on",
        image: req.file.filename
          },
      });
    }
    res.redirect("/games");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la modification du jeu");
  }
});

// Supprimer un jeu
app.get("/games/:id/delete", async (req, res) => {
  const gameId = Number(req.params.id);

  try {
    const deletedGame = await prisma.games.delete({ where: { id: gameId } });
    SupprimerImage(deletedGame.image);
    res.redirect("/games");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la suppression du jeu");
  }
});

// Afficher les détails d'un jeu
app.get("/games/:id", async (req, res) =>{
    const gamesDetails = await prisma.games.findUnique({
        where : {
            id: +req.params.id
        },
        include:{
          publisher: true,
          genre: true,
        },
    });
    const releaseDateFormatted = gamesDetails.releaseDate.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    res.render("jeux/details",{
        id : gamesDetails.id,
        title : gamesDetails.title,
        desc : gamesDetails.desc, 
        image : gamesDetails.image,
        publisher : gamesDetails.publisher.name,
        publisherId : gamesDetails.publisher.id,
        genre : gamesDetails.genre.name,
        genreId : gamesDetails.genre.id,
        releaseDate : releaseDateFormatted,
    })
});

//genres
app.get("/genres",async (req,res) =>{

    const genres = await prisma.genres.findMany({orderBy: {
        name: 'asc'}
    });
    res.render("genres/index",{genres});
});

app.get("/genres/:id",async (req,res)=>{
    const genre = await prisma.genres.findUnique({
        where: {
            id : +req.params.id
        },
        include: {
          games: true
        }
    })
    res.render("genres/details",{genre})
});

//Editeurs


//Ajouter
app.get("/publishers/ajouter", (req, res)=>{
    res.render("editeurs/ajouter");
});

app.post('/publishers',upload.single('image'), async (req, res) => {
  try{
    const { name } = req.body;
    if(!req.file)//pas d'image
    {
      await prisma.publishers.create(
      {data: 
        { 
          name,
        }
      });
    }
    else
    {
      await prisma.publishers.create(
      {data: 
        { 
          name,
          image: req.file.filename
        }
      });
    }
    
    res.redirect("/publishers");
  }
  catch(error)
  {
    console.error(error);
    res.status(500).send("Erreur lors de l'ajout d'un editeur");
  }
  
});



//modifier
app.get('/publishers/:id/edit', async (req, res) => {
  const publisher = await prisma.publishers.findUnique({where: 
    {
      id: +req.params.id
    }
  });
  res.render('editeurs/modifier', { publisher });
});

//modifier
app.post('/publishers/:id',upload.single('image'), async (req, res) => {
  const { name } = req.body;
  if(!req.file)//pas d'image
  {
    await prisma.publishers.update({
    where: {id: +req.params.id},
    data: {
      name,
      }
    });
  }
  else
  {
    const image = await prisma.publishers.findUnique({
      where:
      {
        id:+req.params.id
      }
    })
    
    //je supprime l'ancienne image
    SupprimerImage(image.image); 

    await prisma.publishers.update({
    where: {id: +req.params.id},
    data: {
      name,
      image: req.file.filename
      }
    });
  }
  res.redirect("/publishers");
});

app.get("/publishers/:id/delete", async(req, res)=>{
  try
  {
    const games = await prisma.publishers.delete({where: 
      {
        id: +req.params.id
      },
      include:{
        games: true
      }
    });

    //suppressions des images des jeux de l'editeurs
    for (let i=0;i<games.games.length;i++)
      SupprimerImage(games.games[i].image);

    //suppression de l'image du publisher
    SupprimerImage(games.image);
    res.redirect('/publishers');
  }
  catch(error)
  {
    console.error(error);
    res.status(500).send("Erreur lors de la suppression d'un editeur");
  }
  
})

app.get("/publishers/:id/confirm",(req,res)=>{
  const id = req.params.id;
  res.render("editeurs/confirm",{id});
})

app.get("/publishers",async (req,res)=>{
    const editeurs = await prisma.publishers.findMany({orderBy: {
        name: 'asc'}
    });
    res.render("editeurs/index",{editeurs});
});

app.get("/publishers/:id", async (req,res)=>{
    const editeur = await prisma.publishers.findUnique({
        where : {
            id: +req.params.id
        },
        include : {
                games: true
        }
    });
    res.render("editeurs/details",{editeur});
});



app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

// Erreur 500
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render("erreur/erreur500");
});

// Erreur 404
app.use(function(req, res, next){
    res.status(404).render("erreur/erreur404");
});
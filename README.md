# Vapeur

Vapeur est un site web de gestion d'une bibliothèque de jeux vidéo.

## Presentation 

Sur l'ensemble des pages ont retrouve la barre de naviguation permet d'acceder au différentes parties : 

### La page principal

Accessible en cliquant sur l’image du site ou sur le bouton « Jeux du moment », cette page permet d’afficher la liste des jeux mis en avant.

### La page tout nos jeux

Accessible en cliquant sur « Tous nos jeux », cette page affiche la liste de l’ensemble des jeux. Chaque jeu est cliquable afin d’accéder aux détails de celui-ci, et il est possible d’ajouter un jeu en cliquant sur l’image en forme de + afin d’accéder au formulaire d’ajout.

Sur la page de détail d’un jeu, on peut cliquer sur l’image en forme de stylo afin d’accéder au formulaire de modification, et sur l’image de la poubelle afin de supprimer le jeu.

Concernant les pages du formulaires d'ajout et de modification on retrouve l'ensemble des champs à remplir :

        -Le champ Titre
        -Le champ Description
        -Le champ du genre
        -Le champ de l'editeur
        -Le champ de mise en avant
        -Le champ de selection d'image (optionnel)

Sur la page de modification on retrouve en plus une visualisation de l'image enregistré auparavant

⚠️ Attention si aucun éditeur n'a été crée il sera impossible d'ajouter un jeu

### La page toutes nos catégories

Sur la page des catégories/genres, on retrouve une liste des genres, chacun représenté par une image cliquable.
Une fois cliqué, on se retrouve sur une page qui affiche les jeux appartenant au genre sélectionné. Ici encore, on peut cliquer sur les jeux et accéder à leurs détails.

### La page tous nos editeurs

Sur la page Tous nos éditeurs, on retrouve une liste des éditeurs représentés par une image cliquable qui mène au détail de l’éditeur.
Il y a également une image en forme de + qui permet d’accéder au formulaire d’ajout.

Sur la page de détail d’un éditeur, on retrouve une image cliquable en forme de stylo qui permet d’accéder au formulaire de modification, ainsi qu’une image de poubelle pour supprimer l’éditeur.

Concernant les formulaires d'ajout et de modification on retrouve l'ensemble des champs à remplir :

        -Le champ Titre 
        -Le champ de selection d'image (optionel)

Sur la page de modification on retrouve en plus une visualisation de l'image enregistré auparavant

⚠️Attention : la suppression d’un éditeur engendrera la suppression de l’ensemble des jeux de cet éditeur.
C’est pour cette raison qu’une page de confirmation est affichée avant la suppression.


## Installation client 

        -npm install
        -npx prisma migrate deploy 
        -npm run start
        
## Installation Developeur
        
        -npm install
        -npx prisma migrate dev 
        -npm run dev
        
## Auteurs

Lardon Axel,
Sulmont Leo,
Vechambre Maxence,
Djaafri Selim


const fs = require('fs')
const path = require("path");

function SupprimerImage(nomImage)
{
    //je supprime l'ancienne image
    if(!(nomImage === "default.webp"))
    {
      fs.unlink(path.join("public","uploads",nomImage), (err) => {
          if (err) {
            console.error("Erreur suppression image:", err);
          }
      });
    }
          
}

//exporte le module
module.exports = {
  SupprimerImage
};
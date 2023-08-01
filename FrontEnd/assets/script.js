import { genererAffichageTravaux } from "./gallery.js";
import { affichageModal, tableauSuppression } from "./modal1.js";
import { tableauAjout } from "./modal2.js";

/**
 * Function pour recuperer les travaux depuis l'API ou le sessionStorage
 */

// Récupération des travaux via le local storage
export let travaux = window.sessionStorage.getItem("travaux");

if (travaux === null) {
  // Récupération des élements depuis l'API
  travaux = await fetch("http://localhost:5678/api/works").then((travaux) =>
    travaux.json()
  );

  // Transformation des pièces en JSON
  const valeurTravaux = JSON.stringify(travaux);
  // Stockage des informations dans le sessionStorage
  window.sessionStorage.setItem("travaux", valeurTravaux);
} else {
  travaux = JSON.parse(travaux);
}
console.log(travaux);

// Création du tableau Bis, qui servira à être afficher dans le mode Edition
export let travauxBis = travaux.map((travail) => {
  return {
    id: travail.id,
    imageUrl: travail.imageUrl,
    title: travail.title,
    categoryId: travail.categoryId,
  };
});
// On génère l'affichage des travaux sur la page principale
genererAffichageTravaux(travaux);

/*
 * Utilisation des filtres
 */
// Filtres tous
const boutonTous = document.querySelector(".btnTous");
boutonTous.addEventListener("click", () => {
  genererAffichageTravaux(travaux);
});

// Filtres objets
const boutonObjet = document.querySelector(".btnObjets");
boutonObjet.addEventListener("click", () => {
  const travauxObjets = travaux.filter(function (travail) {
    return travail.categoryId === 1;
  });
  // Effacement de l'écran et regénération de la page avec les pièces filtrées uniquement
  genererAffichageTravaux(travauxObjets);
});
// Filtres appartements
const boutonAppartements = document.querySelector(".btnAppartements");
boutonAppartements.addEventListener("click", () => {
  const travauxAppartements = travaux.filter(function (travail) {
    return travail.categoryId === 2;
  });
  // Effacement de l'écran et regénération de la page avec les pièces filtrées uniquement
  genererAffichageTravaux(travauxAppartements);
});
// Filtres hotel & restaurants
const boutonHotelEtRestaurants = document.querySelector(
  ".btnHotelsEtRestaurants"
);
boutonHotelEtRestaurants.addEventListener("click", () => {
  const travauxHotelEtRestaurants = travaux.filter(function (travail) {
    return travail.categoryId === 3;
  });
  // Effacement de l'écran et regénération de la page avec les pièces filtrées uniquement
  genererAffichageTravaux(travauxHotelEtRestaurants);
});

/***
 * Mode édition si token && userId valides
 * affichage de la banniere mode édition et apparition des boutons LogOut et modifier
 * disparition de Login et des filtres
 */
let userId = sessionStorage.getItem("userId");
let token = sessionStorage.getItem("token");

if (userId != null && token != null) {
  let banner = document.querySelector(".bannerEdition");
  banner.style.display = null;
  // le bouton Login disparait
  let loginLink = document.getElementById("loginLink");
  loginLink.style.display = "none";
  loginLink.style.padding = "0px";
  // Le bouton logout apparait
  let logoutLink = document.getElementById("logoutLink");
  logoutLink.style.display = null;
  // Apparation des boutons
  let btnModifierContenu = document.getElementById("btnModifierContenu");
  let btnModifierProjets = document.getElementById("btnModifierProjets");
  btnModifierContenu.style.display = null;
  btnModifierProjets.style.display = null;
  // Disparition des filtres
  let filtres = document.querySelector(".filtres");
  filtres.style.display = "none";
  //On génère l'affichage des travaux sur la page principale en mode Edition, avec la liste travauxBis
  genererAffichageTravaux(travauxBis);
}

/**
 * Ajout d'un eventListener pour log out
 */
let btnLogout = document.getElementById("logoutLink");
btnLogout.addEventListener("click", () => {
  sessionStorage.removeItem("userId");
  sessionStorage.removeItem("token");
});

/**
 * Listener pour affichage de la modale en mode Edition
 */
let btnModifierProjets = document.getElementById("btnModifierProjets");
btnModifierProjets.addEventListener("click", () => {
  affichageModal();
});

/**
 * Listener sur le bouton Publier pour envoyer le nouveau tableau de travaux à l'API et le récupérer
 */
let btnPublier = document.getElementById("btnPublier");

btnPublier.addEventListener("click", () => {
  // Ici, créer une boite de dialogue pour demander si l'on valide ou non la publication
  const confirmation = confirm("Voulez-vous confirmer les modifications ?");
  let modifAlert = 0;

  if (confirmation) {
    if (tableauSuppression !== "") {
      console.log("Voici le tableau suppr. rempli " + tableauSuppression);
      // Ici on crée un compteur pour n'afficher qu'une seule fois le message de confirmation/erreur
      // Ici, on supprime les éléments qui ne sont plus dans travauxBis
      for (let i = 0; i < tableauSuppression.length; i++) {
        fetch("http://localhost:5678/api/works/" + tableauSuppression[i], {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token,
            Accept: "*/*",
          },
        }).then((response) => {
          if (response.ok) {
            if (modifAlert === 0) {
              alert("Les modifications ont été effectuées avec succès !");
              modifAlert++;
            } else {
              // On ne fait rien si modifAlert est != de 0. L'alerte ne sera affichée qu'une seule fois
            }
          } else {
            if (modifAlert === 0) {
              alert("Les modifications ont échouées.");
              console.log(response);
              modifAlert++;
            } else {
            }
          }
        });
      }
      // On vide le tableau de suppression
      tableauSuppression.splice(0, tableauSuppression.length);
      console.log("voici le tableau suppr. vidé : " + tableauSuppression);
      // On supprime le tableau "travaux" du sessionStorage pour forcer le réaffichage au logout
      sessionStorage.removeItem("travaux");
    }
    if (tableauAjout !== "") {
      console.log("Voici le tableau ajout. rempli " + tableauAjout);
      // fetch post et charge utile
      // On crée la charge utile depuis chaque entrée du tableauAjout
      for (let i = 0; i < tableauAjout.length; i++) {
        let chargeUtile = new FormData();
        chargeUtile.set("image", tableauAjout[i].image);
        chargeUtile.set("title", tableauAjout[i].title);
        chargeUtile.set("category", parseInt(tableauAjout[i].categoryId));

        console.log(chargeUtile);
        console.log(chargeUtile.get("image"));
        fetch("http://localhost:5678/api/works", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + window.sessionStorage.getItem("token"),
          },
          body: chargeUtile,
        }).then((response) => {
          if (response.ok) {
            if (modifAlert === 0) {
              alert("Les modifications ont été effectuées avec succès !");
              modifAlert++;
            } else {
              // On ne fait rien si modifAlert est != de 0. L'alerte ne sera affichée qu'une seule fois
            }
          } else {
            if (modifAlert === 0) {
              alert("Les modifications ont échouées.");
              console.log(response);
              modifAlert++;
            } else {
            }
          }
        });
        // On vide le tableau Ajout
        tableauAjout.splice(0, tableauAjout.length);
        console.log("voici le tableau ajout. vidé : " + tableauAjout);
        // On supprime le tableau "travaux" du sessionStorage pour forcer le réaffichage au logout
        sessionStorage.removeItem("travaux");
      }
    }
  }
});

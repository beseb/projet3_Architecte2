import { genererCategories } from "./gallery.js";
import {
  closeModals,
  createPhotoModal,
  createPhotoGallery,
  suppressionPhoto,
} from "./modal1.js";
import { travauxBis } from "./script.js";

let modal2 = document.querySelector(".modal2");
export let tableauAjout = [];

export function affichageModal2() {
  modal2.style.display = "flex";
  modal2.removeAttribute("aria-hidden");
  modal2.setAttribute("aria-modal", "true");

  modal2.innerHTML = `
    <div class = "modal-wrapper" id="modal2">
    <div class="divBoutonFermer">
        <button class="modal-bouton-fermer2"><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
        <path d="M11.6546 2.05106C12.1235 1.58214 12.1235 0.820611 11.6546 0.351691C11.1856 -0.11723 10.4241 -0.11723 9.95519 0.351691L6.005 4.30563L2.05106 0.355442C1.58214 -0.113479 0.820611 -0.113479 0.351691 0.355442C-0.11723 0.824363 -0.11723 1.58589 0.351691 2.05481L4.30563 6.005L0.355442 9.95894C-0.113479 10.4279 -0.113479 11.1894 0.355442 11.6583C0.824363 12.1272 1.58589 12.1272 2.05481 11.6583L6.005 7.70437L9.95894 11.6546C10.4279 12.1235 11.1894 12.1235 11.6583 11.6546C12.1272 11.1856 12.1272 10.4241 11.6583 9.95519L7.70437 6.005L11.6546 2.05106Z" fill="black"/>
          </svg></button>
    </div>
    <div class="divBoutonRetour"><button class="modal-bouton-retour"><svg xmlns="http://www.w3.org/2000/svg" width="21" height="19" viewBox="0 0 21 19" fill="none">
    <path d="M0.439478 7.94458C-0.146493 8.53055 -0.146493 9.48217 0.439478 10.0681L7.9399 17.5686C8.52587 18.1545 9.47748 18.1545 10.0635 17.5686C10.6494 16.9826 10.6494 16.031 10.0635 15.445L5.11786 10.5041H19.4999C20.3297 10.5041 21 9.83375 21 9.00402C21 8.17428 20.3297 7.50393 19.4999 7.50393H5.12255L10.0588 2.56303C10.6447 1.97706 10.6447 1.02545 10.0588 0.439478C9.47279 -0.146493 8.52118 -0.146493 7.93521 0.439478L0.43479 7.9399L0.439478 7.94458Z" fill="black"/>
  </svg></button>
    </div>
    
    <form class="formModal2" action ="#" method = "" enctype="multipart/form-data">
    <p class="modal2-title">Ajout Photo</p>
    <div class="divAjoutPhoto">
    <img src="./assets/icons/picture-svgrepo-com-1.jpg" class="previewImg icone"></img><p id = "infoAjout">jpg, png: 4mo max</p></div>
    
    <label id="labelAjoutPhoto">+ Ajouter photo   <input type="file" name="file" id="inputFile" accept=".jpg,.jpeg,.png"  /></label>  
  
    <label name="titre">Titre</label>
    <input type="text" name="inputTitre" id="titre" required></input>
    
    <label for="categorie">Catégorie</label>
    <select name="inputCategorie" id="categorie" required>
    </select>
      <hr>
      <button class="boutonValiderAjoutPhoto" type ="submit">Valider</button>
      </form>
    `;
  genererCategories();
  // On appelle la fonction qui permet de gérer le bouton fermer et retour
  ajouterEvenementsBoutons();
  // On gère le changement de couleur du bouton Valider du formulaire, si les champs sont remplis
  const inputTitre = document.querySelector("#titre");
  const inputFile = document.getElementById("inputFile");
  const boutonValiderAjoutPhoto = document.querySelector(".boutonValiderAjoutPhoto");
  
  inputTitre.addEventListener("input", function() {
    changerCouleurBtnValider(inputTitre,inputFile,boutonValiderAjoutPhoto);
  });
  
  inputFile.addEventListener("change", function() {
    changerCouleurBtnValider(inputTitre,inputFile,boutonValiderAjoutPhoto);
  });
  
  /**
   * Permettre de télécharger une image, en ayant le input[type="file"] caché, pour plus de design et la preview du document televersé
   */
  const fileInput = document.getElementById("inputFile");
  const labelAjoutPhoto = document.getElementById("labelAjoutPhoto");
  const infoAjout = document.getElementById("infoAjout");

  // Affichage de la preview image
  const previewImg = document.querySelector(".previewImg");
  // Si l'image de preview est l'icone, elle à une classe affectée en CSS (".previewImg.icone") pour gérer sa hauteur/largeur
  // Ici, on récupère le fichier à télécharger et on le visualise dans la boite de dialogue
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        previewImg.src = reader.result;
        // Affichage de la preview image à 100% de sa hauteur, en lui retirant sa classe CSS "icone"
        previewImg.classList.remove("icone");
        // Disparition du bouton upload et du texte d'infoAjout
        labelAjoutPhoto.style.display = "none";
        infoAjout.style.display = "none";
      });
      reader.readAsDataURL(file);
    }
  });
  /**
   * Gestion du formulaire et envoi des photos ajoutées
   */
  const form = document.querySelector(".formModal2");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    // On vérifie les champs et on retourne les alertes si les données du formulaire ne sont pas valides
    if (!checkInputs()) {
      return;
    }
    // On récupère le titre et l'image
    let title = document.querySelector("#titre").value;
    const fileInput = document.querySelector('input[type="file"]');
    const file = fileInput.files[0];

    // On récupère l'id de la catégorie de photos sélectionnée
    let selectCategorie = document.querySelector("[name=inputCategorie]");
    let selectedOption = selectCategorie.options[selectCategorie.selectedIndex];
    let idCategorie = selectedOption.getAttribute("id");
    // On crée l'objet pour l'ajouter à travauxBis
    let uploadedWork = {
      id: travauxBis[travauxBis.length - 1].id + 1,
      imageUrl: URL.createObjectURL(file), // Création de l'URL temporaire,
      image: fileInput.files[0],
      title: title,
      categoryId: idCategorie,
    };
    travauxBis.push(uploadedWork);
    tableauAjout.push(uploadedWork);
    console.log(tableauAjout);
    // On envoie tout ça à l'API ?
    // On crée la nouvelle image dans la modal1
    let modal1Photos = document.querySelector(".modal1-photos");
    let newModalFigure = createPhotoModal(uploadedWork);
    modal1Photos.appendChild(newModalFigure);
    // On lui ajoute le listener pour effacer la photo ajoutée
    suppressionPhoto();
    // On crée la nouvelle image dans la galerie principale
    let gallery = document.querySelector(".gallery");
    let newGalleryFigure = createPhotoGallery(uploadedWork);
    gallery.appendChild(newGalleryFigure);
    // On ferme la modal 2
    closeModal2();
  });
}

/**
 * Fonction qui gère les boutons retour et fermer de la modal 2
 */
function ajouterEvenementsBoutons() {
  const boutonFermer2 = document.querySelector(".modal-bouton-fermer2");
  const boutonRetour = modal2.querySelector(".modal-bouton-retour");
  if (boutonFermer2) {
    boutonFermer2.addEventListener("click", () => {
      closeModals();
    });
  }
  if (boutonRetour) {
    boutonRetour.addEventListener("click", () => {
      closeModal2();
    });
  }
}

/**
 * Fonction pour fermer uniquement la modale 2 (via le bouton Retour)
 */
function closeModal2() {
  modal2.style.display = "none";
  modal2.setAttribute("aria-hidden", "true");
  modal2.removeAttribute("aria-modal");
}
/**
 * Fonction qui vérifie les entrées du formulaires
 */
function checkInputs() {
  // Empêche l'envoi du formulaire par défaut

  // Récupère les éléments du formulaire
  const titreInput = document.getElementById("titre");
  const fileInput = document.getElementById("inputFile");
  const categorieSelect = document.getElementById("categorie");

  // Récupère les valeurs des champs du formulaire
  const titreValue = titreInput.value.trim();
  const fileValue = fileInput.value.trim();
  const categorieValue = categorieSelect.value;

  // Vérifie si le titre est valide
  if (titreValue === "") {
    alert("Veuillez entrer un titre valide.");
    return;
  }

  // Vérifie si un fichier a bien été sélectionné
  if (fileValue === "") {
    alert("Veuillez sélectionner un fichier.");
    return;
  }

  // Vérifie si le fichier est inférieur ou égal à 4 Mo
  const fileSize = fileInput.files[0].size;
  const maxSize = 4 * 1024 * 1024; // 4 Mo en octets
  if (fileSize > maxSize) {
    alert("Le fichier doit être inférieur ou égal à 4 Mo.");
    return;
  }

  // Vérifie si une catégorie a bien été sélectionnée
  if (categorieValue === "") {
    alert("Veuillez sélectionner une catégorie.");
    return;
  }

  // Vérifie si un fichier a été sélectionné
  if (!fileInput.files || !fileInput.files[0]) {
    alert("Veuillez sélectionner un fichier.");
    return;
  }

  return true;
}



function changerCouleurBtnValider(inputTitre,inputFile,boutonValiderAjoutPhoto) {
  if (inputTitre.value.trim() !== "" && inputFile.files.length !== 0) {
    boutonValiderAjoutPhoto.classList.add("boutonValiderActif")
  } else {
    boutonValiderAjoutPhoto.classList.remove("boutonValiderActif")
  }
}

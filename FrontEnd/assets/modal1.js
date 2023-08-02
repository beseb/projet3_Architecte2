import { travauxBis } from "./script.js";
import { genererAffichageTravaux } from "./gallery.js";
import { affichageModal2 } from "./modal2.js";

const overlay = document.querySelector(".overlay");
let modal1 = document.querySelector(".modal1");
let modal2 = document.querySelector(".modal2");

export let tableauSuppression = [];

export function affichageModal() {
  modal1.style.display = "flex";
  overlay.style.display = "block";
  modal1.style.display = "flex";
  modal1.removeAttribute("aria-hidden");
  modal1.setAttribute("aria-modal", "true");
  modal1.innerHTML = `
    <div class="divBoutonFermer">
            <button class="modal-bouton-fermer"><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M11.6546 2.05106C12.1235 1.58214 12.1235 0.820611 11.6546 0.351691C11.1856 -0.11723 10.4241 -0.11723 9.95519 0.351691L6.005 4.30563L2.05106 0.355442C1.58214 -0.113479 0.820611 -0.113479 0.351691 0.355442C-0.11723 0.824363 -0.11723 1.58589 0.351691 2.05481L4.30563 6.005L0.355442 9.95894C-0.113479 10.4279 -0.113479 11.1894 0.355442 11.6583C0.824363 12.1272 1.58589 12.1272 2.05481 11.6583L6.005 7.70437L9.95894 11.6546C10.4279 12.1235 11.1894 12.1235 11.6583 11.6546C12.1272 11.1856 12.1272 10.4241 11.6583 9.95519L7.70437 6.005L11.6546 2.05106Z" fill="black"/>
            </svg></button>
            </div>
        <p class="modal1-title">Galerie photo</p>
        <div class="modal1-photos"></div>
        
        <hr>
        <button class="modal1-ajouter-une-photo">Ajouter une photo</button>
        <button class="modal1-deleteAll">Supprimer la galerie</button>
        `;

  // Récuperation de la div "Modal1-photos" si elle existe
  let modal1Photos = document.querySelector(".modal1-photos");

  // On appelle la fonction pour créer les photos une par une et les ajouter dans la modal1
  travauxBis.forEach((work) => {
    
    
    let figModal = createPhotoModal(work);
    modal1Photos.appendChild(figModal);
  });

  // On appelle la fonction pour afficher les projets sur la page principale
  genererAffichageTravaux(travauxBis);

  // On appelle la fonction qui permet de gérer les évenements sur le bouton fermer
  ajouterEvenementsBoutons();
  // EventListener sur les icones poubelles des photos de la modal pour les supprimer individuellement
  suppressionPhoto();

  deletePhotoGalleryEdition();
  // EventListener pour supprimer tous les travaux
  let btnDeleteAll = document.querySelector(".modal1-deleteAll");
  deleteAll(btnDeleteAll);
  /**
   * Fonction pour ajouter le bouton Fermer sur la modal 1 */
  function ajouterEvenementsBoutons() {
    const boutonFermer = document.querySelector(".modal-bouton-fermer");
    if (boutonFermer) {
      boutonFermer.addEventListener("click", () => {
        closeModals();
      });
    }
  }

  // Fonction pour permettre la fermeture des modales lors d'un clic en dehors
  function handleClickOutsideModal(event) {
    if (
      (event.target === overlay && event.target !== modal1) ||
      (event.target === document &&
        event.target !== modal1 &&
        event.target !== modal2)
    ) {
      closeModals();
    }
  }

  // EventListener pour écouter les clicks en dehors des modales
  document.addEventListener("click", handleClickOutsideModal);

  /**
   * Ajout du listener pour ouvrir la Modal2
   */
  let btnAjouterUnePhoto = document.querySelector(".modal1-ajouter-une-photo");
  btnAjouterUnePhoto.addEventListener("click", () => {
    affichageModal2();
  });
}

/**
 * Fonction pour fermer les deux modales
 *
 */
export function closeModals() {
  modal1.style.display = "none";
  modal2.style.display = "none";
  overlay.style.display = null;

  modal1.setAttribute("aria-hidden", "true");
  modal1.removeAttribute("aria-modal");
  modal2.setAttribute("aria-hidden", "true");
  modal2.removeAttribute("aria-modal");
}

/**
 * Fonction pour créer les élements et images dans la modal
 * Retourne un objet DOM à ajouter à un conteneur parent
 */
export function createPhotoModal(work) {
  // Création des éléments du DOM
  let figGallery = document.createElement("figure");
  figGallery.setAttribute("data-id", `${work.id}`);
  let figCaptionGallery = document.createElement("figcaption");

  // Uniquement les images !!
  figGallery.innerHTML = `<img src = "${work.imageUrl}"></img>`;
  figCaptionGallery.innerText = "éditer";

  // Création des boutons pour la figure
  const divBoutons = document.createElement("div");
  const boutonMove = document.createElement("button");
  const boutonDelete = document.createElement("button");
  // Bouton move
  boutonMove.classList.add("movePhoto");
  boutonMove.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none"  >
          <rect width="17" height="17" rx="2" fill="none" />
          <path  d="M9.05089 3.20363C8.77938 2.93212 8.33845 2.93212 8.06694 3.20363L6.6768 4.59377C6.40529 4.86528 6.40529 5.30621 6.6768 5.57772C6.94831 5.84924 7.38925 5.84924 7.66076 5.57772L7.86493 5.37355V7.86493H5.37355L5.57772 7.66076C5.84924 7.38925 5.84924 6.94831 5.57772 6.6768C5.30621 6.40529 4.86528 6.40529 4.59377 6.6768L3.20363 8.06694C2.93212 8.33845 2.93212 8.77938 3.20363 9.05089L4.59377 10.441C4.86528 10.7125 5.30621 10.7125 5.57772 10.441C5.84924 10.1695 5.84924 9.72858 5.57772 9.45707L5.37355 9.2529H7.86493V11.7465L7.66076 11.5423C7.38925 11.2708 6.94831 11.2708 6.6768 11.5423C6.40529 11.8138 6.40529 12.2547 6.6768 12.5262L8.06694 13.9164C8.33845 14.1879 8.77938 14.1879 9.05089 13.9164L10.441 12.5262C10.7125 12.2547 10.7125 11.8138 10.441 11.5423C10.1695 11.2708 9.72858 11.2708 9.45707 11.5423L9.2529 11.7465V9.25507H11.7465L11.5423 9.45924C11.2708 9.73076 11.2708 10.1717 11.5423 10.4432C11.8138 10.7147 12.2547 10.7147 12.5262 10.4432L13.9164 9.05306C14.1879 8.78155 14.1879 8.34062 13.9164 8.06911L12.5262 6.67897C12.2547 6.40746 11.8138 6.40746 11.5423 6.67897C11.2708 6.95048 11.2708 7.39142 11.5423 7.66293L11.7465 7.8671H9.25507V5.37355L9.45924 5.57772C9.73076 5.84924 10.1717 5.84924 10.4432 5.57772C10.7147 5.30621 10.7147 4.86528 10.4432 4.59377L9.05306 3.20363H9.05089Z" fill="white"/>
              </svg>`;
  boutonMove.style.display = "none";
  // Bouton Delete
  boutonDelete.classList.add("deletePhoto");
  boutonDelete.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="9" height="11" viewBox="0 0 9 11" fill="none">
          <path d="M2.71607 0.35558C2.82455 0.136607 3.04754 0 3.29063 0H5.70938C5.95246 0 6.17545 0.136607 6.28393 0.35558L6.42857 0.642857H8.35714C8.71272 0.642857 9 0.930134 9 1.28571C9 1.64129 8.71272 1.92857 8.35714 1.92857H0.642857C0.287277 1.92857 0 1.64129 0 1.28571C0 0.930134 0.287277 0.642857 0.642857 0.642857H2.57143L2.71607 0.35558ZM0.642857 2.57143H8.35714V9C8.35714 9.70915 7.78058 10.2857 7.07143 10.2857H1.92857C1.21942 10.2857 0.642857 9.70915 0.642857 9V2.57143ZM2.57143 3.85714C2.39464 3.85714 2.25 4.00179 2.25 4.17857V8.67857C2.25 8.85536 2.39464 9 2.57143 9C2.74821 9 2.89286 8.85536 2.89286 8.67857V4.17857C2.89286 4.00179 2.74821 3.85714 2.57143 3.85714ZM4.5 3.85714C4.32321 3.85714 4.17857 4.00179 4.17857 4.17857V8.67857C4.17857 8.85536 4.32321 9 4.5 9C4.67679 9 4.82143 8.85536 4.82143 8.67857V4.17857C4.82143 4.00179 4.67679 3.85714 4.5 3.85714ZM6.42857 3.85714C6.25179 3.85714 6.10714 4.00179 6.10714 4.17857V8.67857C6.10714 8.85536 6.25179 9 6.42857 9C6.60536 9 6.75 8.85536 6.75 8.67857V4.17857C6.75 4.00179 6.60536 3.85714 6.42857 3.85714Z" fill="white"/>
        </svg>`;
  // Attribuer le bon ID au bouton delete
  boutonDelete.setAttribute("data-id", `${work.id}`);

  // DivBoutons
  divBoutons.classList.add("boutons");
  // Ajout des boutons à la div bouton et sur la figure
  divBoutons.appendChild(boutonDelete);
  divBoutons.appendChild(boutonMove);
  figGallery.appendChild(divBoutons);
  figGallery.appendChild(figCaptionGallery);

  // on gère l'apparition du boutonMove
  figGallery.addEventListener("mouseenter", () => {
    boutonMove.style.display = "block";
  });

  figGallery.addEventListener("mouseleave", () => {
    boutonMove.style.display = "none";
  });

  // On retourne l'objet DOM "figure" crée
  return figGallery;
}
/**
 *Fonction pour créer les élements et images dans la galerie
 * Retourne un objet Dom à ajouter au conteneur parent
 * @returns
 */
export function createPhotoGallery(work) {
  let figGallery = document.createElement("figure");
  figGallery.setAttribute("data-id", `${work.id}`);
  let figCaptionGallery = document.createElement("figcaption");
  figGallery.innerHTML = `<img src = "${work.imageUrl}" alt = ${work.title} ></img>`;
  figCaptionGallery.innerText = work.title;

  figGallery.appendChild(figCaptionGallery);
  return figGallery;
}
/**
 * Fonction pour supprimer une photo de la liste
 * On récupère son id pour la supprimer de l'API plus tard
 */ export function suppressionPhoto() {
  let figures = document.querySelectorAll("figure");
  figures.forEach((fig) => {
    let boutonsDelete = fig.querySelectorAll(".deletePhoto");
    // Suppression de la modal et du tableau travauxBis
    boutonsDelete.forEach((boutonDelete) => {
      boutonDelete.addEventListener("click", () => {
        // On récupère l'id du bouton et de la figure sélectionnée
        let dataId = boutonDelete.dataset.id;
        // On désactive l'affichage de la figure dans la modal1
        fig.remove();
        // On efface la figure dans la galerie principale du mode Edition
        deletePhotoGalleryEdition(dataId);
        // On retire cette figure du tableau de travauxBis et on ajoute l'id au tableau de suppression
        travauxBis.splice(dataId - 1, 1);
        tableauSuppression.push(dataId);
      });
    });
  });
}
/**
 * Fonction pour supprimer les photos dans la galerie principale du mode Edition
 */
function deletePhotoGalleryEdition(dataId) {
  let figures = document.querySelectorAll("figure");
  figures.forEach((fig) => {
    if (fig.getAttribute("data-id") === dataId) {
      fig.style.display = "none";
    }
  });
}

function deleteAll(btnDeleteAll) {
  let figures = document.querySelectorAll("figure");
  btnDeleteAll.addEventListener("click", () => {
    let confirmation = confirm(
      "Attention ! Voulez-vous vraiment supprimer l'ensemble des travaux ?"
    );
    if (confirmation) {
      figures.forEach((fig) => {
        if (fig.classList.contains("fig-sophie-bluel")) {
          // On ne supprime pas la figure qui contient la photo de l'architecte
        } else {
          // On ajoute chaque id au tableau de suppression
          tableauSuppression.push(fig.dataset.id);
          // on retire les figures
          fig.remove();
        }
      });
    }
  });
}

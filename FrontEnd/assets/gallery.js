/**
 *Fonction qui génère l'affiche des travaux avec {travaux} en paramètre, en fonction de l'endroit de la page où elle doit être
 * */
export function genererAffichageTravaux(travaux) {
   
  
    // Récuperation de la div "Porfolio" et de la div "Gallery" si elle existe
    let container = document.getElementById("portfolio");
    let divGallery = document.querySelector(".gallery");
    // Suppression de la div Gallery existante
    if (divGallery) {
      divGallery.remove();
    }

    // Création des éléments de la div Gallery du HTML
    divGallery = document.createElement("div");
    divGallery.className = "gallery";

    // Boucle pour créer les éléments dans la galerie
    for (let i = 0; i < travaux.length; i++) {
      let figGallery = document.createElement("figure");
      figGallery.setAttribute("data-id",`${travaux[i].id}`)
      let figCaptionGallery = document.createElement("figcaption");
      figGallery.innerHTML = `<img src = "${travaux[i].imageUrl}" alt = ${travaux[i].title} ></img>`;
      figCaptionGallery.innerText = travaux[i].title;

      figGallery.appendChild(figCaptionGallery);
      divGallery.appendChild(figGallery);
    }
    // Ajout de la divGallery à la section Portfolio
    container.appendChild(divGallery);
  }

/**
 * Fonction qui gère la récupération et l'affichage des catégories
 */
export async function genererCategories() {
  let select = document.querySelector(".formModal2 select");

  let categories = null;
  categories = await fetch("http://localhost:5678/api/categories").then(
    (categories) => categories.json()
  );
  if (categories !== null) {
    for (let i = 0; i < categories.length; i++) {
      let option = document.createElement("option");
      option.value = categories[i].name;
      option.id = categories[i].id;
      option.innerText = categories[i].name;
      select.appendChild(option);
    }
  }
}


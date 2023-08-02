/**
 * Fonction de validation du mail
 * @param {email} email
 */
function validateMail(email) {
  const regexMail = new RegExp("^[a-z0-9._-]+@[a-z0-9._-]+.[a-z0-9._-]+$");
  console.log(email);
  if (regexMail.test(email) == false) {
      console.log(email)
    throw new Error(`L'email ${email} n'est pas valide.`);
  }
}
/**
 * Fonction de validation du mot de passe
 * @param {*} password
 */
function validatePassword(password) {
    const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{3,}$/gm;
    
    if (regexPassword.test(password) == false) {
      console.log(password);
      throw new Error(`Le mot de passe est incorrect.`);
    }
  }
  

/**
 * Listener sur le submit pour se connecter à son espace
 */
let form = document.querySelector("form");

form.addEventListener("submit", async (event) => {
  try {
    event.preventDefault();

    let email = document.querySelector("form input[type = email]").value;
    validateMail(email);

    let password = document.querySelector("form input[type = password]").value;
    validatePassword(password);
    // traitement du formulaire
    // ...
    let response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

     if (response.ok) {
   
        // La demande de connexion a réussi
        // Récupère les données JSON de la réponse
        let data = await response.json();
        console.log(data);
        // Récupère l'userId et l'accessToken depuis les données du backend et les stocke dans des variables & dans le local storage
        const userId = data.userId;
        const token = data.token;
        // Enregistre les données userId et token dans le local storage
        sessionStorage.setItem("userId",userId);
        sessionStorage.setItem("token",token);
  
        console.log('ID de l\'utilisateur:', userId);
        console.log('Jetons d\'accès:', token);
  
        // Poursuivre pour rediriger l'utilisateur vers une autre page
        window.location.href = "index.html";
        
    } else {
      // La demande de connexion a échoué
      alert("Erreur dans l'identifiant ou le mot de passe " + error.message);
    }
  } catch (error) {
    alert("Erreur dans l'identifiant ou le mot de passe. " + error.message);
  
  }
});

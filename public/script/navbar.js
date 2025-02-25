// Skript für die Navbar

/* Prüft, ob der Nutzer eingeloggt ist und passt die Navbar an (aus dem Anmelde Knopf wird ein Profilbutton*/
document.addEventListener("DOMContentLoaded", function () {
  fetch("/check-login")
      .then(response => response.json())
      .then(data => {
          document.querySelectorAll(".login-button").forEach(navUser => {
              if (data.loggedIn) {
                  navUser.innerHTML = `${data.username}`;
                  navUser.onclick = function () {window.location = "/profile";};
              }
        });
      })
      .catch(error => console.error("Fehler beim Laden des Login-Status:", error));
});
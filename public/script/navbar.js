// Skript für die Navbar

// Prüfen ob der Benutzer eingeloggt ist => Benutzernamen in der NavBar anzeigen
document.addEventListener("DOMContentLoaded", function () {

    // GET-Anfrage an /check-login
    fetch("/check-login")
        .then(response => response.json())
        .then(data => {
            // Login-Button ändern und Link auf /profile ändern
            document.querySelectorAll(".login-button").forEach(navUser => {
                if (data.loggedIn) {
                    navUser.innerHTML = `${data.username}`;
                    navUser.onclick = function () {window.location = "/profile";};
                }
            });
        })
        .catch(error => console.error("Fehler beim Laden des Login-Status:", error));
});
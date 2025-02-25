// Skript für profile.html
// Lädt die Profildaten vom Server und zeigt sie an.

// Werte laden und einsetzen
document.addEventListener("DOMContentLoaded", function () {

    // Get-Anfrage an /get-profile
    fetch("/get-profile")
        .then(response => response.json())
        .then(data => {
            // Daten in der Html rendern
            document.getElementById("username").innerText = data.username || "";
            document.getElementById("password").setAttribute("data-password", data.password);
            document.getElementById("bmi").innerText = data.bmi || "";
            document.getElementById("calories").innerText = data.calories || "";
            document.getElementById("repmax").innerText = data.repmax || "";
        })
        .catch(error => console.error("Fehler beim Laden des Profils", error));

        // Funktion, um das Passwort zu verbergen / zu zeigen
        document.getElementById("password").addEventListener("click", function () {
            let actualPassword = this.getAttribute("data-password");
            
            // Prüfen, ob das Passwort schon sichtbar ist
            if (this.innerText === "******") {
                this.innerText = actualPassword;
            } else {
                this.innerText = "******";
            }
        });
  });
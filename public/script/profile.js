// Werte laden und einsetzen
document.addEventListener("DOMContentLoaded", function () {
    fetch("/get-profile")
        .then(response => response.json())
        .then(data => {
            document.getElementById("username").innerText = data.username || "";
            //document.getElementById("password").data = data.password || "";
            document.getElementById("password").setAttribute("data-password", data.password);
            document.getElementById("bmi").innerText = data.bmi || "";
            document.getElementById("calories").innerText = data.calories || "";
            document.getElementById("repmax").innerText = data.repmax || "";
        })
        .catch(error => console.error("Fehler beim Laden des Profils", error));

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
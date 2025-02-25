// Main-Skript für restlichen Funktionen


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

/* Rechner für den Grundumsatz nach Harris-Benedict */
function calculateCalories() {
  const age = parseFloat(document.getElementById("age").value);
  const height = parseFloat(document.getElementById("height").value);
  const weight = parseFloat(document.getElementById("weight").value);
  const gender = document.getElementById("gender").value;
  const goal = document.getElementById("goal").value;

  if (isNaN(age) || isNaN(height) || isNaN(weight) || age <= 0 || height <= 0 || weight <= 0 || height > 300 || weight > 300) {
    document.getElementById("calories-result").innerText = "Bitte gib gültige Nummern an.";
    return;
  }

  let bmr;
  if (gender === "male") {
    bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
  } else {
    bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
  }

  let calories;
  if (goal === "lose") {
    calories = bmr - 500;
  } else {
    calories = bmr + 500;
  }

  if (calories < 0) {
    calories = 0;
  }

  document.getElementById(
    "calories-result"
  ).innerText = `Du solltest täglich ${calories.toFixed(
    2
  )} Kalorien zu dir nehmen.`;
}

/* Rechner für den BMI */
function calculateBMI() {
  const height = parseFloat(document.getElementById("bmi-height").value) / 100;
  const weight = parseFloat(document.getElementById("bmi-weight").value);

  if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0 || height > 3 || weight > 300) {
    document.getElementById("bmi-result").innerText = "Bitte gib gültige Nummern an.";
    return;
  }

  const bmi = weight / (height * height);

  document.getElementById(
    "bmi-result"
  ).innerText = `Dein BMI beträgt: ${bmi.toFixed(2)}`;
}

/* Rechner für den 1RM nach Epley */
function calculate1RM() {
  const weight = parseFloat(document.getElementById("repmax-weight").value);
  const reps = parseFloat(document.getElementById("repmax-reps").value);

  if (isNaN(weight) || isNaN(reps) || weight <= 0 || reps <= 0) {
    document.getElementById("repmax-result").innerText = "Bitte gib gültige Nummern an.";
    return;
  }

  const oneRepMax = weight * (1 + reps / 30);

  document.getElementById("repmax-result").innerText = `Dein Erwarteter PR ist: ${oneRepMax.toFixed(2)}kg`;
}

/* Sendet errechnete Daten an den Server*/
function sendData() {
  /* Errechnete Werte */
  var bmi = document.getElementById("bmi-result").innerText;
  var calories = document.getElementById("calories-result").innerText;
  var repmax = document.getElementById("repmax-result").innerText;

  fetch("/calculator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bmi: bmi, calories: calories, repmax: repmax })
  })
  .then(response => response.json())
  .then(data => console.log("Server-Antwort:", data))
  .catch(error => console.error("Fehler:", error));

  alert("Werte wurden in deinem Profil gespeichert.")
}

/* Überprüft, ob die Passwörter beim registrieren übereinstimmen */
function submitForm() {
  var passwordInput = document.getElementById("password-input");
  var confirmPasswordInput = document.getElementById("confirm-password-input");
  var form = document.getElementById("register-form");

  if (passwordInput.value != confirmPasswordInput.value) {
    event.preventDefault();
    window.alert("Passwörter stimmen nicht überein.");
    return false;
  }

  return true;
}

/* Löscht den Account des Nutzers */
function deleteUser() {
  fetch("/delete")
  .then(() => {
    alert("Ihr Account wurde gelöscht.");
    window.location.href = "/login";
  })
  .catch(error => console.error("Fehler:", error));
}
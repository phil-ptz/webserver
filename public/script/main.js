document.addEventListener("DOMContentLoaded", function () {
  // check if user is logged => change navbar accordingly
  fetch("/check-login")
      .then(res => res.json())
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

function calculateCalories() {
  const age = document.getElementById("age").value;
  const height = document.getElementById("height").value;
  const weight = document.getElementById("weight").value;
  const gender = document.getElementById("gender").value;
  const goal = document.getElementById("goal").value;

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

  document.getElementById(
    "calories-result"
  ).innerText = `Du solltest täglich ${calories.toFixed(
    2
  )} Kalorien zu dir nehmen.`;
}

function calculateBMI() {
  const height = document.getElementById("bmi-height").value / 100;
  const weight = document.getElementById("bmi-weight").value;

  const bmi = weight / (height * height);

  document.getElementById(
    "bmi-result"
  ).innerText = `Dein BMI beträgt: ${bmi.toFixed(2)}`;
}

function calculate1RM() {
  const weight = parseFloat(document.getElementById("repmax-weight").value);
  const reps = parseFloat(document.getElementById("repmax-reps").value);

  if (isNaN(weight) || isNaN(reps) || weight <= 0 || reps <= 0) {
    document.getElementById("repmax-result").innerText = "Bitte gib gültige Nummern an.";
    return;
  }

  const oneRepMax = weight * (1 + reps / 30);

  document.getElementById("repmax-result").innerText = `Dein Erwarteter PR ist: ${oneRepMax.toFixed(2)}`;
}

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

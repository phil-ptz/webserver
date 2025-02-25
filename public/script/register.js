// Skript welches schon clientseitig den Submit stoppt, wenn die Passwörter nicht übereinstimmen

function submitForm() {

    // Passwörter
    var passwordInput = document.getElementById("password-input");
    var confirmPasswordInput = document.getElementById("confirm-password-input");
  
    // Submit stoppen bei falschen Passwörtern
    if (passwordInput.value != confirmPasswordInput.value) {
      event.preventDefault();
      window.alert("Passwörter stimmen nicht überein.");
      return false;
    }
  
    return true;
}
function submitForm() {
    var passwordInput = document.getElementById("password-input");
    var confirmPasswordInput = document.getElementById("confirm-password-input");
    var form = document.getElementById("register-form")

    if (passwordInput.value != confirmPasswordInput.value) {
        event.preventDefault(); 
        window.alert("Passwörter stimmen nicht überein.");
        return false;
    }

    return true;
  }
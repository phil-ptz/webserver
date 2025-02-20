function submitForm(event) {
    var passwordInput = document.getElementById("password-input");
    var confirmPasswordInput = document.getElementById("confirm-password-input");
    var form = document.getElementById("register-form")

    if (passwordInput.value != confirmPasswordInput.value) {
        event.preventDefault();
        window.alert("no password match");
        return false;
    }
  }
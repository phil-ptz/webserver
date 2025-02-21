function calculateCalories() {
    const age = document.getElementById('age').value;
    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;
    const gender = document.getElementById('gender').value;
    const goal = document.getElementById('goal').value;

    let bmr;
    if (gender === 'male') {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    let calories;
    if (goal === 'lose') {
        calories = bmr - 500;
    } else {
        calories = bmr + 500;
    }

    document.getElementById('result').innerText = `Your daily calorie intake should be: ${calories.toFixed(2)} calories.`;
}

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
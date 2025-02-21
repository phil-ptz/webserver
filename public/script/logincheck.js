function isLoggedIn() {
  return true;
}

document.addEventListener("DOMContentLoaded", function () {
  if (!isLoggedIn()) {
    document
      .getElementById("calorie-link")
      .addEventListener("click", function (event) {
        event.preventDefault();
        alert(
          "Du musst angemeldet sein, um den Kalorienrechner verwenden zu können."
        );
      });

    document
      .getElementById("training-link")
      .addEventListener("click", function (event) {
        event.preventDefault();
        alert(
          "Du musst angemeldet sein, um den Trainingsplan verwenden zu können."
        );
      });
  }
});

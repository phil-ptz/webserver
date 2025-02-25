/* Cookie-Banner */
function acceptCookies() {
    document.getElementById('cookie-banner').style.display = 'none';
    document.cookie = "cookiesAccepted=true; max-age=" + 60 * 60 * 24 * 365 + "; path=/";
  }
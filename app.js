document.addEventListener("DOMContentLoaded", function () {
  checkSession(); // Check session status before automatically redirecting to login
  loadUsername(); // Load the username if the user is logged in
});

function checkSession() {
  fetch("/check-session")
    .then((response) => {
      if (response.ok) {
        // Session is active, user is logged in
        loadPage("forums");
      } else {
        // Session is not active, user is not logged in
        login();
      }
    })
    .catch((error) => {
      console.error("Error checking session:", error);
      login();
    });
}

function loadUsername() {
  fetch("/get-username")
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to fetch username");
      }
    })
    .then((data) => {
      // Display the username in the sidebar
      const usernameElement = document.querySelector(
        ".sessioner-user-username"
      );
      if (usernameElement) {
        usernameElement.textContent = data.username;
      }
    })
    .catch((error) => {
      console.error("Error fetching username:", error);
    });
}
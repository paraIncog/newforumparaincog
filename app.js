document.addEventListener("DOMContentLoaded", function () {
    checkSession(); // Check session status before automatically redirecting to login
    loadUsername(); // Load the username if the user is logged in
});

function checkSession() {
    fetch("/check-session") // Endpoint to check session status
    .then(response => {
        if (response.ok) {
            // Session is active, user is logged in
            loadPage("forums"); // Redirect to the forums page or any other authenticated page
        } else {
            // Session is not active, user is not logged in
            login(); // Redirect to the login page
        }
    })
    .catch(error => {
        console.error("Error checking session:", error);
        login(); // Redirect to the login page in case of an error
    });
}

function loadUsername() {
    fetch("/get-username") // Endpoint to fetch the username
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Failed to fetch username");
        }
    })
    .then(data => {
        // Display the username in the sidebar
        const usernameElement = document.querySelector(".sessioner-user-username");
        if (usernameElement) {
            usernameElement.textContent = data.username;
        }
    })
    .catch(error => {
        console.error("Error fetching username:", error);
    });
}

function logout() {
    fetch("/logout")
      .then(response => {
        if (response.ok) {
          // Session successfully destroyed, redirect to login page
          window.location.href = "/"; // Redirect to login page
        } else {
          console.error("Logout failed");
        }
      })
      .catch(error => {
        console.error("Error logging out:", error);
      });
  }
  
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

        // Establish WebSocket connection
        fetch("/get-username")
          .then((response) => response.json())
          .then((data) => {
            const userId = data.userid;
            const socket = new WebSocket(`ws://localhost:4000/ws?userID=${userId}`);
            socket.addEventListener('open', function (event) {
              console.log('Connected to WebSocket server');
              // Send the session ID to the server to associate the WebSocket connection with the session
              socket.send(JSON.stringify({ type: 'username', username: data.username }));
            });
          })
          .catch((error) => {
            console.error("Error fetching username:", error);
          });
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
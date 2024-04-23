document.addEventListener("DOMContentLoaded", function () {
  checkSessionAndLoadUsername(); // Check session status before automatically redirecting to login
});

let socket = null;

function checkSessionAndLoadUsername() {
  fetch("/check-session")
    .then((response) => {
      if (response.ok) {
        loadPage("forums");
        return fetch("/get-username");
      } else {
        login();
      }
    })
    .then((response) => response.json())
    .then((data) => {
      const usernameElement = document.querySelector(
        ".sessioner-user-username"
      );
      if (usernameElement) {
        usernameElement.textContent = data.username;
          const userId = data.userid;
          socket = WebSocket(`ws://localhost:4000/ws?userID=${userId}`);
          socket.addEventListener("open", (event) => {
            socket.send(
              JSON.stringify({ type: "username", username: data.username })
            );
          });
      }
    })
    .catch((error) => console.error("Error checking session:", error));
}
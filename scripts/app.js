var socket = null;

function setupWebSocket(userId) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    socket = new WebSocket(`ws://localhost:4000/ws?userID=${userId}`);
    socket.onopen = function () { };

    // Setup to handle incoming WebSocket messages
    socket.onmessage = function (event) {
      var data = JSON.parse(event.data);
      if (data.type === "message") {
        // Check if the current chat is with the sender
        const currentChatUser = sessionStorage.getItem("currentChatUser");
        if (currentChatUser === data.fromUsername) {
          displayMessage(data.message, data.fromUsername);
        } else {
          displayNotification(data.fromUsername);
        }
      }
    };

    socket.onerror = function (event) {
      console.error("WebSocket error observed:", event);
    };

    socket.onclose = function () {
      socket = null;
    };
  }
}

let notificationCount = 0;

function displayNotification(username) {
  const notificationArea = document.getElementById("notification-area");
  const notification = document.createElement("div");
  notification.className = "notification";
  `notification-${notificationCount++}`;
  notification.innerHTML = `Message from ${username}`;
  notification.onclick = function () {
    openChat(username);
    notificationArea.removeChild(notification);
  };
  notificationArea.appendChild(notification);
}

function displayMessage(message, username) {
  const chatDisplay = document.getElementById("chat-display");
  const messageDiv = document.createElement("div");

  messageDiv.innerHTML = `
    <div class="single-chat">
      <div class="single-chat-thread bg-gray">
        ${message}
        <div class="row">
          <div class="single-forum-thread-uname">
            ${username}
          </div>
          <div class="single-forum-thread-time bg-gray">Recently</div>
        </div>
      </div>
    </div>
  `;
  chatDisplay.appendChild(messageDiv);
  chatDisplay.scrollTop = 0;
}

document.addEventListener("DOMContentLoaded", function () {
  checkSessionAndLoadUsername();
});

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
      const usernameElement = document.querySelector(".sessioner-username");
      if (usernameElement) {
        usernameElement.textContent = data.username;
        const userId = data.userid;
        setupWebSocket(userId);
      }
    })
    .catch((error) => console.error("Error checking session:", error));
}

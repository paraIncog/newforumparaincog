function login() {
  const mainContent = document.getElementById("main-content");
  const sidebarContent = document.getElementById("sidebar-content");
  mainContent.innerHTML = `
      <div class="container">
          <div class="primary-page-desc txt-prim bg-white">
              Login
          </div>
          <div class="logincontainer">
              <form id="loginForm">
                  <div class="login-txtinput">
                      Username <input id="username" class="login" type="text" minlength="3" required>
                  </div>
                  <div class="login-txtinput">
                      Password <input id="password" class="login" type="password" minlength="6" required>
                  </div>
                  <div id="error-message" class="error-message">
                  </div>
                  <div class="login-txtinput">
                      <button type="submit" class="login bg-prim">Login</button>
                  </div>
              </form>
          </div>
          <div class="logincontainer">
              Don't have an account? <span class="login-to-registration clickable txt-scnd" onclick="register()">Register here</span>
          </div>
      </div>
  `;
  sidebarContent.innerHTML = `
      <div>
          <div class="back-arrow txt-scnd clickable" onClick="loadPage('pms')">
              Back
          </div>
      </div>
  `;

  // Add event listener for form submission
  document
    .getElementById("loginForm")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent default form submission behavior
      const formData = new FormData(this); // Get form data

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data.error) {
            // Display error message
            const errorMessage = document.getElementById("error-message");
            errorMessage.textContent = data.error;
          } else {
            // Successful login, display message
            console.log("Congrats, " + username + "!");
            loadPage("forums"); // Load main content page after successful login
            document.querySelector(".sessioner-user-username").textContent = data.username; // Set the username in the placeholder
            
            checkSession();
            loadUsername();

            // Establish WebSocket connection after successful login
            const socket = new WebSocket('ws://localhost:4000/ws');
            socket.addEventListener('open', function (event) {
              console.log('Connected to WebSocket server');
              // Send the session ID to the server to associate the WebSocket connection with the session
              const sessionID = document.cookie.replace(/(?:(?:^|.*;\s*)connect\.sid\s*\=\s*([^;]*).*$)|^.*$/, "$1");
              socket.send(JSON.stringify({ type: 'sessionID', sessionID }));
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
}

function logout() {
  // Close WebSocket connection
  const socket = new WebSocket('ws://localhost:4000/ws');
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close();
    console.log("WebSocket connection closed");
  }

  fetch("/logout")
    .then((response) => {
      if (response.ok) {
        // Session successfully destroyed, redirect to login page
        window.location.href = "/"; // Redirect to login page
      } else {
        console.error("Logout failed");
      }
    })
    .catch((error) => {
      console.error("Error logging out:", error);
    });
}

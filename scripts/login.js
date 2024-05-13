function login() {
  const mainContent = document.getElementById("main-content");
  const sidebarContent = document.getElementById("sidebar-content");
  mainContent.innerHTML = `
    <div class="container">
      <div class="primary-page-desc txt-prim bg-white">Login</div>
        <div class="logincontainer">
          <form id="loginForm">
            <div class="login-txtinput">
              Username <input id="username" class="login" type="text" required>
            </div>
            <div class="login-txtinput">
              Password <input id="password" class="login" type="password" required>
            </div>
            <div id="error-message" class="error-message"></div>
            <div class="login-txtinput">
              <button type="submit" class="login bg-prim">Login</button>
            </div>
          </form>
        </div>
        <div class="logincontainer">
          Don't have an account? <span class="login-to-registration clickable txt-scnd" onclick="register()">Register here</span>
        </div>
      </div>
    </div>
  `;
  sidebarContent.innerHTML = `
    <div>
      <div class="back-arrow txt-scnd clickable" onClick="loadPage('pms')">Back</div>
    </div>
  `;

  // Add event listener for form submission
  document
    .getElementById("loginForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const formData = new FormData(this);

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
            const errorMessage = document.getElementById("error-message");
            errorMessage.textContent = data.error;
          } else {
            // Successful login
            console.log("Congrats, " + username + "!");
            document.querySelector(".sessioner-username").textContent = data.username; // Set the username in the placeholder
            
            checkSessionAndLoadUsername();

            console.log(data)
            setupWebSocket(data.userid);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
}

function logout() {
  // Close WebSocket connection
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close();
    socket = null;
    console.log("WebSocket connection closed");
  }

  fetch("/logout")
    .then((response) => {
      if (response.ok) {
        // Session successfully ended, redirect to login page
        window.location.href = "/";
      } else {
        console.error("Logout failed");
      }
    })

    .catch((error) => {
      console.error("Error logging out:", error);
    });
}
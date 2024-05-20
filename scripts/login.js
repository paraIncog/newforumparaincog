function login() {
  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = `
    <div class="container">
      <div class="primary-page-desc txt-prim bg-white">Login</div>
        <div class="logincontainer">
          <form id="loginForm">
            <div class="login-txtinput">
              Username / Email <input id="loginId" class="login" type="text" minlength="3" required>
            </div>
            <div class="login-txtinput">
              Password <input id="password" class="login" type="password" minlength="8" required>
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

  // Add event listener for form submission
  document
    .getElementById("loginForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const loginId = document.getElementById("loginId").value;
      const password = document.getElementById("password").value;

      fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId, password })
      })

      .then(response => response.json())

      .then((data) => {
        if (data.error) {
          const errorMessage = document.getElementById("error-message");
          errorMessage.textContent = data.error;
          errorMessage.style.color = 'red';
        } else {
          // document.querySelector(".sessioner-username").textContent = data.username;
          checkSessionAndLoadUsername();
          setupWebSocket(data.userid);
        }
      })
      
      .catch((error) => {
        console.error("Error:", error);
      });
    }
  );
}

function logout() {
  // Close WebSocket connection
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close();
    socket = null;
  }

  fetch("/logout")
    .then((response) => {
      if (response.ok) {
        window.location.href = "/";
      } else {
        console.error("Logout failed");
      }
    })

    .catch((error) => {
      console.error("Error logging out:", error);
    });
}
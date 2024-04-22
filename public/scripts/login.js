function login() {
  const mainContent = document.getElementById("main-content");
  const sidebarContent = document.getElementById("sidebar-content");
  mainContent.innerHTML = `
    <div class="container">
      <div class="primary-page-desc txt-prim bg-white">Login</div>
        <div class="logincontainer">
          <form id="form-login">
            <div class="login-txtinput">
              name <input id="name" class="login" type="text" required>
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
    .getElementById("form-login")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const name = document.getElementById("name").value;
      const password = document.getElementById("password").value;

      fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, password }),
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
            document.querySelector(".sessioner-user-name").textContent = data.name; // Set the name in the placeholder
            
            checkSessionAndLoadUsername();

            console.log(data)
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
}

function enterChat(e) {
  e.preventDefault()
  if (nameInput.value) {
    socket.emit('enterChat', {
      name: nameInput.value
    })
  }
}

function logout() {
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

function register() {
  const mainContent = document.getElementById("main-content");
  const sidebarContent = document.getElementById("sidebar-content");
  console.log(`Hello! Registration Popup had been clicked.`);
  mainContent.innerHTML = `
          <div class="container">
              <div class="primary-page-desc txt-prim bg-white">
                  Register New User
              </div>
              <div class="logincontainer">
                <form id="registerForm">
                  <div class="login-txtinput">
                    Username <input id="username" name="username" class="login" type="text" minlength="3" required>
                  </div>
                  <div class="login-txtinput">
                    Password <input id="password" name="password" class="login" type="password" minlength="6" required>
                  </div>
                  <div class="login-txtinput">
                    Firstname <input id="namefirst" name="namefirst" class="login" type="text" required>
                  </div>
                  <div class="login-txtinput">
                    Lastname <input id="namelast" name="namelast" class="login" type="text" required>
                  </div>
                  <div class="login-txtinput">
                    Email <input id="email" name="email" class="login" type="email" required>
                  </div>
                  <div class="login-txtinput">
                    Gender
                    <select id="gender" name="gender" required>
                      <option selected disabled>
                        Your Gender
                      </option>
                      <option value="male">
                        Male
                      </option>
                      <option value="female">
                        Female
                      </option>
                      <option value="other">
                        Other
                      </option>
                    </select>
                  </div>
                  <div class="login-txtinput">
                    Age <input id="age" name="age" class="login" type="number" min="1" required>
                  </div>
                  <div id="error-message" class="error-message">
                  </div>
                  <div class="login-txtinput">
                    <button type="submit" class="login bg-prim">Send Request</button>
                  </div>
                </form>
              </div>
              <div class="logincontainer">
                Already have an account? <span class="login-to-registration clickable txt-scnd" onclick="login()">Log in</span>
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
    .getElementById("registerForm")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent default form submission behavior
      const formData = new FormData(this); // Get form data

      // Construct an object with all form fields
      const userData = {
        username: formData.get("username"),
        password: formData.get("password"),
        namefirst: formData.get("namefirst"),
        namelast: formData.get("namelast"),
        email: formData.get("email"),
        gender: formData.get("gender"),
        age: formData.get("age"),
      };

      fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData), // Send all form data
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
            // Successful registration, display message
            console.log("Congrats, " + userData.username + "!");
            login();
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
}

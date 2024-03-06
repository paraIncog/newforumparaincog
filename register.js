function register() {
    const registerpopup = document.getElementById("registerpopup");
    console.log(`Hello! Login had been clicked.`);
    registerpopup.innerHTML = `
        <div>
            <h2>Login/Register</h2>
            <form id="registerForm">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username"><br><br>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password"><br><br>
                <button type="submit">Submit</button>
            </form>
        </div>
    `;

    // Add event listener for form submission
    document.getElementById("registerForm").addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent default form submission behavior
        const formData = new FormData(this); // Get form data

        // Perform your registration/login logic here, for example, send the data to the server
        // You can use fetch API to send the form data to the server endpoint

        // Example:
        fetch("/register", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Handle response from server
            console.log(data);
        })
        .catch(error => {
            console.error("Error:", error);
        });
    });
}

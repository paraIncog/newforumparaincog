function login() {
    const loginpopup = document.getElementById("loginpopup");
    console.log(`Hello! Login Popup had been clicked.`);
    loginpopup.innerHTML = `
        <div>
            Login
        </div>
    `;

    // Add event listener for form submission
    document.getElementById("loginForm").addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent default form submission behavior
        const formData = new FormData(this); // Get form data

        // Perform login logic here

        fetch("/login", {
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

document.addEventListener("DOMContentLoaded", function () {
  checkSessionAndLoadUsername(); // Check session status before automatically redirecting to login
});

const socket = io('ws://localhost:4000')

function sendMessage(e) {
  e.preventDefault()
  const input1 = document.querySelector('input1')
  if (input1.value) {
    socket.emit('message', input1.value)
    input1.value = ""
  }
  input1.focus()
}

document.querySelector('input1-form').addEventListener('submit', sendMessage)

socket.on('message', (data) => {
  const li = document.createElement('li')
  li.textContent = data
  document.querySelector('ul').appendChild(li)
})

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
        JSON.stringify({ type: "username", username: data.username })
      }
    })
    .catch((error) => console.error("Error checking session:", error));
}

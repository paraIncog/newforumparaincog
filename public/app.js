document.addEventListener("DOMContentLoaded", function () {
  checkSessionAndLoadUsername(); // Check session status before automatically redirecting to login
});

const socket = io('ws://localhost:4000')

const nameInput = document.querySelector('#name');
const usersList = document.querySelector('.user-list');
const activity = document.querySelector('.activity');
const chatDisp = document.querySelector('.chat-disp')
const msgInput = document.querySelector('msgInput');

function sendMessage(e) {
  e.preventDefault()
  if (msgInput.value) {
    socket.emit('message', msgInput.value)
    msgInput.value = ""
  }
  msgInput.focus()
}

document.querySelector('input1-form').addEventListener('submit', sendMessage)

socket.on('message', (data) => {
  activity.textContent = ""
  const li = document.createElement('li')
  li.textContent = data
  document.querySelector('ul').appendChild(li)
})

msgInput.addEventListener('keypress', () => {
  socket.emit('activity', socket.id.substring(0, 20))
})

let activityTimer
socket.on('activity', (name) => {
  activity.textContent = `${name} is typing...`
  clearTimeout(activityTimer)
  activityTimer = setTimeout(() => {
      activity.textContent = ""
  }, 1000)
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

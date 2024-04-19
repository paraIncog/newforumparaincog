document.addEventListener("DOMContentLoaded", function () {
  checkSessionAndLoadUsername(); // Check session status before automatically redirecting to login
});

const socket = io('ws://localhost:4000')

const nameInput = document.querySelector('#username');
const msgInput = document.querySelector('#msg-input');
const usersList = document.querySelector('.user-list');
const activity = document.querySelector('.activity');
const chatDisp = document.querySelector('.chat-disp')

function sendMessage(e) {
  e.preventDefault()
  if (nameInput.value && msgInput.value) {
    socket.emit('message', {username: nameInput.value, text: msgInput.value})
    msgInput.value = ""
  }
  msgInput.focus()
}

document.querySelector('.form-login').addEventListener('submit', enterChat)

document.querySelector('.form-msg').addEventListener('submit', sendMessage)

msgInput.addEventListener('keypress', () => {
  socket.emit('activity', socket.id.substring(0, 20))
})

function enterChat(e) {
  e.preventDefault()
  if (nameInput.value) {
    socket.emit('enterChat', {
      username: nameInput.value
    })
  }
}

socket.on('message', (data) => {
  activity.textContent = ""
  const { username, text, time } = data
  const li = document.createElement('li')
  li.className = 'post'

  if (username === nameInput.value) li.className = 'post post--left'
    if (username !== nameInput.value && username !== 'Pmsg') li.className = 'post post--right'
    if (username !== 'Pmsg') {
        li.innerHTML = `<div class="post__header ${username === nameInput.value
            ? 'post__header--user'
            : 'post__header--reply'
            }">
        <span class="post__header--name">${username}</span> 
        <span class="post__header--time">${time}</span> 
        </div>
        <div class="post__text">${text}</div>`
    } else {
        li.innerHTML = `<div class="post__text">${text}</div>`
    }

  document.querySelector('.chat-disp').appendChild(li)

  chatDisp.scrollTop = chatDisp.scrollHeight
})


let activityTimer
socket.on('activity', (username) => {
  activity.textContent = `${username} is typing...`
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

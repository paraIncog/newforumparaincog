document.addEventListener("DOMContentLoaded", function () {
  checkSessionAndLoadUsername(); // Check session status before automatically redirecting to login
});

const socket = io('ws://localhost:4000')

const msgInput = document.querySelector('#message')
const nameInput = document.querySelector('#name')
const chatRoom = document.querySelector('#room')
const activity = document.querySelector('.activity')
const usersList = document.querySelector('.user-list')
const chatDisplay = document.querySelector('.chat-display')

function sendMessage(e) {
  e.preventDefault()
  if (nameInput.value && msgInput.value) {
      socket.emit('message', {
          name: nameInput.value,
          text: msgInput.value
      })
      msgInput.value = ""
  }
  msgInput.focus()
}

function enterRoom(e) {
  e.preventDefault()
  if (nameInput.value) {
      socket.emit('enterRoom', {
          name: nameInput.value,
          room: ''
      })
  }
}

document.querySelector('form-msg')
    .addEventListener('submit', sendMessage)

document.querySelector('form-join')
    .addEventListener('submit', enterRoom)

msgInput.addEventListener('keypress', () => {
    socket.emit('activity', nameInput.value)
})

// Listen for messages 
socket.on("message", (data) => {
  activity.textContent = ""
  const { name, text, time } = data
  const li = document.createElement('li')
  li.className = 'post'
  if (name === nameInput.value) li.className = 'post post--left'
  if (name !== nameInput.value && name !== 'Admin') li.className = 'post post--right'
  if (name !== 'Admin') {
      li.innerHTML = `<div class="post__header ${name === nameInput.value
          ? 'post__header--user'
          : 'post__header--reply'
          }">
      <span class="post__header--name">${name}</span> 
      <span class="post__header--time">${time}</span> 
      </div>
      <div class="post__text">${text}</div>`
  } else {
      li.innerHTML = `<div class="post__text">${text}</div>`
  }
  document.querySelector('.chat-display').appendChild(li)

  chatDisplay.scrollTop = chatDisplay.scrollHeight
})

let activityTimer
socket.on("activity", (name) => {
  activity.textContent = `${name} is typing...`

  // Clear after 3 seconds 
  clearTimeout(activityTimer)
  activityTimer = setTimeout(() => {
      activity.textContent = ""
  }, 3000)
})

socket.on('userList', ({ users }) => {
  showUsers(users)
})

function showUsers(users) {
  usersList.textContent = ''
  if (users) {
      usersList.innerHTML = ``
      users.forEach((user, i) => {
          usersList.innerHTML += `<div class="pm-person-sel txt-white bg-scnd clickable" onclick="showUserInfo(${user.id})">
          <div class="pm-inner-container profilepic bg-gray">
              <!-- Profile Pic -->
          </div>
          <div class="accountname-side">
              ${user.name}
          </div>
          <!-- <div class="about-user-button">
              <span class="material-symbols-outlined">
                  more_horiz
              </span>
          </div> -->
      </div>`
          if (users.length > 1 && i !== users.length - 1) {
              usersList.innerHTML += ""
          }
      })
  }
}

function checkSessionAndLoadUsername() {
  fetch("/check-session")
    .then((response) => {
      if (response.ok) {
        loadPage("forums");
        return fetch("/get-name");
      } else {
        login();
      }
    })
    .then((response) => response.json())
    .then((data) => {
      const usernameElement = document.querySelector(
        ".sessioner-user-name"
      );
      if (usernameElement) {
        usernameElement.textContent = data.name;
        JSON.stringify({ type: "name", name: data.name })
      }
    })
    .catch((error) => console.error("Error checking session:", error));
}

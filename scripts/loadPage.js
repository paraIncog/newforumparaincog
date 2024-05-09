function loadPage(page) {
  const mainContent = document.getElementById("main-content");
  const sidebarContent = document.getElementById("sidebar-content");
  sidebarContent.innerHTML = `
    <div class="row">
      <img src="./icons/rtf_icon.png" alt="" class="iconsize">
      <div class="apptitle">
        RTF
      </div>
      <div class="notifications clickable" id="notification-area">
        <span class="material-symbols-outlined" style="display: flex; justify-content: end">
          notifications
        </span>
      </div>
    </div>
		<br>
		<div id="friend-users"></div>
    <div class="sessioner-box bg-prim txt-white clickable sessioner-user">
      <div class="sessioner-user-profilepic bg-gray"></div>
        <div>
          <div class="sessioner-user-username"></div>
        </div>
        <div class="btn-logout" onclick="logout()">
          <span class="material-symbols-outlined">
            logout
          </span>
        </div>
    </div>
				  `;
  displayFriends();
  switch (page) {
    case "forums":
      fetch("/get-forums")
        .then((response) => response.json())
        .then((posts) => {
          mainContent.innerHTML = `
					<div class="container">
						<div class="primary-page-desc txt-prim bg-white">Forums</div>
						  <div class="order-forums">
							  ${posts
                  .map(
                    (post) =>
                      `
						  <div class="single-forum clickable" onclick="showForum(${post.id})">
							  <div class="profilepic bg-gray"></div>
							  <div class="single-forum-thread bg-gray">
								  <div class="row">
									  <div class="single-forum-thread-category bg-gray">
										  ${getCategoryIcon(post.category)}
									  </div>
									  <div class="single-forum-thread-title bg-gray" maxlength="80">
										  ${post.title}
									  </div>
									  <div class="single-forum-thread-time bg-gray">
										  ${post.created_at}
									  </div>
								  </div>
								  <div class="single-forum-thread-uname bg-gray">
									  ${post.author}
								  </div>
								  <div class="single-forum-thread-intro bg-gray" maxlength="600">
									  ${post.content}
								  </div>
							  </div>
						  </div>
					  `
                  )
                  .join(``)}
						  </div>
					  </div>
					</div>
				  <div id="add-button-area"></div>
				`;
          addSend("forums");
        });
      break;
    case "pms":
      fetch("/get-users")
        .then((response) => response.json())
        .then((users) => {
          mainContent.innerHTML = `
			`;
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
      break;
    default:
      sidebarContent.innerHTML = `
				  `;
  }
}

function openChat(username) {
  sessionStorage.setItem('currentChatUser', username);
  const chatDisplay = document.getElementById('chat-display'); // The area where chat messages are displayed
  chatDisplay.innerHTML = ''; // Optionally clear previous messages

  // Logic to load chat messages from the server could be added here

  // Remove any notifications from this user
  const notifications = document.querySelectorAll('.notification');
  notifications.forEach(notification => {
    if (notification.innerHTML.includes(username)) {
      notification.parentNode.removeChild(notification);
    }
  });
}

function switchToChat(username) {
  openChat(username); // Use the same openChat function to handle opening and notification clearance
}

function showUserInfo(userId) {
  fetch(`/get-user?id=${userId}`)
    .then((response) => response.json())
    .then((user) => {
      const mainContent = document.getElementById("main-content");
      mainContent.innerHTML = `
            <div class="container">
                <div class="back-arrow txt-scnd clickable" onClick="loadPage('forums')">Back to Forums</div>
                <div class="primary-page-desc txt-prim bg-white">
                    Chat with User: ${user.username}
                </div>
                <div class="about-user-container">
                    <!-- User info here -->
                </div>
                <div id="chat-display"></div>
                <div class="row add-button-area">
                    <div>
                        <input
                        class="insert-msg bg-gray txt-black"
                        id="msg-input"
                        name="msg-input"
                        placeholder="Insert Chat Message"
                        maxlength="800"
                        required
                        />
                    </div>
                    <div id="overlay-toggle">
                        <span
                        class="material-symbols-rounded add-button-selector abs-pms bg-gray clickable"
                        onClick="sendMsg(${userId})"
                        >send</span>
                    </div>
                </div>
            </div>
            `;
      fetchMessages(userId);
    })
    .catch((error) => {
      console.error("Error fetching user information:", error);
    });
}

function fetchMessages(userId) {
  fetch(`/get-messages?userId=${userId}`)
    .then((response) => response.json())
    .then((messages) => {
      const chatDisplay = document.getElementById("chat-display");
      messages.forEach((message) => {
        const messageDiv = document.createElement("div");
        messageDiv.innerHTML = `
          <div class="single-chat">
            <div class="single-chat-thread bg-gray">
              ${message.content}
              <div class="row">
                <div class="single-forum-thread-uname">
                  ${
                    message.sender_id === userId
                      ? "You"
                      : message.sender_username
                  }
                </div>
              </div>
            </div>
          </div>
        `;
        chatDisplay.appendChild(messageDiv);
      });
      chatDisplay.scrollTop = chatDisplay.scrollHeight; // Scroll to bottom
    });
}

function sendMsg(recipientId) {
  const messageInput = document.getElementById("msg-input");
  const message = messageInput.value;
  displayMessage(message, "You");

  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(
      JSON.stringify({
        type: "message",
        message: message,
        recipientId: recipientId,
      })
    );
    messageInput.value = ""; // Clear the input after sending
  } else {
    console.error("WebSocket is not connected.");
  }
}

function showForum(postId) {
  fetch(`/get-forum?id=${postId}`)
    .then((response) => response.json())
    .then((post) => {
      const mainContent = document.getElementById("main-content");
      mainContent.innerHTML = `
		  <div class="container">
			  <div class="back-arrow txt-scnd clickable" onClick="loadPage('forums')">Back</div>
			  <div class="primary-page-desc txt-prim bg-white">
				  Forum: ${post.title}
			  </div>
			  <div class="single-forum">
				  <div class="profilepic bg-gray"></div>
				  <div class="single-forum-thread bg-gray">
					  <div class="single-forum-thread-uname bg-gray">${post.author}</div>
					  <div class="single-forum-thread-intro bg-gray" maxlength="600">${post.content}</div>
					  <div class="row">
						  <div class="single-forum-thread-time bg-gray">
							  ${post.created_at}
						  </div>
					  </div>
				  </div>
			  </div>
			  <div class="forum-comment-ph txt-scnd">Comments</div>
				  <div class="comment-input-area">
					  <form id="commentForm">
						  <div>
							  <textarea class="comment-input bg-gray" id="comment_content" name="comment_content" rows="3" type="text" minlength="2" required></textarea>
						  </div>
						  <div>
							  <button type="submit" class="comment-submit login bg-prim">Post Comment</button>
						  </div>
					  </form>
				  </div>
				  <div class="comments-container"></div>
			  </div>
		  `;
      // Add event listener for comment submission
      const commentForm = document.getElementById("commentForm");
      commentForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const commentContent = document.getElementById("comment_content").value;
        addComment(postId, commentContent); // Call function to add comment
      });
    });

  // Fetch comments for the post
  fetch(`/get-comments?id=${postId}`)
    .then((response) => response.json())
    .then((comments) => {
      const commentsContainer = document.querySelector(".comments-container");
      comments.forEach((comment) => {
        commentsContainer.innerHTML += `
			  <div class="single-forum">
				  <div class="profilepic bg-gray"></div>
				  <div class="single-forum-thread bg-gray">
					  <div class="single-forum-thread-uname bg-gray">${comment.author}</div>
					  <div class="single-forum-thread-intro bg-gray" maxlength="600">${comment.content}</div>
					  <div class="row">
						  <div class="single-forum-thread-time bg-gray">${comment.created_at}</div>
					  </div>
				  </div>
			  </div>
		  `;
      });
    })

    .catch((error) => {
      console.error("Error fetching forum:", error);
    });
}

// Function to add comment
function addComment(postId, commentContent) {
  fetch("/add-comment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ postId, commentContent }),
  })
    .then((response) => {
      if (response.ok) {
        // Reload the forum post page after successful comment addition
        showForum(postId);
      } else {
        throw new Error("Failed to add comment");
      }
    })
    .catch((error) => {
      console.error("Error adding comment:", error);
      // Handle error
    });
}

// Function to get category icon based on category name
function getCategoryIcon(category) {
  switch (category) {
    case "AdminNews":
      return '<span class="material-symbols-outlined"> news </span>';
    case "Technology":
      return '<span class="material-symbols-outlined"> devices </span>';
    case "VideoGames":
      return '<span class="material-symbols-outlined"> sports_esports </span>';
    case "Memes":
      return '<span class="material-symbols-outlined"> sentiment_very_satisfied </span>';
    case "Random":
      return '<span class="material-symbols-outlined"> shuffle </span>';
    default:
      return "";
  }
}

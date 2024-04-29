function loadPage(page) {
  const mainContent = document.getElementById("main-content");
  const sidebarContent = document.getElementById("sidebar-content");
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
      sidebarContent.innerHTML = `
				  <input
					  class="searchbar"
					  placeholder="Search Something..."
					  maxlength="40"
				  />
				  
				  <br>
				  <div id="friend-users"></div>
				  `;
      displayFriends();
      break;
    case "pms":
      fetch("/get-users")
        .then((response) => response.json())
        .then((users) => {
			mainContent.innerHTML = `
			<div id="chat-display"></div>
			  <div class="row add-button-area">
				  <div>
					  <input
					  class="insert-msg bg-gray txt-black"
					  id="msg-input"
					  name="msg-input"
					  placeholder="Insert Chat Message"
					  maxlength="800"
					  />
				  </div>
					<div id="overlay-toggle">
					  <span
					  class="material-symbols-rounded add-button-selector abs-pms bg-gray clickable"
					  onClick="sendMsg()"
					  >send</span>
					</div>
			  </div>
			`
          sidebarContent.innerHTML = `
				  <input
					  class="searchbar"
					  placeholder="Search Something..."
					  maxlength="40"
				  />
				  <br>
				  <div id="friend-users"></div>
				  `;
          displayFriends();
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
      break;
    default:
      sidebarContent.innerHTML = `<h2>Page not found</h2><p>Sorry, the requested page does not exist.</p>`;
  }
}

function showUserInfo(userId) {
    fetch(`/get-user?id=${userId}`)
        .then((response) => response.json())
        .then((user) => {
            const mainContent = document.getElementById("main-content");
            mainContent.innerHTML = `
            <div class="container">
                <div class="back-arrow txt-scnd clickable" onClick="loadPage('pms')">Back to Forums</div>
                <div class="primary-page-desc txt-prim bg-white">
                    User: ${user.username}
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
        })
        .catch((error) => {
            console.error("Error fetching user information:", error);
        });
}

function sendMsg(recipientId) {
    const messageInput = document.getElementById("msg-input");
    const message = messageInput.value;
    displayMessage(message, 'You');  // Display the message immediately in the chat

    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "message", message: message, targetUserId: recipientId }));
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

function displayFriends(userId) {
	const friendsListDiv = document.getElementById("friend-users");
	fetch("/get-friends")
	.then((response) => response.json())
	.then((friends) => {
		friendsListDiv.innerHTML = `
		${friends
			.map(
			  (friend) =>
			`
				<div class="pm-person-sel txt-white bg-scnd clickable">
					<div class="pm-inner-container profilepic bg-gray">
						<!-- Profile Pic -->
					</div>
					<div class="accountname-side">
						${friend.username}
					</div>
				</div>
				`
			)
			.join(``)}
		`;
	})
}

// Function to update friend button text
function updateFriendButton(userId) {
  const friendBtn = document.getElementById(`friend-btn-${userId}`);
  const isFriend = friends.some((friend) => friend.friendId === userId);
  friendBtn.textContent = isFriend ? "Remove friend" : "Add friend";
}

// Function to add or remove friend
function manageFriend(userId) {
  const isFriend = friends.some((friend) => friend.friendId === userId);
  if (isFriend) {
    // Remove friend
    console.log("Rm friend");
    console.log(userId);
    friends.splice(
      friends.findIndex((friend) => friend.friendId === userId),
      1
    );
  } else {
    // Add friend
    console.log("Add friend");
    console.log(userId);
    friends.push({ userId: 1, friendId: userId }); // Replace 1 with the session user's ID
  }
  updateFriendButton(userId);
}
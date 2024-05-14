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
				<div class="pm-person pm-person-unsel clickable" onclick="selectUser(${friend.id}, this)">
					<div class="username-side">
						${friend.username}
					</div>
					<div class="${friend.isOnline ? 'online-status' : 'offline-status'}"></div>
				</div>
			`
			)
			.join(``)}
		`;
	})
}

// Global variable to keep track of the currently selected user
var currentSelectedUserId = null;

function selectUser(userId, element) {
    // Check if there's a previously selected user and remove the selection style
    if (currentSelectedUserId !== null) {
        const previousSelectedElement = document.querySelector('.pm-person-sel');
        if (previousSelectedElement) {
            previousSelectedElement.classList.remove('pm-person-sel');
            previousSelectedElement.classList.add('pm-person-unsel');
        }
    }

    // Update the current selected user
    currentSelectedUserId = userId;

    // Add 'pm-person-sel' class to the clicked user
    // element.classList.remove('pm-person-unsel');  // Optionally manage default class
    element.classList.add('pm-person-sel');

    // Fetch and display user info
    showUserInfo(userId);
}

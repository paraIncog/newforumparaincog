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

var currentSelectedUserId = null;

function selectUser(userId, element) {
    if (currentSelectedUserId !== null) {
        const previousSelectedElement = document.querySelector('.pm-person-sel');
        if (previousSelectedElement) {
            previousSelectedElement.classList.remove('pm-person-sel');
            previousSelectedElement.classList.add('pm-person-unsel');
        }
    }

    currentSelectedUserId = userId;

    element.classList.add('pm-person-sel');

    showUserInfo(userId);
}

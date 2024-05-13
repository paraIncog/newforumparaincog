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
				<div class="pm-person-sel txt-white bg-scnd clickable" onclick="showUserInfo(${friend.id})">
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
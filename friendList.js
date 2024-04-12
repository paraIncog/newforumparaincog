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
						<br>
						isonline: ${friend.isOnline}
					</div>
					<div onclick="showUserInfo(${friend.id})">info</div>
				</div>
				`
			)
			.join(``)}
		`;
	})
}
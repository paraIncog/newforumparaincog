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
					<div class="accountname-side">
						${friend.username}
					</div>
					<div>
						isonline: ${friend.isOnline}
					</div>
					<!-- <div class="about-user-button">
						<span class="material-symbols-outlined">
							more_horiz
						</span>
					</div> -->
				</div>
				`
			)
			.join(``)}
		`;
	})
}
function displayUsers(userId) {
	const usersListDiv = document.getElementById("user-list");
	fetch("/get-users")
	.then((response) => response.json())
	.then((users) => {
		usersListDiv.innerHTML = `
		${users
			.map(
			  (friend) =>
			`
				<div class="pm-person-sel txt-white bg-scnd clickable" onclick="showUserInfo(${friend.id})">
					<div class="pm-inner-container profilepic bg-gray">
						<!-- Profile Pic -->
					</div>
					<div class="accountname-side">
						${friend.username}
						<br>
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
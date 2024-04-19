function displayUsers(userId) {
	const usersListDiv = document.getElementById("user-list");
	fetch("/get-users")
	.then((response) => response.json())
	.then((users) => {
		usersListDiv.innerHTML = `
		${users
			.map(
			  (user) =>
			`
				<div class="pm-person-sel txt-white bg-scnd clickable" onclick="showUserInfo(${user.id})">
					<div class="pm-inner-container profilepic bg-gray">
						<!-- Profile Pic -->
					</div>
					<div class="accountname-side">
						${user.username}
						<br>
						isonline: ${user.isOnline}
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
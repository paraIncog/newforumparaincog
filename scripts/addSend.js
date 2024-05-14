function addSend(page) {
	const addButtonArea = document.getElementById("add-button-area");
	switch (page) {
		case "forums":
			addButtonArea.innerHTML = `
				<div class="add-button-area">
					<div id="overlay-toggle">
						<span
						class="material-symbols-rounded add-button-selector abs-forums bg-gray clickable"
						onclick="addForum()">add
						</span>
					</div>
				</div>
			`;
			break;
		case "pms":
			addButtonArea.innerHTML = `
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
						onclick="sendMsg()"
						>send</span>
					</div>
				</div>
			`;
			break;
		default:
			break;
	}
}

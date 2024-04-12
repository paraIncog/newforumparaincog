function addSend(page) {
	const addButtonArea = document.getElementById("add-button-area");
	switch (page) {
		case "forums":
			addButtonArea.innerHTML = `
			<div class="add-button-area">
			  <div id="overlay-toggle">
				<span
				  class="material-symbols-rounded add-button-selector bg-gray clickable"
				  onclick="addForum()"
				>
				  add
				</span>
			  </div>
			</div>
			`;
			break;
		case "pms":
			addButtonArea.innerHTML = `
			<div class="add-button-area">
			  <div id="overlay-toggle">
				<span
				  class="material-symbols-rounded add-button-selector bg-gray clickable"
				  onclick="sendMsg()"
				>
				  send
				</span>
			  </div>
			</div>
			`;
			break;
		default:
			break;
	}
}

function sendMsg() {
	console.log("sendMsg Initialized")
}
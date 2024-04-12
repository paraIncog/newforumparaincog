function addSend(page) {
	const addButtonArea = document.getElementById("add-button-area");
	switch (page) {
		case "forums":
			addButtonArea.innerHTML = `
			<div class="add-button-area">
			  <div id="overlay-toggle">
				<span
				  class="material-symbols-rounded add-button-selector abs-forums bg-gray clickable"
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
			<div class="row add-button-area">
			<div>
				<input
				class="insert-msg bg-gray txt-black"
				placeholder="Insert Chat Message"
				maxlength="800"
				/>
			</div>
			  <div id="overlay-toggle">
				<span
				  class="material-symbols-rounded add-button-selector abs-pms bg-gray clickable"
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
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
				<form class="form-msg">
					<input
					type="text"
					class="insert-msg bg-gray txt-black"
					id="message"
					name="msg-input"
					placeholder="Your message"
					maxlength="800"
					/>
					</div>
					<button type="submin">
						<div id="overlay-toggle">
							<span
							class="material-symbols-rounded add-button-selector abs-pms bg-gray clickable"
							>send</span>
						</div>
					</button>
				</form>
			</div>
			`;
			break;
		default:
			break;
	}
}


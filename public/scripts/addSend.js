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
			`;
			break;
		default:
			break;
	}
}


function addForum() {
	const mainContent = document.getElementById("main-content");
  const sidebarContent = document.getElementById("sidebar-content");
  mainContent.innerHTML = `
      <div class="container">
          <div class="primary-page-desc txt-prim bg-white">
              Add Forum Post
          </div>
		  <div class="forumtitle">
		  	<label for="title">Title</label>
            <input id="title" name="title"></input>
		  </div>
		  <div class="forumdesc">
		  	<label for="content">Content</label>
            <textarea id="content" name="content" rows="10" cols="50" maxlength="800"></textarea>
		  </div>
          <div>
          <button>Submit</button>
          </div>
      </div>
  `;
  sidebarContent.innerHTML = `
      <div>
          <div class="back-arrow txt-scnd clickable" onClick="loadPage('pms')">
              Back
          </div>
      </div>
  `;
}
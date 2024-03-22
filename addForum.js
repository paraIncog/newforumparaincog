function addForum() {
    const mainContent = document.getElementById("main-content");
    const sidebarContent = document.getElementById("sidebar-content");

    // Form submission handler
    const handleSubmit = (event) => {
        event.preventDefault();

        // Extract data from the form
        const title = document.getElementById("title").value;
        const category = document.getElementById("category").value;
        const content = document.getElementById("content").value;

        // Make a POST request to the server to add the forum post
        fetch("/add-forum-post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, category, content })
        })
        .then(response => {
            if (response.ok) {
                // Redirect to forums page after successful post
                loadPage("forums");
            } else {
                throw new Error("Failed to add forum post");
            }
        })
        .catch(error => {
            console.error("Error adding forum post:", error);
            // Handle error
        });
    };

    // Render forum post form
    mainContent.innerHTML = `
        <div class="container">
            <div class="primary-page-desc txt-prim bg-white">
                Add Forum Post
            </div>
            <form id="forumForm">
                <div class="forumtitle forumContent">
                    <label for="title">Title</label>
                    <input id="title" class="foruminput" name="title" required></input>
                </div>
                <div class="forumContent">
                    <label for="category">Category</label>
                    <select id="category" name="category" required>
                        <option selected disabled value=""></option>
                        <option value="Technology">Technology</option>
                        <option value="VideoGames">Video Games</option>
                        <option value="Memes">Memes</option>
                        <option value="Random">Random</option>
                    </select>
                </div>
                <div class="forumdesc forumContent">
                    <label for="content">Content</label>
                    <textarea id="content" class="foruminput" name="content" rows="10" cols="50" maxlength="800" required></textarea>
                </div>
                <div class="forumContent">
                    <button class="foruminput bg-prim txt-white" type="submit">Submit</button>
                </div>
            </form>
        </div>
    `;

    sidebarContent.innerHTML = `
      <div>
          <div class="back-arrow txt-scnd clickable" onClick="loadPage('pms')">
              Back
          </div>
      </div>
    `;

    // Attach form submission handler
    const forumForm = document.getElementById("forumForm");
    forumForm.addEventListener("submit", handleSubmit);
}

function addForum() {
    const mainContent = document.getElementById("main-content");

    // Form submission handler
    const handleSubmit = (event) => {
        event.preventDefault();

        // Extract data from the form
        const title = document.getElementById("title").value;
        const content = document.getElementById("content").value;

        // Make a POST request to the server to add the forum post
        fetch("/add-forum-post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, content })
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
                <div class="forumtitle">
                    <label for="title">Title</label>
                    <input id="title" name="title"></input>
                </div>
                <div class="forumdesc">
                    <label for="content">Content</label>
                    <textarea id="content" name="content" rows="10" cols="50" maxlength="800"></textarea>
                </div>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    `;

    // Attach form submission handler
    const forumForm = document.getElementById("forumForm");
    forumForm.addEventListener("submit", handleSubmit);
}

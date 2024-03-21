function loadPage(page) {
  const mainContent = document.getElementById("main-content");
  const sidebarContent = document.getElementById("sidebar-content");
  switch (page) {
    case "forums":
      fetch("/get-forums")
        .then((response) => response.json())
        .then((posts) => {
          	mainContent.innerHTML = `
		  		<div class="container">
		  			<div class="primary-page-desc txt-prim bg-white">Forums</div>
		  				<!-- Thread -->
			 			${posts
                		.map(
                  			(post) =>
                    			`
									<div class="single-forum clickable" onclick="showForum(${post.id})">
										<div class="profilepic bg-gray">
											<!-- Profilepic -->
										</div>
										<div class="single-forum-thread bg-gray">
											<div class="row">
												<div class="single-forum-thread-title bg-gray" maxlength="80">
													${post.title}
												</div>
												<div class="single-forum-thread-time bg-gray">
													${post.created_at}
												</div>
											</div>
											<div class="single-forum-thread-uname bg-gray">
												${post.author}
											</div>
											<div class="single-forum-thread-intro bg-gray" maxlength="600">
												${post.content}
											</div>
										</div>
									</div>
								`
                		)
                	.join(``)}
          					</div>
		  				</div>
		  			`;
        	});
      		sidebarContent.innerHTML = `
						<input
						class="searchbar"
						placeholder="Search Something..."
						maxlength="40"
						/>
						<div class="forum-pm-selrow">
							<div class="forum-pm-icontext-sep txt-white bg-prim">
								<div class="tab-label">
								<span class="material-symbols-outlined"> forum </span>
								<div>Forums</div>
								</div>
							</div>
							<div onclick="loadPage('pms')" href="/#" class="forum-pm-icontext-sep clickable">
								<div class="tab-label">
								<span class="material-symbols-outlined"> chat </span>
								<div>Private Messages</div>
								</div>
							</div>
						</div>
						<div class="forum-filtering">
							<div class="filter-header">Filters</div>
							<div class="filter-mainheader">Categories</div>
							<ul class="filter-subcat-dot">
								<li>
									<a
									class="filter-subcat txt-scnd clickable"
									href="/get-posts-by-category?category=Golang"
									>Golang
									</a>
								</li>
								<li>
								<a
								class="filter-subcat txt-scnd clickable"
								href="get-posts-by-category?category=Python"
								>Python
								</a>
								</li>
								<li>
									<a
									class="filter-subcat txt-scnd clickable"
									href="get-posts-by-category?category=JavaScript"
									>JavaScript
									</a>
								</li>
								<li>
									<a
									class="filter-subcat txt-scnd clickable"
									href="get-posts-by-category?category=Docker"
									>Docker
									</a>
								</li>
								<li>
									<a 
									class="filter-subcat txt-scnd clickable" 
									href="get-posts-by-category?category=SQL"
									>SQL
									</a>
								</li>
							</ul>
							<ul class="filter-subcat-nodot">
								<li>
									<a 
									class="filter-subcat txt-scnd filter-mainheader clickable" 
									href="/get-created-posts/"
									>Most Recent Posts
									</a>
								</li>
								<li>
									<a 
									class="filter-subcat txt-scnd clickable" 
									href="/get-liked-posts/"
									>Liked Posts
									</a>
								</li>
								<li>
									<a 
									class="filter-subcat txt-scnd clickable" 
									href="/get-your-posts/"
									>Your Posts 
									</a>
								</li>
							</ul>
						</div>
					`;
      break;
    case "pms":
      fetch("/get-users")
        .then((response) => response.json())
        .then((users) => {
          mainContent.innerHTML = `
							<div class="container">
								<div class="primary-page-desc txt-prim bg-white">
									Users
								</div>
								<div class="user-search-items-container">
									${users
                    .map(
                      (user) =>
                        `
							<div class="user-search-item clickable" onclick="showUserInfo(${user.id})">
								<div class="profilepic bg-gray">
									<!-- Profile Pic -->
				 				</div>
								<div class="user-search-info">
									<div class="user-search-username">
										${user.username}
									</div>
										<div class="user-search-fullname txt-scnd">
											${user.namefirst} ${user.namelast}
										</div>
									</div>
							</div>
						`
                    )
                    .join(``)}
								</div>
							</div>
						`;
          sidebarContent.innerHTML = `
				<input
					class="searchbar"
					placeholder="Search Something..."
					maxlength="40"
    			/>
				<div class="forum-pm-selrow">
					<div onclick="loadPage('forums')" href="/#" class="forum-pm-icontext-sep clickable">
						<div class="tab-label">
							<span class="material-symbols-outlined"> forum </span>
							<div>Forums</div>
						</div>
					</div>
					<div class="forum-pm-icontext-sep txt-white bg-prim">
						<div class="tab-label">
							<span class="material-symbols-outlined"> chat </span>
							<div>Private Messages</div>
						</div>
					</div>
				</div>
				<br>
				<div class="friend-users">
					${users
                  .map(
                    (user) =>
                  	`
					<div class="pm-person-sel txt-white bg-scnd clickable">
						<div class="pm-inner-container profilepic bg-gray">
							<!-- Profile Pic -->
						</div>
						<div class="accountname-side">
							${user.username}
						</div>
					</div>
					`
                  )
                  .join(``)}
				</div>
			`;
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
      break;
    default:
      sidebarContent.innerHTML = `<h2>Page not found</h2><p>Sorry, the requested page does not exist.</p>`;
  }
}

// Function to show user information
function showUserInfo(userId) {
  fetch(`/get-user?id=${userId}`)
    .then((response) => response.json())
    .then((user) => {
      const mainContent = document.getElementById("main-content");
      mainContent.innerHTML = `
                    <div class="container">
						<div class="back-arrow txt-scnd clickable" onClick="loadPage('pms')">
							Back
						</div>
                        <div class="primary-page-desc txt-prim bg-white">
                            User: ${user.username}
                        </div>
						<div class="about-user-container">
							<div class="about-user-profilepic bg-gray">
								<!-- Profilepic -->
							</div>
							<div class="user-info">
								<div class="about-user-fullname">
									${user.namefirst} ${user.namelast}
								</div>
								<div>
									(${user.age})
								</div>
								<div>
									${user.email}
								</div>
							</div>
						</div>
                    </div>
                `;
    })
    .catch((error) => {
      console.error("Error fetching user information:", error);
    });
}

function showForum(postId) {
	fetch(`/get-forum?id=${postId}`)
	  .then((response) => response.json())
	  .then((post) => {
		const mainContent = document.getElementById("main-content");
		mainContent.innerHTML = `
				  <div class="container">
					  <div class="back-arrow txt-scnd clickable" onClick="loadPage('forums')">
						  Back
					  </div>
					  <div class="primary-page-desc txt-prim bg-white">
						  Forum: ${post.title}
					  </div>
					  <div class="single-forum">
						  <div class="profilepic bg-gray">
							  <!-- Profilepic -->
						  </div>
						  <div class="single-forum-thread bg-gray">
							  <div class="single-forum-thread-uname bg-gray">
								  ${post.author}
							  </div>
							  <div class="single-forum-thread-intro bg-gray" maxlength="600">
								  ${post.content}
							  </div>
							  <div class="row">
								  <div class="single-forum-thread-time bg-gray">
									  ${post.created_at}
								  </div>
							  </div>
						  </div>
					  </div>
					  <div class="forum-comment-ph txt-scnd">
						  Comments
					  </div>
					  <div class="comment-input">
						  <form id="commentForm">
							  <div>
								  <textarea id="comment_content" name="comment_content" rows="3" type="text" min="2" required></textarea>
							  </div>
							  <div>
								  <button type="submit" class="login bg-prim">Post Comment</button>
							  </div>
						  </form>
						  </div>
					  <div class="single-forum">
						  <div class="profilepic bg-gray">
							  <!-- Profilepic -->
						  </div>
						  <div class="single-forum-thread bg-gray">
							  <div class="single-forum-thread-uname bg-gray">
								  Comment Author
							  </div>
							  <div class="single-forum-thread-intro bg-gray" maxlength="600">
								  Comment Content
							  </div>
							  <div class="row">
								  <div class="single-forum-thread-time bg-gray">
									  Comment Created At
								  </div>
							  </div>
						  </div>
					  </div>
				  </div>
			  `;
	  })
	  .catch((error) => {
		console.error("Error fetching forum:", error);
	  });
}
  
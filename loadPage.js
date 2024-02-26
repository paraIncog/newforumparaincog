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
		  					<div class="primary-page-desc">Forums</div>
		  					<!-- Thread -->
			 				${posts
								.map(
									(post) => 
									`
										<div class="single-forum">
											<div class="profilepic">{{ .UserPic }}</div>
											<div class="single-forum-thread">
												<div class="row">
													<div class="single-forum-thread-title" maxlength="80">
														${post.title}
													</div>
													<div class="single-forum-thread-time">
														${post.created_at}
													</div>
												</div>
												<div class="single-forum-thread-uname">
													${post.author}
												</div>
												<div class="single-forum-thread-intro" maxlength="600">
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
					sidebarContent.innerHTML = 
					`
						<div class="forum-pm-selrow">
							<div class="forum-pm-icontext-sep forum-pm-active">
								<div>
								<span class="material-symbols-outlined"> forum </span>
								</div>
								Forums
							</div>
							<div onclick="loadPage('pms')" href="/#" class="forum-pm-icontext-sep">
								<div>
								<span class="material-symbols-outlined"> chat </span>
								</div>
								<div>Private Messages</div>
							</div>
						</div>
						<div class="forum-filtering">
							<div class="filter-header">Filters</div>
							<div class="filter-mainheader">Categories</div>
							<ul class="filter-subcat-dot">
								<li>
									<a
									class="filter-subcat"
									href="/get-posts-by-category?category=Golang"
									>Golang
									</a>
								</li>
								<li>
								<a
								class="filter-subcat"
								href="get-posts-by-category?category=Python"
								>Python
								</a>
								</li>
								<li>
									<a
									class="filter-subcat"
									href="get-posts-by-category?category=JavaScript"
									>JavaScript
									</a>
								</li>
								<li>
									<a
									class="filter-subcat"
									href="get-posts-by-category?category=Docker"
									>Docker
									</a>
								</li>
								<li>
									<a 
									class="filter-subcat" 
									href="get-posts-by-category?category=SQL"
									>SQL
									</a>
								</li>
							</ul>
							<ul class="filter-subcat-nodot">
								<li>
									<a 
									class="filter-subcat filter-mainheader" 
									href="/get-created-posts/"
									>Most Recent Posts
									</a>
								</li>
								<li>
									<a 
									class="filter-subcat" 
									href="/get-liked-posts/"
									>Liked Posts
									</a>
								</li>
								<li>
									<a 
									class="filter-subcat" 
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
					mainContent.innerHTML = 
						`
							<div class="container">
								<div class="primary-page-desc">
									Users
								</div>
								<div class="user-search-items-container">
									${users.map(
										(user) => 
											`
												<div class="user-search-item" onClick="" href="/user=${user.id}">
													<div class="profilepic">
														<!-- Profile Pic -->
													</div>
													<div class="user-search-info">
														<div class="user-search-username">
															${user.username}
														</div>
														<div class="user-search-fullname">
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
					sidebarContent.innerHTML = 
						`
							<div class="forum-pm-selrow">
								<div onclick="loadPage('forums')" href="/#" class="forum-pm-icontext-sep">
									<div>
										<span class="material-symbols-outlined"> forum </span>
									</div>
									Forums
								</div>
								<div class="forum-pm-icontext-sep forum-pm-active">
									<div>
										<span class="material-symbols-outlined"> chat </span>
									</div>
									<div>Private Messages</div>
								</div>
							</div>
							<br>
							<div class="friend-users">
								${users.map(
									(user) => 
										`
											<div class="pm-person-sel">
												<div class="profilepic">
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

function loadSideBarContent(page) {
  const sidebarContent = document.getElementById("sidebar-content");
  switch (page) {
    case "forums":
      sidebarContent.innerHTML = `
			<div class="forum-filtering">
			  <div class="filter-header">Filters</div>
			  <div class="filter-mainheader">Categories</div>
			  <ul class="filter-subcat-dot">
				<li>
				  <a
					class="filter-subcat"
					href="/get-posts-by-category?category=Golang"
					>Golang</a
				  >
				</li>
				<li>
				  <a
					class="filter-subcat"
					href="get-posts-by-category?category=Python"
					>Python</a
				  >
				</li>
				<li>
				  <a
					class="filter-subcat"
					href="get-posts-by-category?category=JavaScript"
					>JavaScript</a
				  >
				</li>
				<li>
				  <a
					class="filter-subcat"
					href="get-posts-by-category?category=Docker"
					>Docker</a
				  >
				</li>
				<li>
				  <a class="filter-subcat" href="get-posts-by-category?category=SQL"
					>SQL</a
				  >
				</li>
			  </ul>
			  <ul class="filter-subcat-nodot">
				<li>
				  <a class="filter-subcat filter-mainheader" href="/get-created-posts/"
					>Most Recent Posts</a
				  >
				</li>
				<li>
				  <a class="filter-subcat" href="/get-liked-posts/">Liked Posts</a>
				</li>
				<li><a class="filter-subcat" href="/get-your-posts/"> Your Posts </a></li>
			  </ul>
			</div>
			`;
      break;
    case "pms":
      sidebarContent.innerHTML = `<div class="forum-filtering">Sorry, this section has not been implemented yet.</div>`;
      break;
    default:
      sidebarContent.innerHTML = `<h2>Page not found</h2><p>Sorry, the requested page does not exist.</p>`;
  }
}

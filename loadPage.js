function loadPage(page) {
  const mainContent = document.getElementById("main-content");
  const sidebarContent = document.getElementById("sidebar-content");
  switch (page) {
    case "forums":
      mainContent.innerHTML = `
	  <div class="container">
        <div class="primary-page-desc">Forums</div>
        <!-- First thread -->
        <div class="single-forum">
          <div class="profilepic"></div>
          <div class="single-forum-thread">
            <div class="row">
              <div class="single-forum-thread-title">Title 1 (80 letters max)</div>
              <div class="single-forum-thread-time">31.12.24, 23:50</div>
            </div>
            <div class="single-forum-thread-uname">User Name 1</div>
            <div class="single-forum-thread-intro">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam enim
              mauris, sodales sit amet ipsum ut, vestibulum viverra nisl. Fusce
              scelerisque metus ut orci iaculis, vitae maximus tortor fringilla.
              Suspendisse sed ante vel dui elementum blandit ut vel purus. Nullam
              scelerisque mi vel consequat maximus. Proin tellus elit, dignissim a
              nulla non, imperdiet tempor nisl. Sed quis orci fringilla, porttitor
              ex eget, ornare dolor. Morbi efficitur nec ipsum sit amet dapibus. (600 letters max)
            </div>
          </div>
        </div>
        <!-- second thread -->
        <div class="single-forum">
          <div class="profilepic"></div>
          <div class="single-forum-thread">
            <div class="row">
              <div class="single-forum-thread-title">Title 1 (80 letters max)</div>
              <div class="single-forum-thread-time">31.12.24, 23:50</div>
            </div>
            <div class="single-forum-thread-uname">User Name 1</div>
            <div class="single-forum-thread-intro">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam enim
              mauris, sodales sit amet ipsum ut, vestibulum viverra nisl. Fusce
              scelerisque metus ut orci iaculis, vitae maximus tortor fringilla.
              Suspendisse sed ante vel dui elementum blandit ut vel purus. Nullam
              scelerisque mi vel consequat maximus. Proin tellus elit, dignissim a
              nulla non, imperdiet tempor nisl. Sed quis orci fringilla, porttitor
              ex eget, ornare dolor. Morbi efficitur nec ipsum sit amet dapibus. (600 letters max)
            </div>
          </div>
        </div>
      </div>
	  `;
      sidebarContent.innerHTML = `
	  <!-- Forum/Private Message Tab Selection -->
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
      mainContent.innerHTML = `<div class="primary-page-desc"><div class="container">Sorry, this section has not been implemented yet.</div></div>`;
      sidebarContent.innerHTML = `
	  <!-- Forum/Private Message Tab Selection -->
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
	  <div class="forum-filtering">Sorry, this section has not been implemented yet.</div>
	  `;
      break;
    default:
      sidebarContent.innerHTML = `<h2>Page not found</h2><p>Sorry, the requested page does not exist.</p>`;
  }
}

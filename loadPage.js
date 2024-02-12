function loadPage(page) {
  const mainContent = document.getElementById("main-content");
  const sidebarContent = document.getElementById("sidebar-content");
  switch (page) {
    case "forums":
      mainContent.innerHTML = `
	  <div class="container">
        <div class="primary-page-desc">Forums</div>
        <!-- Thread -->
        {{ range .Post }}
        <div class="single-forum">
          <div class="profilepic">{{ .UserPic }}</div>
          <div class="single-forum-thread">
            <div class="row">
              <div class="single-forum-thread-title" maxlength="80">{{ .Title }}</div>
              <div class="single-forum-thread-time">{{ .PostTime }}</div>
            </div>
            <div class="single-forum-thread-uname">{{ .Username }}</div>
            <div class="single-forum-thread-intro" maxlength="600">{{ .PostContent }}</div>
          </div>
        </div>
        {{ end }}
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

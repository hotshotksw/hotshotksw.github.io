// Blog post data structure
let blogPosts = [];

// Check if user is authenticated
function isAuthenticated() {
  return localStorage.getItem("blogAuth") === "true";
}

// Show admin panel if authenticated
function showAdminPanel() {
  if (!isAuthenticated()) return;

  const adminPanel = document.createElement("div");
  adminPanel.className = "admin-panel";
  adminPanel.innerHTML = `
        <h2>New Blog Post</h2>
        <form class="admin-form" id="blog-form">
            <input type="text" id="post-title" placeholder="Post Title" required>
            <textarea id="post-content" placeholder="Write your post here..." required></textarea>
            <button type="submit">Publish Post</button>
        </form>
    `;

  const blogGrid = document.getElementById("blog-posts");
  blogGrid.parentNode.insertBefore(adminPanel, blogGrid);

  // Handle form submission
  document
    .getElementById("blog-form")
    .addEventListener("submit", handlePostSubmit);
}

// Handle new post submission
async function handlePostSubmit(event) {
  event.preventDefault();

  const title = document.getElementById("post-title").value;
  const content = document.getElementById("post-content").value;

  const newPost = {
    id: Date.now(),
    title,
    content,
    date: new Date().toISOString(),
    author: "Kyle Wadas",
  };

  try {
    // In a real implementation, you would send this to a server
    // For now, we'll store it in localStorage
    blogPosts.unshift(newPost);
    localStorage.setItem("blogPosts", JSON.stringify(blogPosts));

    // Clear form and refresh posts
    event.target.reset();
    loadBlogPosts();
  } catch (error) {
    console.error("Error saving post:", error);
    alert("Failed to save post. Please try again.");
  }
}

// Load and display blog posts
function loadBlogPosts() {
  const blogGrid = document.getElementById("blog-posts");
  blogGrid.innerHTML = "";

  // Load posts from localStorage
  const savedPosts = localStorage.getItem("blogPosts");
  if (savedPosts) {
    blogPosts = JSON.parse(savedPosts);
  }

  blogPosts.forEach((post) => {
    const postElement = document.createElement("article");
    postElement.className = "blog-post";

    const date = new Date(post.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    postElement.innerHTML = `
            <div class="blog-post-header">
                <h2 class="blog-post-title">${post.title}</h2>
                <div class="blog-post-meta">
                    <span>${date}</span>
                    <span>By ${post.author}</span>
                </div>
            </div>
            <div class="blog-post-content">
                ${post.content
                  .split("\n")
                  .map((paragraph) => (paragraph ? `<p>${paragraph}</p>` : ""))
                  .join("")}
            </div>
        `;

    blogGrid.appendChild(postElement);
  });
}

// Initialize the blog
document.addEventListener("DOMContentLoaded", () => {
  loadBlogPosts();
  showAdminPanel();
});

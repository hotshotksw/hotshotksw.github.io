// Language colors mapping
const languageColors = {
  JavaScript: "#f1e05a",
  TypeScript: "#2b7489",
  Python: "#3572A5",
  Java: "#b07219",
  "C#": "#178600",
  "C++": "#f34b7d",
  Go: "#00ADD8",
  Rust: "#dea584",
  HTML: "#e34c26",
  CSS: "#563d7c",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Swift: "#ffac45",
  Kotlin: "#F18E33",
  Scala: "#c22d40",
  Shell: "#89e051",
  PowerShell: "#012456",
  Lua: "#000080",
  Dart: "#00B4AB",
  R: "#198CE7",
};

async function createGitHubWidget(repoUrl) {
  // Extract owner and repo name from URL
  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) {
    throw new Error("Invalid GitHub repository URL");
  }

  const [_, owner, repo] = match;

  try {
    // Fetch repository data from GitHub API
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch repository data");
    }

    const data = await response.json();

    // Create widget HTML
    const widget = document.createElement("div");
    widget.className = "github-widget";

    widget.innerHTML = `
            <div class="github-widget-header">
                <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" 
                     alt="GitHub" 
                     class="github-widget-icon">
                <a href="${data.html_url}" 
                   class="github-widget-title" 
                   target="_blank" 
                   rel="noopener noreferrer">
                    ${owner}/${repo}
                </a>
            </div>
            <p class="github-widget-description">${
              data.description || "No description provided"
            }</p>
            <div class="github-widget-footer">
                ${
                  data.language
                    ? `
                    <div class="github-widget-language">
                        <span class="github-widget-language-color" 
                              style="background-color: ${
                                languageColors[data.language] || "#f1e05a"
                              }">
                        </span>
                        ${data.language}
                    </div>
                `
                    : ""
                }
                <div class="github-widget-stat">
                    <i class="fas fa-star"></i>
                    ${data.stargazers_count}
                </div>
                <div class="github-widget-stat">
                    <i class="fas fa-code-branch"></i>
                    ${data.forks_count}
                </div>
            </div>
        `;

    return widget;
  } catch (error) {
    console.error("Error creating GitHub widget:", error);
    throw error;
  }
}

// Function to embed a GitHub repository widget
function embedGitHubWidget(containerId, repoUrl) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with ID "${containerId}" not found`);
    return;
  }

  createGitHubWidget(repoUrl)
    .then((widget) => {
      container.appendChild(widget);
    })
    .catch((error) => {
      console.error("Failed to embed GitHub widget:", error);
      container.innerHTML = `<p style="color: red;">Failed to load GitHub repository widget</p>`;
    });
}

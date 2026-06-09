/**
 * Fetches issues from ecosystem GitHub repositories based on provided labels and renders them.
 * @param {string} containerId - The ID of the HTML element where the list will render.
 */
export async function loadGitHubIssues(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID "${containerId}" not found.`);
        return;
    }

    // List BioCLIP ecosystem repositories to check
    const repos = [
        'Imageomics/pybioclip', 
        'Imageomics/emb-explorer',
        'Imageomics/biobench',
        'Imageomics/bioclip-ecosystem',
        'Imageomics/bioclip-image-search-lite',
        'Imageomics/distributed-downloader',
        'Imageomics/TaxonoPy',
        'Imageomics/TreeOfLife-Toolbox',
        'Imageomics/Finer-CAM',
        'Imageomics/Prompt_CAM',
        'Imageomics/saev',
        'Imageomics/bioclip',
        'Imageomics/bioclip-2',
        'Imageomics/biocap',
        'Imageomics/bioclip-vector-db'
        ]
    // labels for issue filtering
    const labels = [
        'bug', 
        'good first issue',
        'help wanted'
        ]

    // Set initial loading state
    container.innerHTML = '<p class="issue-loading">Loading matching issues...</p>';

    // Setup headers (GitHub strongly recommends specifying the API version)
    const headers = {
        'Accept': 'application/vnd.github.v3+json'
    };
    
    try {
        // Format labels for OR logic using the comma syntax (e.g., label:"bug","good first issue")
        const labelQuery = `label:${labels.map(l => `"${l}"`).join(',')}`;

        // Format multiple repos (Separating them by spaces acts as an OR filter in GitHub search)
        const repoQuery = repos.map(r => `repo:${r}`).join(' ');

        // Combine label repo list into a single query
        const searchQuery = `is:open is:issue ${repoQuery} ${labelQuery}`;
        const url = `https://api.github.com/search/issues?q=${encodeURIComponent(searchQuery)}`;

        const response = await fetch(url, { headers });
        
        if (!response.ok) {
            throw new Error(`GitHub API error (${response.status})`);
        }

        const data = await response.json();

        // The Search API returns elements inside an 'items' array
        const searchItems = data.items || [];

        // Filter out PRs, which GitHub treats as issues in queries
        const issuesOnly = searchItems.filter(issue => !issue.pull_request);

        // Handle empty state
        if (issuesOnly.length === 0) {
            container.innerHTML = `<p class="issue-empty">No open issues found matching labels (${labels.join(', ')}).</p>`;
            return;
        }

        // Build the clickable HTML list
        container.innerHTML = `
            <ul class="issue-list" style="list-style: none; padding: 0; margin: 0;">
                ${issuesOnly.map(issue => {
                    const urlParts = issue.html_url.split('/');
                    const repoName = urlParts[4] || 'Repository';

                    // Map issue labels and build their badges with inline styles
                    // Badges use the GitHub label color, with gray as fallback, and dynamic text color for contrast
                    const tagsHtml = (issue.labels || []).map(label => {
                        const bgColor = label.color ? `#${label.color}` : '#f1f3f5';
                        
                        // Dynamically calculate text contrast (Light vs Dark backgrounds)
                        let textColor = '#24292e'; 
                        if (label.color && label.color.length === 6) {
                            const r = parseInt(label.color.substring(0, 2), 16);
                            const g = parseInt(label.color.substring(2, 4), 16);
                            const b = parseInt(label.color.substring(4, 6), 16);
                            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                            // If the badge background is dark, flip text to white
                            if (brightness < 128) textColor = '#ffffff';
                        }

                        return `
                            <span class="issue-tag-badge" style="
                                background-color: ${bgColor}; 
                                color: ${textColor}; 
                                padding: 6px; 
                                border-radius: 20px; 
                                font-size: 0.72rem; 
                                font-weight: 600; 
                                display: inline-block; 
                                white-space: nowrap;
                                border: 1px solid rgba(0, 0, 0, 0.08);
                                line-height: 1;
                            ">
                                ${label.name}
                            </span>
                            `;
                        }).join('');

                    // Define 'card' for each issue with inline styles; the entire card is clickable via the anchor tag
                    return `
                        <li class="issue-item">
                        <a href="${issue.html_url}" target="_blank" rel="noopener noreferrer" class="issue-link" style="text-decoration: none; color: #24292e; display: block;">
                            <div class="issue-card-content">
                            
                            <div class="issue-meta" style="display: flex; justify-content: space-between; font-size: 0.85rem; color: #586069;">
                                <span class="issue-repo-name" style="font-weight: 600; color: var(--color-primary-dark)">${repoName}</span>
                                <span class="issue-number" style="color: var(--color-primary-dark)">#${issue.number}</span>
                            </div>
                            
                            <div class="issue-title" style="font-size: 0.95rem; font-weight: 500; line-height: 1.4;">
                                ${issue.title}
                            </div>
                            
                            <div class="issue-tags-container" style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 2px;">
                                ${tagsHtml}
                            </div>
                            
                            </div>
                        </a>
                        </li>
                    `;
                }).join('')}
            </ul>
            `;

    } catch (error) {
        console.error('Error fetching GitHub issues:', error);
        container.innerHTML = `<p class="issue-error">Failed to load issues. Please try again later.</p>`;
    }
}

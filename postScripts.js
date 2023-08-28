// Assuming markdown-it.min.js is in the same directory as your script.js
const md = window.markdownit();

// Function to load and render Markdown content
function loadPost(postName) {
    fetch(`posts/${postName}.md`)
        .then(response => response.text())
        .then(markdown => {
            const postDiv = document.createElement('div');
            postDiv.innerHTML = md.render(markdown);

            const postsSection = document.getElementById('posts');
            postsSection.appendChild(postDiv);
        })
        .catch(error => {
            console.error('Error loading post:', error);
        });
}

// Function to read and load all posts
function loadAllPosts() {
    const postsSection = document.getElementById('posts');
    postsSection.innerHTML = ''; // Clear existing posts

    fetch('posts-list.json') // This could be a JSON array of post names
        .then(response => response.json())
        .then(postList => {
            postList.forEach(postName => {
                loadPost(postName);
            });
        })
        .catch(error => {
            console.error('Error loading posts list:', error);
        });
}

// Event listeners for search input and sort select
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    filterPosts(searchTerm);
});

const sortSelect = document.getElementById('sort-select');
sortSelect.addEventListener('change', () => {
    // Implement sorting logic here based on selected option
    // For example, you could sort post names and then load them
    loadAllPosts();
});

// Initial load of all posts (you can call this based on your needs)
loadAllPosts();

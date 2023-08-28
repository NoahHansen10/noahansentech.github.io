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

// Function to filter posts based on search input
function filterPosts(searchTerm) {
    const postsSection = document.getElementById('posts');
    postsSection.innerHTML = ''; // Clear existing posts

    // Loop through posts and load matching ones
    // You'll need to modify this to match your post naming convention
    const allPostNames = ['post1', 'post2', 'post3']; // Example post names

    allPostNames.forEach(postName => {
        if (postName.includes(searchTerm)) {
            loadPost(postName);
        }
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
    const sortedPostNames = ['post1', 'post2', 'post3']; // Example sorted post names

    const postsSection = document.getElementById('posts');
    postsSection.innerHTML = ''; // Clear existing posts

    sortedPostNames.forEach(postName => {
        loadPost(postName);
    });
});

// Initial load of posts (you can call this based on your needs)
const initialPosts = ['post1', 'post2', 'post3']; // Example initial post names
initialPosts.forEach(postName => {
    loadPost(postName);
});

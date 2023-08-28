document.addEventListener('DOMContentLoaded', function() {
    console.log("Script started");
    const postList = document.getElementById('post-list');

    const postsDirectory = '/Content/posts'; // Adjust the directory path as needed

    // Fetch the list of folder names (posts) from the specified directory
    fetchAndDisplayFolderContents(postsDirectory);

    // Function to fetch and display folder contents with optional search and sorting
    function fetchAndDisplayFolderContents(directory, searchTerm = '', sortBy = 'name') {
        fetchFolderNames(directory)
            .then(folderNames => {
                postList.innerHTML = ''; // Clear previous content

                folderNames.forEach(folderName => {
                    fetch(`/Content/posts/${folderName}/${folderName}.md`) // Fetch the .md file
                        .then(response => response.text())
                        .then(mdContent => {
                            const metadataMatches = mdContent.match(/---([\s\S]*?)---/);
                            const metadata = metadataMatches ? metadataMatches[1] : '';

                            const title = metadata.match(/title:\s*(.*)(\r?\ndate|\r?\ndesc)/)[1].trim();
                            const date = metadata.match(/date:\s*(.*)(\r?\ndesc|\r?\ntitle)/)[1].trim();
                            const desc = metadata.match(/desc:\s*(.*)/)[1].trim();
                            const imageFileName = metadata.match(/image:\s*(.*)/)[1].trim();

                            const postItem = document.createElement('a'); // Change to <a> element
                            postItem.classList.add('post-item');
                            postItem.href = `posts.html?post=${folderName}`; // Link to the post content

                            const postImage = document.createElement('div'); // Container for background image
                            postImage.classList.add('post-image');
                            postImage.style.backgroundImage = `url('https://www.noahhansentech.com/Content/posts/${folderName}/${imageFileName}')`;

                            postItem.appendChild(postImage);

                            const postLink = document.createElement('div'); // Container for text content
                            postLink.classList.add('post-link');
                            postLink.innerHTML = `<h2>${title}</h2><p>${desc}</p><span>${date}</span>`;

                            postItem.appendChild(postLink);

                            postList.appendChild(postItem);
                        })
                        .catch(error => {
                            console.error('Error loading or parsing post:', error);
                        });
                });
            })
            .catch(error => {
                console.error('Error fetching folder names:', error);
            });
    }

    // Event listener for search input
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toLowerCase();
        fetchAndDisplayFolderContents(postsDirectory, searchTerm);
    });

    // Event listener for sorting select
    const sortingSelect = document.getElementById('sorting-select');
    sortingSelect.addEventListener('change', function() {
        const selectedSorting = sortingSelect.value;
        fetchAndDisplayFolderContents(postsDirectory, '', selectedSorting);
    });
});

// Function to fetch folder names from a directory
async function fetchFolderNames(directory) {
    const response = await fetch(`https://api.github.com/repos/Noahboss67/noahansentech.github.io/contents${directory}`);
    const data = await response.json();

    const folderNames = data
        .filter(item => item.type === 'dir')
        .map(item => item.name);

    return folderNames;
}

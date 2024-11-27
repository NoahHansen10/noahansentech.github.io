document.addEventListener('DOMContentLoaded', function () {
    console.log("Script started");
    const postList = document.getElementById('post-list');
    const postsDirectory = '/Content/posts';

    // Event listener for sorting
    document.getElementById('sorting-select').addEventListener('change', (event) => {
        fetchAndDisplayFolderContents(postsDirectory, '', event.target.value);
    });

    // Fetch and display folder contents
    function fetchAndDisplayFolderContents(directory, searchTerm = '', sortBy) {
        fetchFolderNames(directory)
            .then(folderNames => {
                postList.innerHTML = ''; // Clear previous content

                const postsPromises = folderNames.map(folderName =>
                    fetch(`/Content/posts/${folderName}/${folderName}.md`)
                        .then(response => response.text())
                        .then(mdContent => {
                            const metadataMatches = mdContent.match(/---([\s\S]*?)---/);
                            const metadata = metadataMatches ? metadataMatches[1] : '';

                            const titleMatch = metadata.match(/title:\s*(.*)/);
                            const title = titleMatch ? titleMatch[1].trim() : 'Untitled';

                            const dateMatch = metadata.match(/date:\s*(.+)/);
                            const date = dateMatch ? dateMatch[1].trim() : 'Date not available';

                            const descMatch = metadata.match(/desc:\s*(.*)/);
                            const desc = descMatch ? descMatch[1].trim() : 'No description available';

                            const imageMatch = metadata.match(/image:\s*(.*)/);
                            let imageFileName = imageMatch ? imageMatch[1].trim() : '../../default.webp';
                            if (!imageFileName || imageFileName === 'None' || imageFileName === 'null') {
                                imageFileName = '../../default.webp';
                            }
                            //console.log(dateMatch)
                            const postImageURL = imageFileName.startsWith('http')
                                ? imageFileName
                                : `https://www.noahhansentech.com/Content/posts/${folderName}/${imageFileName}`;

                            return { folderName, title, date, desc, imageFileName: postImageURL };
                        })
                );

                Promise.all(postsPromises)
                    .then(posts => {
                        if (sortBy === 'date') {
                            posts.sort((a, b) => new Date(b.date) - new Date(a.date));
                        } else if (sortBy === 'name') {
                            posts.sort((a, b) => a.title.localeCompare(b.title));
                        }

                        posts.forEach(({ folderName, title, date, desc, imageFileName }) => {
                            const postItem = document.createElement('a');
                            postItem.classList.add('post-item');
                            postItem.href = `posts.html?post=${folderName}`;

                            const postImage = document.createElement('img');
                            postImage.classList.add('post-image');
                            postImage.src = imageFileName;
                            postItem.appendChild(postImage);

                            const postLink = document.createElement('div');
                            postLink.classList.add('post-link');
                            postLink.innerHTML = `<h2>${title}</h2><p>${desc}</p><span>${date}</span>`;
                            //console.log("Metadata for", folderName, ":", { title, date, desc });
                            postItem.appendChild(postLink);
                            postList.appendChild(postItem);
                        });
                    })
                    .catch(error => {
                        console.error(`Error loading or parsing posts:`, error);
                    });
            })
            .catch(error => {
                console.error('Error fetching folder names:', error);
            });
    }

    async function fetchFolderNames(directory) {
        const response = await fetch(`https://api.github.com/repos/Noahboss67/noahansentech.github.io/contents${directory.startsWith('/') ? '' : '/'}${directory}`);
        const data = await response.json();

        return data
            .filter(item => item.type === 'dir')
            .map(item => item.name);
    }

    // Initial load
    fetchAndDisplayFolderContents(postsDirectory);
});

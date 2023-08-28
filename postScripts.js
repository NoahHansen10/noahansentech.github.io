document.addEventListener('DOMContentLoaded', function() {
    const postList = document.getElementById('post-list');

    // Replace 'posts/' with the correct path to your directory
    const postsDirectory = 'posts/';

    // List of post file names (without the .md extension)
    const postFileNames = [
        'post1',
        'post2',
        'post3'
        // Add more post file names as needed
    ];

    // Populate the list with links to posts
    postFileNames.forEach(postFileName => {
        const postLink = document.createElement('a');
        postLink.href = `${postsDirectory}${postFileName}.md`;
        postLink.textContent = postFileName;

        const listItem = document.createElement('li');
        listItem.appendChild(postLink);

        postList.appendChild(listItem);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const postList = document.getElementById('post-list');

    const postsDirectory = 'Posts/';
    const postFileNames = [
        'post1.md'
        // Add more post file names as needed
    ];

    postFileNames.forEach(postFileName => {
        const postLink = document.createElement('a');
        postLink.href = `${postsDirectory}${postFileName}.md`;
        postLink.textContent = postFileName;

        const listItem = document.createElement('li');
        listItem.appendChild(postLink);

        postList.appendChild(listItem);
    });
});

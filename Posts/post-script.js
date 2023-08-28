// post-script.js

document.addEventListener('DOMContentLoaded', function() {
    const postList = document.getElementById('post-list');

    const postsDirectory = '/';
    const postsMetadata = [
        { fileName: 'post1', title: 'Post 1 Title', date: '2023-08-01' },
        { fileName: 'post2', title: 'Post 2 Title', date: '2023-08-10' },
        { fileName: 'post3', title: 'Post 3 Title', date: '2023-08-20' }
        // Add more post metadata as needed
    ];

    postsMetadata.forEach(postMetadata => {
        const postLink = document.createElement('a');
        postLink.href = `posts.html?post=${postMetadata.fileName}`;
        postLink.textContent = postMetadata.title;

        const listItem = document.createElement('li');
        listItem.appendChild(postLink);

        // Create additional elements for post information
        const postDate = document.createElement('span');
        postDate.className = 'post-date';
        postDate.textContent = `Posted on ${postMetadata.date}`;
        listItem.appendChild(postDate);

        postList.appendChild(listItem);
    });
});

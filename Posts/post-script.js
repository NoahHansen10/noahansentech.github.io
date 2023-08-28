// post-script.js

document.addEventListener('DOMContentLoaded', function() {
    console.log("Script started");
    const postList = document.getElementById('post-list');

    const postsDirectory = '/Posts/';
    const postsMetadata = [
        { fileName: 'post1', title: 'Post 1 Title', date: '2023-08-01' }
        // Add more post metadata as needed
    ];

    postsMetadata.forEach(postMetadata => {
        console.log(document.getElementById('post-list'));

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
        console.log(`Generating link for: ${postMetadata.fileName}`);

    });
});

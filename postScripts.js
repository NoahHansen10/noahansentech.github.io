document.addEventListener('DOMContentLoaded', function() {
    const postList = document.getElementById('post-list');

    const postsDirectory = 'Posts/';
    const postsMetadata = [
        { fileName: 'post1', title: 'TestingPost1', date: '2023/08/01' }
        // Add more post metadata as needed
    ];

    postsMetadata.forEach(postMetadata => {
        const postLink = document.createElement('a');
        postLink.href = `${postsDirectory}${postMetadata.fileName}.md`;
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

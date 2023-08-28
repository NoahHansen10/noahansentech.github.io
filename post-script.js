document.addEventListener('DOMContentLoaded', function() {
    const postInfoSection = document.getElementById('post-info');

    // Get the post filename from the query parameter
    const params = new URLSearchParams(window.location.search);
    const postFileName = params.get('post');

    if (postFileName) {
        fetch(`Posts/${postFileName}.md`)
            .then(response => response.text())
            .then(markdown => {
                const postContent = document.createElement('div');
                postContent.innerHTML = markdown;

                postInfoSection.appendChild(postContent);
            })
            .catch(error => {
                console.error('Error loading post content:', error);
            });
    }
});

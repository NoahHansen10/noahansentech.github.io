document.addEventListener('DOMContentLoaded', function() {
    const postInfoSection = document.getElementById('post-info');

    const params = new URLSearchParams(window.location.search);
    const postFileName = params.get('post');

    if (postFileName) {
        fetch(`posts/${postFileName}.md`)
            .then(response => response.text())
            .then(markdown => {
                const postContent = document.createElement('div');
                postContent.innerHTML = md.render(markdown);

                postInfoSection.appendChild(postContent);
            })
            .catch(error => {
                console.error('Error loading post content:', error);
            });
    }
});

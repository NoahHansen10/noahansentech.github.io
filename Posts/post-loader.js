const urlParams = new URLSearchParams(window.location.search);
const postName = urlParams.get('post');

if (postName) {
    fetch(`/Posts/${postName}.md`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(markdown => {
            const md = window.markdownit();
            const htmlContent = md.render(markdown);
            document.getElementById('post-content').innerHTML = htmlContent;
        })
        .catch(error => {
            console.error("Error fetching the .md file:", error);
            document.getElementById('post-content').innerHTML = 'Error loading post content.';
        });
} else {
    document.getElementById('post-content').innerHTML = 'No post specified.';
}
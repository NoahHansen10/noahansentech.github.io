const urlParams = new URLSearchParams(window.location.search);
const postName = urlParams.get('post');

if (postName) {
    fetch(`/Posts/${postName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(markdown => {
            document.getElementById('post-content').textContent = markdown;
        })
        .catch(error => {
            console.error("Error fetching the .md file:", error);
            document.getElementById('post-content').textContent = 'Error loading post content.';
        });
} else {
    document.getElementById('post-content').textContent = 'No post specified.';
}

document.getElementById('custom-footer').innerHTML = footerContent;

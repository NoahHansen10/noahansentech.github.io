// Get the postName from the URL query parameter
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const postName = urlParams.get('posts');

// Assuming you have a directory called 'posts' where your .md files are stored
const mdFilePath = `posts/${postName}.md`;

// Fetch the .md file
fetch(mdFilePath)
  .then(response => response.text())
  .then(mdContent => {
    // Convert Markdown to HTML using the marked library
    const htmlContent = marked(mdContent);

    // Display the HTML content in the 'post-content' div
    const postContentDiv = document.getElementById('post-content');
    postContentDiv.innerHTML = htmlContent;
  })
  .catch(error => {
    console.error('Error loading or converting post:', error);
  });

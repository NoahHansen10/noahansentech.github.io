// Get the postName from the URL query parameter
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const postName = urlParams.get('post');

// Assuming you have a directory called 'posts' where your .md files are stored
const mdFilePath = `/Content/posts/${postName}/${postName}.md`;

// Fetch the .md file
fetch(mdFilePath)
  .then(response => response.text())
  .then(mdContent => {
    // Remove YAML metadata blocks (e.g., title, date)
    const contentWithoutMetadata = mdContent.replace(/^---([\s\S]*?)---/, '');
    console.log(mdContent);
    // Extract title from Markdown content
    const title = contentWithoutMetadata.match(/^#\s+(.*)/m)[0];

    // Set the title of the webpage
    document.title = title.replace(/^#+\s+#+/, '') + ' | Noah Hansen Tech';

    // Convert Markdown to HTML using the marked library
    const htmlContent = marked(contentWithoutMetadata);


    // Display the HTML content in the 'post-content' div
    const postContentDiv = document.getElementById('post-content-inner');
    postContentDiv.innerHTML = htmlContent;
  })
  .catch(error => {
    console.error('Error loading or converting post:', error);
  });

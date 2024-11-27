// Get the postName from the URL query parameter
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const postName = urlParams.get('post');

// Assuming you have a directory called 'posts' where your .md files are stored
fetch(`/Content/posts/${folderName}/${folderName}.md`)
  .then(response => {
    if (!response.ok) throw new Error(`Failed to load file: ${response.statusText}`);
    return response.text();
  })
  .then(mdContent => {
    const metadataMatches = mdContent.match(/---([\s\S]*?)---/);
    const metadata = metadataMatches ? metadataMatches[1] : '';

    console.log("Metadata content:", metadata);

    const titleMatch = metadata.match(/title:\s*(.*)/);
    const title = titleMatch ? titleMatch[1].trim() : 'Untitled';

    const dateMatch = metadata.match(/date:\s*(.+)/);
    const date = dateMatch ? dateMatch[1].trim() : 'Unknown date';

    const descMatch = metadata.match(/desc:\s*(.*)/);
    const desc = descMatch ? descMatch[1].trim() : 'No description available';

    console.log({ title, date, desc });
  })
  .catch(error => {
    console.error("Error loading or parsing post:", error);
  });

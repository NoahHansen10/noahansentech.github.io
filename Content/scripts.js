document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');

  const postList = document.getElementById('post-list');
  if (!postList) {
    console.error('Post list container not found');
    return;
  }
  console.log('Post list container found');

  // Attach a click event listener to the post list
  postList.addEventListener('click', (event) => {
    console.log('Post list clicked');
    const target = event.target.closest('.post-item');
    if (target) {
      event.preventDefault();
      console.log('Post item clicked');
      const postName = target.getAttribute('href').split('=')[1];
      if (postName) {
        console.log(`Post name: ${postName}`);
        redirectToPost(postName);
      } else {
        console.log('No post name found on the clicked element');
      }
    } else {
      console.log('Clicked element is not a post item');
    }
  });

  function redirectToPost(postName) {
    console.log(`Redirecting to post: ${postName}`);
    window.location.href = `posts.html?post=${postName}`;
  }

  const username = "NoahHansen10";
  const repo = "noahansentech.github.io";
  const directory = "posts"; // Directory containing subfolders of posts

  const apiURL = `https://api.github.com/repos/${username}/${repo}/contents/Content/${directory}`;

  // Function to fetch and list posts
  async function fetchAndListPosts() {
    try {
      console.log(`Fetching directory: ${apiURL}`);
      const response = await fetch(apiURL);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const items = await response.json();
      console.log("Fetched items:", items);

      const list = document.getElementById('post-list');

      for (const item of items) {
        console.log(`Processing item: ${item.name}, type: ${item.type}`);
        if (item.type === 'dir') { // Check if it's a directory
          const folderApiUrl = item.url; // Use GitHub API URL from the item directly
          console.log(`Fetching folder: ${folderApiUrl}`);
          const folderResponse = await fetch(folderApiUrl); // Fetch folder contents
          if (!folderResponse.ok) {
            console.log(`Failed to fetch folder: ${folderApiUrl}`);
            throw new Error(`HTTP error! Status: ${folderResponse.status}`);
          }

          const files = await folderResponse.json();
          console.log(`Fetched files in folder ${item.name}:`, files);

          for (const file of files.filter(file => file.name.endsWith('.md'))) {
            console.log(`Adding file: ${file.name}`);
            const metadataResponse = await fetch(file.download_url);
            if (!metadataResponse.ok) {
              throw new Error(`Failed to fetch metadata for file: ${file.name}`);
            }

            const fileContent = await metadataResponse.text();
            const metadata = extractMetadata(fileContent);

            const listItem = document.createElement('a');
            listItem.classList.add('post-item');
            listItem.href = `posts.html?post=${item.name}`;

            const postImage = document.createElement('img');
            postImage.classList.add('post-image');
            postImage.src = metadata.image
              ? `https://raw.githubusercontent.com/${username}/${repo}/main/Content/posts/${item.name}/${metadata.image}`
              : `https://raw.githubusercontent.com/${username}/${repo}/main/Content/default.webp`; // Default image fallback
            postImage.alt = `Image for ${metadata.title || file.name}`;
            postImage.onerror = () => {
              console.log(`Image failed to load, using default for ${file.name}`);
              postImage.src = `https://raw.githubusercontent.com/${username}/${repo}/main/Content/default.webp`;
            }; // Ensure default image on error

            const postLink = document.createElement('div');
            postLink.classList.add('post-link');

            // Format the date
            const formattedDate = metadata.datetime
              ? new Date(metadata.datetime).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              : 'Unknown date';

            postLink.innerHTML = `<h2>${metadata.title || file.name.replace('.md', '')}</h2><p>${metadata.desc || 'No description available'}</p><span>${formattedDate}</span>`;

            listItem.appendChild(postImage);
            listItem.appendChild(postLink);
            list.appendChild(listItem);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      console.log(`Debug: Directory URL used - ${apiURL}`);
    }
  }

  // Function to extract metadata from the Markdown content
  function extractMetadata(content) {
    const metadata = {};
    const lines = content.split('\n');
    lines.forEach(line => {
      if (line.startsWith('name:')) {
        metadata.name = line.replace('name:', '').trim();
      } else if (line.startsWith('title:')) {
        metadata.title = line.replace('title:', '').trim();
      } else if (line.startsWith('image:')) {
        metadata.image = line.replace('image:', '').trim();
      } else if (line.startsWith('date:')) {
        metadata.datetime = line.replace('date:', '').trim();
      } else if (line.startsWith('desc:')) {
        metadata.desc = line.replace('desc:', '').trim();
      }
    });
    return metadata;
  }

  // Call the function on page load
  fetchAndListPosts();

  // Function to render Markdown content from URL parameters
  async function renderMarkdown() {
    const params = new URLSearchParams(window.location.search);
    const postName = params.get('post');
    if (!postName) {
      console.error('No post name provided');
      return;
    }

    const postUrl = `https://raw.githubusercontent.com/${username}/${repo}/main/Content/posts/${postName}/${postName}.md`;

    try {
      const response = await fetch(postUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const markdownContent = await response.text();
      const contentContainer = document.getElementById('content-container');
      if (!contentContainer) {
        console.error('Content container not found');
        return;
      }

      contentContainer.innerHTML = marked(markdownContent); // Use a Markdown library like marked.js
    } catch (error) {
      console.error('Error fetching Markdown content:', error);
    }
  }

  // Call renderMarkdown if on the view page
  if (window.location.search.includes('post=')) {
    document.addEventListener('DOMContentLoaded', renderMarkdown);
  }
});

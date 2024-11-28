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

        files
          .filter(file => file.name.endsWith('.md')) // Filter for Markdown files
          .forEach(async file => {
            console.log(`Adding file: ${file.name}`);
            const metadataResponse = await fetch(file.download_url);
            if (!metadataResponse.ok) {
              throw new Error(`Failed to fetch metadata for file: ${file.name}`);
            }

            const fileContent = await metadataResponse.text();
            const metadata = extractMetadata(fileContent);

            const listItem = document.createElement('a');
            listItem.classList.add('post-item');
            listItem.href = `view.html?post=${encodeURIComponent(file.download_url)}`;

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
          });
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
  const postUrl = params.get('post');
  if (!postUrl) {
    console.error('No post URL provided');
    return;
  }

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
if (window.location.pathname.endsWith('posts.html')) {
  document.addEventListener('DOMContentLoaded', renderMarkdown);
}

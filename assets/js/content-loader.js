(function () {
  const contentContainer = document.getElementById('post-content-inner');
  if (!contentContainer) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const postName = params.get('post');

  const setMessage = (title, message) => {
    contentContainer.innerHTML = `<div class="post-message"><h1>${title}</h1><p>${message}</p></div>`;
  };

  if (!postName) {
    setMessage('Missing Post', 'No post was specified in the URL.');
    return;
  }

  const manifestUrl = '/Content/posts/index.json';
  const mdFilePath = `/Content/posts/${postName}/post.md`;

  const parseFrontMatter = (markdown) => {
    const match = markdown.match(/^---\n([\s\S]*?)\n---/);
    if (!match) {
      return { metadata: {}, content: markdown };
    }

    const metadata = {};
    match[1].split('\n').forEach((line) => {
      const keyValueMatch = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
      if (!keyValueMatch) {
        return;
      }
      metadata[keyValueMatch[1].trim()] = keyValueMatch[2].trim();
    });

    return { metadata, content: markdown.slice(match[0].length).trimStart() };
  };

  const rewriteObsidianImages = (markdown, slug) => {
    return markdown.replace(/!\[\[([^\]]+)\]\]/g, (_match, fileName) => {
      const clean = String(fileName).trim();
      return `![${clean}](/Content/posts/${slug}/${clean})`;
    });
  };

  const formatDate = (iso) => {
    if (!iso) {
      return '';
    }

    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderPost = (metadata, markdown) => {
    const normalized = rewriteObsidianImages(markdown, postName);
    const htmlContent = marked(normalized);

    const formattedDate = formatDate(metadata.date);
    const updatedDate = formatDate(metadata.updated);

    const metaBits = [
      formattedDate ? `<span>Published: ${formattedDate}</span>` : '',
      updatedDate ? `<span>Updated: ${updatedDate}</span>` : '',
    ].filter(Boolean).join(' • ');

    const title = metadata.title || postName;
    document.title = `${title} | Noah Hansen Tech`;

    contentContainer.innerHTML = `
      <article class="post-article">
        <header class="post-header">
          <h1>${title}</h1>
          ${metaBits ? `<p class="post-meta">${metaBits}</p>` : ''}
          ${metadata.desc ? `<p class="post-desc">${metadata.desc}</p>` : ''}
        </header>
        <section class="post-body">${htmlContent}</section>
      </article>
    `;
  };

  const loadManifestEntry = async () => {
    try {
      const response = await fetch(manifestUrl, { cache: 'no-store' });
      if (!response.ok) {
        return null;
      }

      const posts = await response.json();
      if (!Array.isArray(posts)) {
        return null;
      }

      return posts.find((post) => String(post.slug) === postName) || null;
    } catch (_error) {
      return null;
    }
  };

  const initialize = async () => {
    setMessage('Loading Post...', 'Please wait while content is loaded.');

    try {
      const mdResponse = await fetch(mdFilePath, { cache: 'no-store' });
      if (!mdResponse.ok) {
        setMessage('Post Not Found', 'The requested post does not exist.');
        return;
      }

      const markdown = await mdResponse.text();
      const { metadata, content } = parseFrontMatter(markdown);

      const manifestEntry = await loadManifestEntry();
      const mergedMetadata = { ...(manifestEntry || {}), ...metadata };
      renderPost(mergedMetadata, content);
    } catch (error) {
      console.error('Error loading post:', error);
      setMessage('Error Loading Post', 'Something went wrong while loading this post.');
    }
  };

  initialize();
})();

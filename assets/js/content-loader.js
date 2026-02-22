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
    let currentListKey = null;
    match[1].split('\n').forEach((line) => {
      const listItemMatch = line.match(/^\s*-\s*(.+)$/);
      if (listItemMatch && currentListKey) {
        metadata[currentListKey] = metadata[currentListKey] || [];
        metadata[currentListKey].push(listItemMatch[1].trim());
        return;
      }

      const keyValueMatch = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
      if (!keyValueMatch) {
        currentListKey = null;
        return;
      }

      const key = keyValueMatch[1].trim();
      const value = keyValueMatch[2].trim();
      if (value === '') {
        metadata[key] = [];
        currentListKey = key;
      } else {
        metadata[key] = value;
        currentListKey = null;
      }
    });

    return { metadata, content: markdown.slice(match[0].length).trimStart() };
  };

  const rewriteObsidianImages = (markdown, slug) => {
    let output = markdown.replace(/!\[\[([^\]]+)\]\]/g, (_match, fileName) => {
      const clean = String(fileName).trim();
      return `![${clean}](/Content/posts/${slug}/${clean})`;
    });

    output = output.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt, rawUrl) => {
      const url = String(rawUrl).trim();
      if (/^(https?:\/\/|\/|data:|#)/i.test(url)) {
        return `![${alt}](${url})`;
      }
      const fileName = url.split('/').filter(Boolean).pop();
      if (!fileName) {
        return `![${alt}](${url})`;
      }
      return `![${alt}](/Content/posts/${slug}/${fileName})`;
    });

    return output;
  };

  const stripDuplicateTopHeadings = (markdown, title) => {
    const lines = markdown.split('\n');
    let i = 0;

    const isBlankOrHashOnly = (line) => {
      const trimmed = line.trim();
      return trimmed === '' || trimmed === '#';
    };

    while (i < lines.length && isBlankOrHashOnly(lines[i])) {
      i += 1;
    }

    const titleHeadingMatch = i < lines.length ? lines[i].match(/^#{1,6}\s*(.+)\s*$/) : null;
    if (titleHeadingMatch && title && titleHeadingMatch[1].trim().toLowerCase() === String(title).trim().toLowerCase()) {
      i += 1;
      while (i < lines.length && lines[i].trim() === '') {
        i += 1;
      }
    }

    const dateHeadingPattern = /^#{1,6}\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|[A-Za-z]+\s+\d{1,2},?\s+\d{4})\s*$/;
    if (i < lines.length && dateHeadingPattern.test(lines[i].trim())) {
      i += 1;
      while (i < lines.length && lines[i].trim() === '') {
        i += 1;
      }
    }

    return lines.slice(i).join('\n').trimStart();
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

  const escapeHtml = (value) => {
    if (typeof value !== 'string') {
      return '';
    }

    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/\//g, '&#x2F;');
  };

  const renderPost = (metadata, markdown) => {
    const title = metadata.title || escapeHtml(postName);
    const withoutDuplicateTop = stripDuplicateTopHeadings(markdown, title);
    const normalized = rewriteObsidianImages(withoutDuplicateTop, postName);
    const htmlContent = marked(normalized);

    const formattedDate = formatDate(metadata.date);
    const updatedDate = formatDate(metadata.updated);

    const metaBits = [
      formattedDate ? `<span>Published: ${formattedDate}</span>` : '',
      updatedDate ? `<span>Updated: ${updatedDate}</span>` : '',
    ].filter(Boolean).join(' • ');

    const tags = Array.isArray(metadata.tags)
      ? metadata.tags
      : typeof metadata.tags === 'string' && metadata.tags
        ? metadata.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
        : [];
    const heroImage = metadata.image ? `/Content/posts/${postName}/${metadata.image}` : '';
    const heroIsLogo = typeof metadata.image === 'string' && /(logo|icon)/i.test(metadata.image);

    document.title = `${title} | Noah Hansen Tech`;

    contentContainer.innerHTML = `
      <article class="post-article">
        <header class="post-header">
          ${heroImage ? `<img class="post-hero-image${heroIsLogo ? ' post-hero-image--logo' : ''}" src="${heroImage}" alt="${title} cover image" loading="lazy">` : ''}
          <h1>${title}</h1>
          ${metaBits ? `<p class="post-meta">${metaBits}</p>` : ''}
          ${metadata.desc ? `<p class="post-desc">${metadata.desc}</p>` : ''}
          ${tags.length ? `<div class="post-tags">${tags.map((tag) => `<span class="post-tag">${tag}</span>`).join('')}</div>` : ''}
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

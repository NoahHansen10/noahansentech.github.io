document.addEventListener('DOMContentLoaded', () => {
  const postList = document.getElementById('post-list');
  const stateEl = document.getElementById('post-list-state');
  const searchInput = document.getElementById('search-input');
  const sortSelect = document.getElementById('sorting-select');

  if (!postList || !stateEl || !searchInput || !sortSelect) {
    return;
  }

  const manifestUrl = '/Content/posts/index.json';
  const defaultImage = '/assets/images/default.webp';
  let allPosts = [];

  const setState = (message) => {
    stateEl.textContent = message;
    stateEl.style.display = message ? 'block' : 'none';
  };

  const normalizePost = (raw) => {
    const slug = String(raw.slug || '').trim();
    const title = String(raw.title || slug || 'Untitled').trim();
    const desc = String(raw.desc || 'No description available').trim();
    const dateRaw = String(raw.date || '').trim();
    const date = dateRaw && !Number.isNaN(new Date(dateRaw).getTime()) ? dateRaw : null;
    const image = String(raw.image || '').trim();
    const isLogoImage = /(logo|icon)/i.test(image);

    return {
      slug,
      title,
      desc,
      date,
      image,
      isLogoImage,
      imageUrl: image ? `/Content/posts/${slug}/${image}` : defaultImage,
      tags: Array.isArray(raw.tags) ? raw.tags : [],
    };
  };

  const parseFrontMatter = (markdown) => {
    const match = markdown.match(/^---\n([\s\S]*?)\n---/);
    if (!match) {
      return {};
    }

    const metadata = {};
    match[1].split('\n').forEach((line) => {
      const keyValueMatch = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
      if (!keyValueMatch) {
        return;
      }

      const key = keyValueMatch[1].trim();
      const value = keyValueMatch[2].trim();
      metadata[key] = value;
    });

    return metadata;
  };

  const fetchPostsFromManifest = async () => {
    const response = await fetch(manifestUrl, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Manifest fetch failed (${response.status})`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Manifest format invalid. Expected an array.');
    }

    return data.map(normalizePost).filter((post) => post.slug);
  };

  const fetchPostsFromGitHubApiFallback = async () => {
    const apiUrl = 'https://api.github.com/repos/NoahHansen10/noahansentech.github.io/contents/Content/posts';
    const response = await fetch(apiUrl, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`GitHub API fallback failed (${response.status})`);
    }

    const items = await response.json();
    const folders = items.filter((item) => item.type === 'dir').map((item) => item.name);

    const posts = await Promise.all(
      folders.map(async (slug) => {
        try {
          const mdResponse = await fetch(`/Content/posts/${slug}/post.md`, { cache: 'no-store' });
          if (!mdResponse.ok) {
            throw new Error('post.md not found');
          }

          const markdown = await mdResponse.text();
          const metadata = parseFrontMatter(markdown);
          return normalizePost({ slug, ...metadata });
        } catch (error) {
          return normalizePost({ slug });
        }
      })
    );

    return posts;
  };

  const formatDate = (iso) => {
    if (!iso) {
      return 'Date unavailable';
    }

    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
      return 'Date unavailable';
    }

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderPosts = () => {
    const query = searchInput.value.trim().toLowerCase();
    const sortMode = sortSelect.value;

    const filtered = allPosts.filter((post) => {
      if (!query) {
        return true;
      }

      return (
        post.title.toLowerCase().includes(query) ||
        post.desc.toLowerCase().includes(query) ||
        post.tags.join(' ').toLowerCase().includes(query)
      );
    });

    filtered.sort((a, b) => {
      if (sortMode === 'name') {
        return a.title.localeCompare(b.title);
      }

      const timeA = a.date ? new Date(a.date).getTime() : 0;
      const timeB = b.date ? new Date(b.date).getTime() : 0;
      return timeB - timeA;
    });

    postList.innerHTML = '';

    if (filtered.length === 0) {
      setState('No posts match your search.');
      return;
    }

    setState('');

    filtered.forEach((post) => {
      const postItem = document.createElement('a');
      postItem.className = 'post-item';
      postItem.href = `posts.html?post=${encodeURIComponent(post.slug)}`;

      const postImage = document.createElement('img');
      postImage.className = 'post-image';
      if (post.isLogoImage) {
        postImage.classList.add('post-image--logo');
      }
      postImage.src = post.imageUrl;
      postImage.alt = `${post.title} preview image`;
      postImage.loading = 'lazy';
      postImage.onerror = () => {
        postImage.src = defaultImage;
      };

      const postLink = document.createElement('div');
      postLink.className = 'post-link';
      postLink.innerHTML = `<h2>${post.title}</h2><p>${post.desc}</p><span>${formatDate(post.date)}</span>`;

      postItem.appendChild(postImage);
      postItem.appendChild(postLink);
      postList.appendChild(postItem);
    });
  };

  const initialize = async () => {
    setState('Loading posts...');

    try {
      allPosts = await fetchPostsFromManifest();
    } catch (manifestError) {
      console.warn('Post manifest unavailable, using GitHub API fallback.', manifestError);
      try {
        allPosts = await fetchPostsFromGitHubApiFallback();
      } catch (fallbackError) {
        console.error('Unable to load posts.', fallbackError);
        setState('Unable to load posts right now. Please try again later.');
        return;
      }
    }

    if (!allPosts.length) {
      setState('No posts found.');
      return;
    }

    renderPosts();
  };

  searchInput.addEventListener('input', renderPosts);
  sortSelect.addEventListener('change', renderPosts);

  initialize();
});

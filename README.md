## Overview
This is a static site designed for GitHub Pages deployment.

## Local Development
From the repository root:

`python3 -m http.server`

Then open `http://localhost:8000`.

## Repository Structure
- `index.html`, `about.html`, `HomeLab.html`: root compatibility entrypoints for GitHub Pages and legacy links.
- `pages/desktop/`: canonical desktop pages.
- `pages/mobile/`: canonical mobile pages.
- `mobile/`: compatibility redirects for legacy mobile URLs.
- `assets/css/`: shared and page-type stylesheets.
- `assets/js/`: shared loaders and page scripts.
- `assets/images/`: image assets and favicon.
- `assets/docs/`: downloadable documents.
- `components/`: shared HTML fragments (header, navbar, footer).
- `Content/`: post list, post renderer, and markdown post folders.
- `archive/legacy-pages/`: archived legacy pages no longer used as entrypoints.

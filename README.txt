DIGITAL ANTIQUITIES — LISTING IMAGE + REFRESH BUTTON UPDATE

Included:
- index.html: higher-contrast gold refresh button, readable loading state, and support for more OpenSea image/metadata fields.
- api/opensea-listings.js: keeps active listings and enriches listing records with NFT metadata/images using the OpenSea API.

Deployment:
1. Back up your existing repository first.
2. Copy the updated index.html to the same root location as your current index.html.
3. Copy api/opensea-listings.js to the repository's api/ folder, replacing the existing opensea-listings.js.
4. In Vercel → Project Settings → Environment Variables, make sure OPENSEA_API_KEY is set. Never put the API key in index.html or GitHub.
5. Redeploy the project.

Notes:
- The backend uses a small concurrency limit (4 metadata requests at a time) and a 60-second CDN cache to avoid unnecessary repeated requests.
- If a specific NFT has no public image/metadata from OpenSea, the gallery will still show its listing with the placeholder.
- Keep your existing Vercel project structure and other files; do not delete unrelated files.

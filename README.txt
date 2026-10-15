DIGITAL ANTIQUITIES — ROYAL AUCTION EXPRESS

This version redesigns the Grand Exhibition Hall as a luxury royal train of NFT collection carriages.

WHAT CHANGED
- Royal black-and-gold train presentation with locomotive-style emblem, illuminated rail, carriage roofs, and wheel details.
- One representative unlisted NFT per collection, based on the existing OpenSea exhibition API's grouping logic.
- Each collection representative appears in its own horizontally arranged carriage.
- Carriages automatically advance every 8 seconds; visitors can also use Previous Carriage / Next Carriage controls or the keyboard arrow keys while the train area is focused.
- Each carriage links to that NFT's OpenSea page.
- Previous/Next controls use high-contrast gold styling and are mobile-friendly.
- The Auction Hall and active OpenSea listings remain separate; no bids, prices, or auction activity are fabricated.

FILES
- index.html
- api/opensea-listings.js
- api/opensea-exhibition.js

DEPLOY
1. Back up your current Vercel project.
2. Replace the root index.html with this version.
3. Include both API files under the project's api/ directory.
4. Ensure OPENSEA_API_KEY is configured in Vercel Environment Variables. Never place the API key in frontend code.
5. Keep OPENSEA_EXHIBITION_CHAINS optional; its default networks are set in api/opensea-exhibition.js.
6. Redeploy and test the Grand Exhibition Hall on desktop and mobile.

NOTES
- The exhibition API shows NFTs returned by OpenSea as held by the configured wallet, excluding items detected in the account's active listings.
- It can only display NFTs and metadata returned by OpenSea on supported networks. Missing artwork or collection metadata may affect display/grouping.
- The carousel is a visual exhibition, not an on-site auction. Genuine bids and auction settlement are not implemented in this version.
- The API uses server-side caching and bounded sequential requests to reduce repeated API traffic.

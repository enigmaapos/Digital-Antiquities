DIGITAL ANTIQUITIES — AUCTION-HOUSE STYLE WEBSITE UPDATE

This version applies the future auction-house vision to the current site while preserving the existing OpenSea live-listing integration.

What changed:
- Cinematic black-and-gold auction-house visual direction.
- Updated hero, brand slogan, navigation, and project messaging.
- Added a Grand Auction Hall preview with a clear IN DEVELOPMENT label.
- Reframed the existing OpenSea gallery as available artifacts/lots.
- Explicitly distinguishes active OpenSea listings from real auctions; some listings may be fixed-price.
- Adds a roadmap for genuine auctions, verified results, and future collector features.
- Keeps the Refresh button, image URL normalization, fallback placeholders, and API-side metadata enrichment from the previous version.
- Does NOT create fake bids, fake countdowns, or an on-site bidding system. Live bidding is a future development phase.

Deploy:
1. Back up your current project.
2. Replace root index.html with this version.
3. Replace api/opensea-listings.js with the included file.
4. Ensure OPENSEA_API_KEY is configured in Vercel Environment Variables. Never put the key in frontend code or commit it to GitHub.
5. Redeploy and test the active listings and image display.

Current behavior:
- Active OpenSea listings for the configured account appear in the gallery.
- Each card links to its OpenSea listing.
- The Auction Hall section is a visual preview of the future product, not a live auction.
- Real bidding requires a separate secure integration with supported auction functionality or a carefully audited auction contract.

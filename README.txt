DIGITAL ANTIQUITIES — GRAND EXHIBITION UPDATE

This update adds a rotating Grand Exhibition Hall that showcases NFTs currently held by the configured Digital Antiquities wallet, while excluding NFTs with active OpenSea listings.

Included files:
- index.html
- api/opensea-listings.js (existing active-listings endpoint)
- api/opensea-exhibition.js (new unlisted-NFT exhibition endpoint)

How it works:
- Reads owned NFTs through the official OpenSea API for configured chains.
- Checks the account's active listings and excludes those NFTs from the exhibition.
- Selects one representative unlisted NFT per collection (preferring NFTs with artwork), then rotates those collection representatives every 8 seconds with high-contrast, readable Previous/Next controls.
- Each collection is represented only once in the Grand Exhibition. Each representative links to its OpenSea NFT page where available.
- Uses server-side caching and sequential requests to reduce API bursts.
- Does not create fake bids, prices, sale claims, or auction countdowns.

Deploy:
1. Back up your current Vercel project.
2. Replace root index.html with the included index.html.
3. Keep/replace api/opensea-listings.js with the included version.
4. Add api/opensea-exhibition.js in the project's api folder.
5. Ensure OPENSEA_API_KEY is set in Vercel Environment Variables. Never expose this key in frontend code or GitHub.
6. Optional: set OPENSEA_EXHIBITION_CHAINS to a comma-separated list of supported OpenSea chain slugs. Default: ethereum,base,polygon,arbitrum,optimism,solana.
7. Redeploy, then test /api/opensea-exhibition and the Grand Exhibition section.

Important notes:
- The exhibition shows NFTs currently held by the configured wallet, not every NFT ever created by the account.
- Only NFTs returned by OpenSea's account-NFT API can be featured. User-hidden NFTs, unsupported networks, or unavailable metadata may not appear.
- Each chain request retrieves up to 200 NFTs per response. The endpoint checks multiple networks and uses Vercel's shared cache (5-minute s-maxage) to limit repeated API calls.
- Active listing exclusion checks up to three pages of account listings. If the wallet has more active listings than that, a listing beyond the checked pages could be missed; increase pagination carefully if needed.
- Images may not load if their original host is unavailable or blocks embedding. This is an API/metadata/hosting limitation, not necessarily a website rendering error.
- The exhibition is for display only. NFTs shown here are marked as not listed and do not imply ownership beyond the connected wallet data, nor are they available for purchase through this section.

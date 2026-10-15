const WALLET_ADDRESS = '0x494d8866f098a363e4effdfef2f5e240730b4c2a';
const API_BASE = 'https://api.opensea.io/api/v2';

function normalize(value) {
  return String(value ?? '').trim().toLowerCase();
}
function normalizeImageUrl(value) {
  if (typeof value !== 'string') return '';
  const raw = value.trim();
  if (!raw) return '';
  if (raw.startsWith('ipfs://')) return `https://ipfs.io/ipfs/${raw.slice(7).replace(/^ipfs\//, '')}`;
  if (raw.startsWith('ar://')) return `https://arweave.net/${raw.slice(5)}`;
  if (raw.startsWith('//')) return `https:${raw}`;
  return raw;
}
async function openSeaFetch(url, apiKey) {
  const response = await fetch(url, { headers: { accept: 'application/json', 'x-api-key': apiKey } });
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`OpenSea API returned ${response.status}${body ? `: ${body.slice(0, 180)}` : ''}`);
  }
  return response.json();
}
function nftKey(item, fallbackChain = '') {
  const chain = normalize(item.chain || fallbackChain);
  const contract = normalize(item.contract || item.contract_address || '');
  const identifier = normalize(item.identifier ?? item.token_id ?? '');
  if (!identifier) return '';
  return `${chain}:${contract}:${identifier}`;
}
function genericNftKey(item) {
  const contract = normalize(item.contract || item.contract_address || '');
  const identifier = normalize(item.identifier ?? item.token_id ?? '');
  return contract && identifier ? `${contract}:${identifier}` : '';
}
async function getActiveListingKeys(apiKey) {
  const exact = new Set();
  const generic = new Set();
  let after = '';
  // Bound pagination to keep API usage predictable. The response is cached by Vercel.
  for (let page = 0; page < 3; page++) {
    const params = new URLSearchParams({ limit: '50', sort_by: 'START_TIME', sort_direction: 'desc' });
    if (after) params.set('after', after);
    const payload = await openSeaFetch(`${API_BASE}/account/${encodeURIComponent(WALLET_ADDRESS)}/listings?${params}`, apiKey);
    const listings = Array.isArray(payload.listings) ? payload.listings : [];
    for (const listing of listings) {
      const asset = listing.asset || listing.item || listing.nft || {};
      const chain = listing.chain || asset.chain || '';
      const key = nftKey({ ...asset, chain }, chain);
      const genericKey = genericNftKey(asset);
      if (key) exact.add(key);
      if (genericKey) generic.add(genericKey);
    }
    after = payload.next || '';
    if (!after || listings.length === 0) break;
  }
  return { exact, generic };
}
async function getOwnedNftsForChain(chain, apiKey) {
  const url = `${API_BASE}/chain/${encodeURIComponent(chain)}/account/${encodeURIComponent(WALLET_ADDRESS)}/nfts?limit=200&include_auto_hidden=false`;
  const payload = await openSeaFetch(url, apiKey);
  return (Array.isArray(payload.nfts) ? payload.nfts : []).map(nft => ({ ...nft, chain }));
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const apiKey = process.env.OPENSEA_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'OPENSEA_API_KEY is not configured in Vercel Environment Variables.' });

  const defaultChains = 'ethereum,base,polygon,arbitrum,optimism,solana';
  const chains = [...new Set(String(process.env.OPENSEA_EXHIBITION_CHAINS || defaultChains)
    .split(',').map(s => s.trim().toLowerCase()).filter(Boolean))].slice(0, 10);

  try {
    const listingKeys = await getActiveListingKeys(apiKey);
    const nfts = [];
    const errors = [];
    // Sequential requests avoid a burst against OpenSea's API.
    for (const chain of chains) {
      try {
        const owned = await getOwnedNftsForChain(chain, apiKey);
        for (const nft of owned) {
          const exact = nftKey(nft, chain);
          const generic = genericNftKey(nft);
          if ((exact && listingKeys.exact.has(exact)) || (generic && listingKeys.generic.has(generic))) continue;
          if (nft.is_disabled || nft.is_nsfw) continue;
          const image = normalizeImageUrl(nft.display_image_url || nft.image_url || nft.original_image_url || '');
          nfts.push({
            chain,
            contract: nft.contract || '',
            identifier: String(nft.identifier ?? ''),
            name: nft.name || `NFT #${nft.identifier ?? 'Untitled'}`,
            description: nft.description || '',
            collection: nft.collection || '',
            image_url: image,
            display_image_url: image,
            opensea_url: nft.opensea_url || '',
            token_standard: nft.token_standard || ''
          });
        }
      } catch (error) {
        errors.push(`${chain}: ${error.message || 'request failed'}`);
      }
    }
    const seen = new Set();
    const unique = nfts.filter(nft => {
      const key = nftKey(nft, nft.chain);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    // Put NFTs with usable artwork first; rotate the remaining items afterward.
    unique.sort((a, b) => Number(Boolean(b.image_url)) - Number(Boolean(a.image_url)) || a.name.localeCompare(b.name));
    if (!unique.length && errors.length === chains.length) {
      return res.status(502).json({ error: `Could not retrieve owned NFTs. ${errors.join(' | ')}` });
    }
    return res.status(200).json({
      nfts: unique,
      chains_checked: chains,
      note: unique.length ? '' : `No unlisted NFTs were found on the checked networks (${chains.join(', ')}).${errors.length ? ` Some networks could not be checked: ${errors.join(' | ')}` : ''}`,
      partial_errors: errors
    });
  } catch (error) {
    return res.status(502).json({ error: error.message || 'Unable to load the Grand Exhibition.' });
  }
};

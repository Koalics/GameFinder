const API = 'https://api.rawg.io/api';

/** @returns {string} */
export function getRawgKey() {
  const key = import.meta.env.VITE_RAWG_API_KEY;
  if (!key || String(key).trim() === '') {
    throw new Error(
      'Не задан VITE_RAWG_API_KEY. Создайте .env.local — см. README.',
    );
  }
  return String(key).trim();
}

/**
 * @param {string} key
 * @returns {Promise<{ id: number, name: string, slug: string }[]>}
 */
export async function fetchGenreOptions(key, wantedNames) {
  const url = new URL(`${API}/genres`);
  url.searchParams.set('key', key);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`RAWG genres: ${res.status}`);
  const data = await res.json();
  const byName = new Map((data.results || []).map((g) => [g.name, g]));
  return wantedNames
    .map((name) => {
      const g = byName.get(name);
      return g ? { id: g.id, name: g.name, slug: g.slug } : null;
    })
    .filter(Boolean);
}

/**
 * @param {string} key
 * @returns {Promise<Map<string, string>>} slug -> id string
 */
export async function fetchParentPlatformIds(key) {
  const url = new URL(`${API}/platforms/lists/parents`);
  url.searchParams.set('key', key);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`RAWG platforms: ${res.status}`);
  const data = await res.json();
  const map = new Map();
  for (const p of data.results || []) {
    if (p.slug) map.set(p.slug, String(p.id));
  }
  return map;
}

/**
 * @param {'relevance'|'name'|'released'|'rating'} orderBy
 */
export function rawgOrdering(orderBy) {
  if (orderBy === 'name') return 'name';
  if (orderBy === 'released') return '-released';
  if (orderBy === 'rating') return '-rating';
  return '';
}

/**
 * @param {Record<string, unknown>} g
 */
export function mapRawGame(g) {
  const parents = g.parent_platforms || [];
  const platforms = [];
  for (const pp of parents) {
    const slug = pp.platform?.slug || pp.slug;
    if (slug === 'pc') platforms.push('windows');
    else if (slug === 'playstation') platforms.push('playstation');
    else if (slug === 'xbox') platforms.push('xbox');
  }
  const release = g.released;
  let releaseMs = 0;
  let releaseDate = '—';
  if (release) {
    const d = new Date(release);
    if (!Number.isNaN(d.getTime())) {
      releaseMs = d.getTime();
      releaseDate = d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  }
  return {
    id: g.id,
    title: g.name,
    image: typeof g.background_image === 'string' ? g.background_image : '',
    releaseDate,
    releaseMs,
    genres: (g.genres || []).map((x) => x.name),
    platforms,
  };
}

/**
 * @param {string} key
 * @param {{
 *   page: number
 *   pageSize: number
 *   search: string
 *   genreSlugs: string[]
 *   ordering: string
 *   parentPlatforms: string
 *   dates?: string
 *   metacritic?: string
 * }} opts
 */
export async function fetchGamesPage(key, opts) {
  const url = new URL(`${API}/games`);
  url.searchParams.set('key', key);
  url.searchParams.set('page', String(opts.page));
  url.searchParams.set('page_size', String(opts.pageSize));
  const q = opts.search.trim();
  if (q) url.searchParams.set('search', q);
  if (opts.genreSlugs.length)
    url.searchParams.set('genres', opts.genreSlugs.join(','));
  if (opts.ordering) url.searchParams.set('ordering', opts.ordering);
  if (opts.parentPlatforms)
    url.searchParams.set('parent_platforms', opts.parentPlatforms);
  if (opts.dates) url.searchParams.set('dates', opts.dates);
  if (opts.metacritic) url.searchParams.set('metacritic', opts.metacritic);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`RAWG games: ${res.status}`);
  const data = await res.json();
  const results = (data.results || []).map(mapRawGame);
  return {
    results,
    next: data.next,
  };
}

/**
 * @param {string} key
 * @param {string|number} gameId
 */
export async function fetchGameDetail(key, gameId) {
  const url = new URL(`${API}/games/${gameId}`);
  url.searchParams.set('key', key);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`RAWG game: ${res.status}`);
  return res.json();
}

/**
 * @param {string} key
 * @param {string|number} gameId
 * @returns {Promise<{ image: string }[]>}
 */
export async function fetchGameScreenshots(key, gameId) {
  const url = new URL(`${API}/games/${gameId}/screenshots`);
  url.searchParams.set('key', key);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`RAWG screenshots: ${res.status}`);
  const data = await res.json();
  return data.results || [];
}

/**
 * @param {string} key
 * @param {string|number} gameId
 */
export async function fetchGameStores(key, gameId) {
  const url = new URL(`${API}/games/${gameId}/stores`);
  url.searchParams.set('key', key);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`RAWG stores: ${res.status}`);
  const data = await res.json();
  return data.results || [];
}

/** @type {Map<string, { name: string, slug: string, domain: string }> | null} */
let storeCatalogCache = null;
/** @type {Promise<Map<string, { name: string, slug: string, domain: string }>> | null} */
let storeCatalogPromise = null;

/**
 * Справочник магазинов RAWG (`/stores`): id → name, slug, domain.
 * @param {string} key
 * @returns {Promise<Map<string, { name: string, slug: string, domain: string }>>}
 */
export async function fetchStoreCatalog(key) {
  if (storeCatalogCache) return storeCatalogCache;
  if (!storeCatalogPromise) {
    storeCatalogPromise = (async () => {
      const url = new URL(`${API}/stores`);
      url.searchParams.set('key', key);
      url.searchParams.set('page_size', '40');
      const res = await fetch(url);
      if (!res.ok) throw new Error(`RAWG stores catalog: ${res.status}`);
      const data = await res.json();
      const map = new Map();
      for (const s of data.results || []) {
        if (s.id == null) continue;
        map.set(String(s.id), {
          name: s.name || 'Store',
          slug: typeof s.slug === 'string' ? s.slug : '',
          domain: typeof s.domain === 'string' ? s.domain : '',
        });
      }
      storeCatalogCache = map;
      return map;
    })();
  }
  return storeCatalogPromise;
}

/**
 * @param {string} url
 * @param {Map<string, { name: string, slug: string, domain: string }>} catalog
 */
function guessStoreFromUrl(url, catalog) {
  let host = '';
  try {
    host = new URL(url).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return null;
  }
  for (const meta of catalog.values()) {
    const domain = meta.domain.replace(/^www\./, '').toLowerCase();
    if (domain && (host === domain || host.endsWith(`.${domain}`))) {
      return { name: meta.name, slug: meta.slug };
    }
  }
  const label = host.split('.')[0];
  if (!label) return null;
  return {
    name: label.charAt(0).toUpperCase() + label.slice(1),
    slug: label,
  };
}

/**
 * Ссылки магазинов игры: RAWG отдаёт `store_id` + `url`, без вложенного `store`.
 * @param {unknown[]} rows
 * @param {Map<string, { name: string, slug: string, domain: string }>} catalog
 * @returns {{ name: string, slug: string, url: string }[]}
 */
export function mapGameStoreLinks(rows, catalog) {
  return (rows || [])
    .map((r) => {
      const row = /** @type {Record<string, unknown>} */ (r);
      const url =
        typeof row.url === 'string'
          ? row.url
          : typeof row.url_en === 'string'
            ? row.url_en
            : '';
      if (!url) return null;

      const nested = /** @type {{ name?: string, slug?: string } | undefined} */ (
        row.store
      );
      if (nested?.name) {
        return {
          name: nested.name,
          slug: typeof nested.slug === 'string' ? nested.slug : '',
          url,
        };
      }

      const storeId = row.store_id != null ? String(row.store_id) : '';
      const meta = storeId ? catalog.get(storeId) : undefined;
      if (meta) {
        return { name: meta.name, slug: meta.slug, url };
      }

      const guessed = guessStoreFromUrl(url, catalog);
      if (guessed) return { ...guessed, url };

      return { name: 'Store', slug: '', url };
    })
    .filter((s) => s != null);
}

/**
 * @param {string} key
 * @param {string|number} gameId
 */
export async function fetchGameAdditions(key, gameId) {
  const url = new URL(`${API}/games/${gameId}/additions`);
  url.searchParams.set('key', key);
  url.searchParams.set('page_size', '24');
  const res = await fetch(url);
  if (!res.ok) throw new Error(`RAWG additions: ${res.status}`);
  const data = await res.json();
  return data.results || [];
}

/**
 * @param {string} released ISO date
 */
export function formatReleaseBadge(released) {
  if (!released) return '—';
  const d = new Date(released);
  if (Number.isNaN(d.getTime())) return '—';
  return d
    .toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    .toUpperCase();
}

/**
 * @param {Record<string, unknown>} game
 */
export function mapDetailPlatforms(game) {
  const list = game.platforms || [];
  const names = [];
  for (const row of list) {
    const n = row.platform?.name;
    if (n) names.push(n);
  }
  return names;
}

/**
 * @param {Record<string, unknown>} game
 * @returns {('windows'|'playstation'|'xbox')[]}
 */
export function mapHeroPlatformIcons(game) {
  const parents = game.parent_platforms || [];
  const out = [];
  for (const pp of parents) {
    const slug = pp.platform?.slug || pp.slug;
    if (slug === 'pc') out.push('windows');
    else if (slug === 'playstation') out.push('playstation');
    else if (slug === 'xbox') out.push('xbox');
  }
  return out;
}

/** RAWG `store.slug` → Iconify id (`simple-icons:*` или `mdi:*`). */
const SLUG_TO_ICONIFY = {
  steam: 'simple-icons:steam',
  gog: 'simple-icons:gogdotcom',
  'epic-games': 'simple-icons:epicgames',
  epic: 'simple-icons:epicgames',
  xbox: 'simple-icons:xbox',
  'xbox-store': 'simple-icons:microsoftstore',
  playstation: 'simple-icons:playstation',
  nintendo: 'simple-icons:nintendo',
  humble: 'simple-icons:humblebundle',
  itch: 'simple-icons:itchdotio',
  'google-play': 'simple-icons:googleplay',
  'apple-appstore': 'simple-icons:appstore',
  uplay: 'simple-icons:ubisoft',
  ubisoft: 'simple-icons:ubisoft',
  origin: 'simple-icons:origin',
  'ea-app': 'simple-icons:ea',
  discord: 'simple-icons:discord',
  zoom: 'simple-icons:zoom',
  twitch: 'simple-icons:twitch',
  'amazon-luna': 'simple-icons:amazonluna',
}

const DEFAULT_ICON = 'mdi:storefront-outline'

/**
 * @param {string | undefined | null} slug поле `store.slug` из RAWG
 * @returns {string} Iconify icon id для `<Icon :icon="…" />`
 */
export function resolveStoreIconify(slug) {
  const key = String(slug || '')
    .toLowerCase()
    .trim()
  return SLUG_TO_ICONIFY[key] ?? DEFAULT_ICON
}

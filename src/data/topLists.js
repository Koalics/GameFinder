/** Пресеты раздела Top (параметры RAWG + UI). */
export const TOP_LISTS = {
  all: {
    slug: 'all',
    title: 'All Games',
    path: '/',
    dates: '',
    metacritic: '',
    defaultRawgOrdering: '',
    maxGames: null,
    defaultGenreSlugs: [],
  },
  'best-of-year': {
    slug: 'best-of-year',
    title: 'Best of the Year',
    path: '/top/best-of-year',
    dates: () => {
      const y = new Date().getFullYear()
      return `${y}-01-01,${y}-12-31`
    },
    metacritic: '',
    defaultRawgOrdering: '-rating',
    maxGames: null,
    defaultGenreSlugs: [],
  },
  'popular-2025': {
    slug: 'popular-2025',
    title: 'Popular in 2025',
    path: '/top/popular-2025',
    dates: '2025-01-01,2025-12-31',
    metacritic: '',
    defaultRawgOrdering: '-rating',
    maxGames: null,
    defaultGenreSlugs: [],
  },
  'all-time-250': {
    slug: 'all-time-250',
    title: 'All time top 250',
    path: '/top/all-time-250',
    dates: '',
    metacritic: '75,100',
    defaultRawgOrdering: '-metacritic',
    maxGames: 250,
    defaultGenreSlugs: [],
  },
}

/** @param {string} slug */
export function getTopListConfig(slug) {
  return TOP_LISTS[slug] ?? TOP_LISTS.all
}

/** @param {import('vue-router').RouteLocationNormalizedLoaded} route */
export function resolveListSlugFromRoute(route) {
  if (route.name === 'top-list' && typeof route.params.listSlug === 'string') {
    return route.params.listSlug in TOP_LISTS ? route.params.listSlug : 'all'
  }
  return 'all'
}

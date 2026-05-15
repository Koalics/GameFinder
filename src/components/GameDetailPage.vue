<script setup>
import { computed, ref, shallowRef, watch } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from './gamefinder/Navbar.vue';
import GameDetailBreadcrumbs from './gameDetail/GameDetailBreadcrumbs.vue';
import GameDetailHeroMeta from './gameDetail/GameDetailHeroMeta.vue';
import GameDetailAbout from './gameDetail/GameDetailAbout.vue';
import GameDetailFacts from './gameDetail/GameDetailFacts.vue';
import GameDetailAdditions from './gameDetail/GameDetailAdditions.vue';
import GameDetailGallery from './gameDetail/GameDetailGallery.vue';
import GameDetailStores from './gameDetail/GameDetailStores.vue';
import {
  fetchGameAdditions,
  fetchGameDetail,
  fetchGameScreenshots,
  fetchGameStores,
  formatReleaseBadge,
  getRawgKey,
  mapHeroPlatformIcons,
  mapDetailPlatforms,
} from '../api/rawg.js';

const props = defineProps({
  id: { type: String, required: true },
});

const router = useRouter();

const configError = ref('');
const loadError = ref('');
const loading = ref(true);

const game = shallowRef(null);
const galleryImages = ref([]);
const storeLinks = ref([]);
const additionItems = ref([]);

const searchDraft = ref('');

const heroStyle = computed(() => {
  const u = game.value?.background_image;
  if (!u || typeof u !== 'string') {
    return {
      background: '#0a0a0a',
      minHeight: 'clamp(380px, 72vh, 640px)',
    };
  }
  return {
    backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.18) 32%, rgba(10,10,10,0.55) 58%, rgba(10,10,10,0.88) 82%, #0a0a0a 100%), url(${u})`,
    backgroundSize: 'cover, cover',
    backgroundPosition: 'center top, center 32%',
    backgroundRepeat: 'no-repeat',
    minHeight: 'clamp(380px, 72vh, 640px)',
  };
});

const aboutHtml = computed(() => {
  const g = game.value;
  if (!g) return '';
  const raw = g.description_raw;
  const plain = g.description;
  if (typeof raw === 'string' && raw.trim()) return raw;
  if (typeof plain === 'string' && plain.trim()) {
    return `<p>${plain.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`;
  }
  return '';
});

const facts = computed(() => {
  const g = game.value;
  if (!g) {
    return {
      platforms: '—',
      releaseDate: '—',
      genres: '—',
      developers: '—',
    };
  }
  const released = g.released;
  let releaseDate = '—';
  if (released) {
    const d = new Date(released);
    if (!Number.isNaN(d.getTime())) {
      releaseDate = d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  }
  return {
    platforms: mapDetailPlatforms(g).join(', ') || '—',
    releaseDate,
    genres: (g.genres || []).map((x) => x.name).join(', ') || '—',
    developers: (g.developers || []).map((x) => x.name).join(', ') || '—',
  };
});

async function loadAll() {
  configError.value = '';
  loadError.value = '';
  loading.value = true;
  game.value = null;
  galleryImages.value = [];
  storeLinks.value = [];
  additionItems.value = [];

  let key;
  try {
    key = getRawgKey();
  } catch (e) {
    configError.value = e instanceof Error ? e.message : String(e);
    loading.value = false;
    return;
  }

  const id = props.id;
  if (!/^\d+$/.test(id)) {
    loadError.value = 'Некорректный id игры';
    loading.value = false;
    return;
  }

  try {
    const [dRes, sRes, stRes, aRes] = await Promise.allSettled([
      fetchGameDetail(key, id),
      fetchGameScreenshots(key, id),
      fetchGameStores(key, id),
      fetchGameAdditions(key, id),
    ]);

    if (dRes.status !== 'fulfilled') {
      throw dRes.reason instanceof Error ? dRes.reason : new Error('RAWG game');
    }

    const detail = dRes.value;
    game.value = detail;

    const shots = sRes.status === 'fulfilled' ? sRes.value : [];
    const shotUrls = (shots || []).map((s) => s.image).filter(Boolean);
    const bg =
      typeof detail.background_image === 'string'
        ? detail.background_image
        : '';
    galleryImages.value = shotUrls.length > 0 ? shotUrls : bg ? [bg] : [];

    const stores = stRes.status === 'fulfilled' ? stRes.value : [];
    storeLinks.value = (stores || [])
      .map((r) => {
        const st = r.store || {};
        return {
          name: st.name || 'Store',
          slug: typeof st.slug === 'string' ? st.slug : '',
          url: r.url || r.url_en || '',
        };
      })
      .filter((s) => s.url);

    const adds = aRes.status === 'fulfilled' ? aRes.value : [];
    additionItems.value = (adds || []).map((a) => ({ id: a.id, name: a.name }));
  } catch (e) {
    loadError.value =
      e instanceof Error ? e.message : 'Не удалось загрузить игру';
  } finally {
    loading.value = false;
  }
}

watch(
  () => props.id,
  () => {
    loadAll();
  },
  { immediate: true },
);

function onNavSubmit() {
  const q = searchDraft.value.trim();
  if (!q) {
    router.push({ name: 'home' });
    return;
  }
  router.push({ name: 'home', query: { q } });
}
</script>

<template>
  <div class="detail">
    <Navbar v-model="searchDraft" @submit="onNavSubmit" />

    <p v-if="configError" class="detail__banner" role="alert">
      {{ configError }}
    </p>

    <template v-else>
      <div v-if="loading" class="detail__state">Загрузка…</div>
      <div v-else-if="loadError" class="detail__state detail__state--err">
        {{ loadError }}
      </div>

      <template v-else-if="game">
        <section class="detail__hero" :style="heroStyle">
          <div class="detail__hero-inner">
            <GameDetailBreadcrumbs :game-name="game.name" />
            <GameDetailHeroMeta
              :release-badge="formatReleaseBadge(game.released)"
              :platforms="mapHeroPlatformIcons(game)"
              :playtime-hours="Number(game.playtime) || 0"
              :title="game.name"
              :metacritic="
                game.metacritic != null ? Number(game.metacritic) : null
              "
            />
          </div>
        </section>

        <div class="detail__shell">
          <div class="detail__main">
            <GameDetailAbout :html="aboutHtml" />
            <GameDetailFacts
              :platforms="facts.platforms"
              :release-date="facts.releaseDate"
              :genres="facts.genres"
              :developers="facts.developers"
            />
            <GameDetailAdditions :items="additionItems" />
          </div>
          <aside class="detail__aside">
            <GameDetailGallery :images="galleryImages" />
            <GameDetailStores :stores="storeLinks" />
          </aside>
        </div>
      </template>
    </template>
  </div>
</template>

<style scoped>
.detail {
  min-height: 100svh;
  background: #0a0a0a;
  color: #e0e0e0;
}

.detail__banner {
  margin: 0;
  padding: 0.75rem 1.5rem;
  background: #3d1f1f;
  color: #ffb4b4;
  font-size: 0.875rem;
  border-bottom: 1px solid #5a2a2a;
}

.detail__state {
  padding: 3rem 1.5rem;
  text-align: center;
  font-size: 0.9375rem;
  color: #a0a0a0;
}

.detail__state--err {
  color: #ffb4b4;
}

.detail__hero {
  padding: 0 1.25rem 2.75rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.detail__hero-inner {
  max-width: 1180px;
  margin: 0 auto;
  width: 100%;
  padding-top: 4.5rem;
}

.detail__shell {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 1.25rem 3rem;
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.85fr);
  gap: 2rem 2.5rem;
  align-items: start;
}

@media (max-width: 960px) {
  .detail__shell {
    grid-template-columns: 1fr;
  }
}
</style>

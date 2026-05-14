import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// GitHub Pages: https://<user>.github.io/<repo>/
// Локально `npm run dev` — base остаётся '/'.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/GameFinder/' : '/',
  plugins: [vue()],
}))

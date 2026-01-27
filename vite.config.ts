import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json.ts'

export default defineConfig({
  plugins: [
    vue(),
    crx({ manifest }),
    Icons({ scale: 1 }),
  ],
  build: {
    rollupOptions: {
      input: {
        offscreen: './offscreen.html',
        sidePanel: './side-panel.html',
      }
    }
  },
  server: {
    cors: {
      origin: [
        /chrome-extension:\/\//,
      ],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

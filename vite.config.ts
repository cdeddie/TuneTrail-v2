import path from 'path';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import tailwind from "tailwindcss"
import autoprefixer from "autoprefixer"

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  plugins: [vue()],
  define: {
    DEV_BASE_URL: JSON.stringify('http://localhost:3443'),
    PROD_BASE_URL: JSON.stringify('https://tunetrail.site'),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

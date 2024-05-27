import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    DEV_BASE_URL: JSON.stringify('http://localhost:3443'),
    PROD_BASE_URL: JSON.stringify('https://tunetrail.site'),
  }
})

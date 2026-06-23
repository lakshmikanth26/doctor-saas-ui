import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
  server: {
    port: parseInt(process.env.PORT) || 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY || 'https://doctor-saas-gamma.vercel.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})

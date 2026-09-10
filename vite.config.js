import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// base './' keeps asset URLs relative so the built dist/ runs offline
// straight from the filesystem or any folder on the kiosk PC.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  server:{
    host:true
  }
})

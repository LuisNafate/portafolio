import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/portafolio/',
  plugins: [react()],
  build: {
    target: 'es2020',
  },
})

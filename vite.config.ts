import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // REPLACE 'family-tree' WITH YOUR EXACT GITHUB REPOSITORY NAME
  // Example: If your repo is github.com/john/my-tree, this should be '/my-tree/'
  base: '/family-tree/', 
})
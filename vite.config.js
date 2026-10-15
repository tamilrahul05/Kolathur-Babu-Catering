import fs from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { adminAuthPlugin } from './src/server/adminAuthPlugin.js'

function githubPagesPlugin() {
  return {
    name: 'github-pages-spa',
    closeBundle() {
      try {
        const distDir = fileURLToPath(new URL('./dist', import.meta.url))
        const indexPath = path.join(distDir, 'index.html')
        if (fs.existsSync(indexPath)) {
          const indexHtml = fs.readFileSync(indexPath, 'utf-8')
          // 404 fallback for direct SPA sub-path routing
          fs.writeFileSync(path.join(distDir, '404.html'), indexHtml)
          // Disable Jekyll processing on GitHub Pages
          fs.writeFileSync(path.join(distDir, '.nojekyll'), '')
          // Direct admin folder fallback
          const adminDir = path.join(distDir, 'admin')
          if (!fs.existsSync(adminDir)) {
            fs.mkdirSync(adminDir, { recursive: true })
          }
          fs.writeFileSync(path.join(adminDir, 'index.html'), indexHtml)
        }
      } catch (err) {
        console.warn('githubPagesPlugin error:', err)
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Kolathur-Babu-Catering/' : '/',
  plugins: [react(), adminAuthPlugin(), githubPagesPlugin()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))

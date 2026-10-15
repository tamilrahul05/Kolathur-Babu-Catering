import fs from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { adminAuthPlugin } from './src/server/adminAuthPlugin.js'

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }
  const entries = fs.readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

function githubPagesPlugin() {
  return {
    name: 'github-pages-spa',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        // When Vite processes index.html (in dev or build), ensure /src/main.jsx is used
        return html
          .replace(/<link rel="stylesheet" crossorigin href="[^"]*assets\/index-[^"]*\.css">/gi, '')
          .replace(
            /<script type="module" crossorigin src="[^"]*assets\/index-[^"]*\.js"><\/script>/gi,
            '<script type="module" src="/src/main.jsx"></script>'
          )
      },
    },
    closeBundle() {
      try {
        const rootDir = fileURLToPath(new URL('.', import.meta.url))
        const distDir = path.join(rootDir, 'dist')
        const docsDir = path.join(rootDir, 'docs')
        const indexPath = path.join(distDir, 'index.html')

        if (fs.existsSync(indexPath)) {
          const indexHtml = fs.readFileSync(indexPath, 'utf-8')

          // 1. Generate 404.html and .nojekyll in dist
          fs.writeFileSync(path.join(distDir, '404.html'), indexHtml)
          fs.writeFileSync(path.join(distDir, '.nojekyll'), '')

          // 2. Direct admin route fallback in dist
          const adminDir = path.join(distDir, 'admin')
          if (!fs.existsSync(adminDir)) {
            fs.mkdirSync(adminDir, { recursive: true })
          }
          fs.writeFileSync(path.join(adminDir, 'index.html'), indexHtml)

          // 3. Mirror everything to docs/ directory
          copyDirRecursive(distDir, docsDir)

          // 4. Mirror assets, 404.html, admin, and .nojekyll to project root
          // This guarantees GitHub Pages works when configured to main branch at / (root)!
          const distAssets = path.join(distDir, 'assets')
          const rootAssets = path.join(rootDir, 'assets')
          if (fs.existsSync(distAssets)) {
            copyDirRecursive(distAssets, rootAssets)
          }

          const rootAdmin = path.join(rootDir, 'admin')
          if (!fs.existsSync(rootAdmin)) {
            fs.mkdirSync(rootAdmin, { recursive: true })
          }
          fs.writeFileSync(path.join(rootAdmin, 'index.html'), indexHtml)
          fs.writeFileSync(path.join(rootDir, '404.html'), indexHtml)
          fs.writeFileSync(path.join(rootDir, '.nojekyll'), '')
          fs.writeFileSync(path.join(rootDir, 'index.html'), indexHtml)
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

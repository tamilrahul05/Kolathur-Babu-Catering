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
          .replace(/<link rel="icon"[^>]*href="[^"]*favicon[^"]*"[^>]*>/gi, '<link rel="icon" type="image/png" href="/favicon.png" />')
          .replace(/<link rel="stylesheet"[^>]*href="[^"]*assets\/index-[^"]*\.css"[^>]*>/gi, '')
          .replace(
            /<script type="module"[^>]*src="[^"]*assets\/index-[^"]*\.js"><\/script>/gi,
            '<script type="module" src="/src/main.jsx"></script>'
          )
      },
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/Kolathur-Babu-Catering/')) {
          req.url = req.url.replace('/Kolathur-Babu-Catering/', '/')
        }
        next()
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/Kolathur-Babu-Catering/')) {
          req.url = req.url.replace('/Kolathur-Babu-Catering/', '/')
        }
        next()
      })
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
          // Adjust relative paths for admin subfolder
          const adminHtml = indexHtml
            .replace(/href="\.\/assets\//g, 'href="../assets/')
            .replace(/src="\.\/assets\//g, 'src="../assets/')
            .replace(/href="\.\/favicon/g, 'href="../favicon')
            .replace(/href="\/Kolathur-Babu-Catering\/assets\//g, 'href="../assets/')
            .replace(/src="\/Kolathur-Babu-Catering\/assets\//g, 'src="../assets/')
            .replace(/href="\/Kolathur-Babu-Catering\/favicon/g, 'href="../favicon')
          fs.writeFileSync(path.join(adminDir, 'index.html'), adminHtml)

          // Keep legacy hash files in dist for browsers with cached HTML
          const legacyFiles = ['index-DBxzTutF.js', 'index-Bo0-YI3Y.css']
          for (const lf of legacyFiles) {
            const srcLegacy = path.join(rootDir, 'assets', lf)
            if (fs.existsSync(srcLegacy) && fs.existsSync(distAssets)) {
              fs.copyFileSync(srcLegacy, path.join(distAssets, lf))
            }
          }

          // 3. Mirror everything to docs/ directory
          copyDirRecursive(distDir, docsDir)

          // 4. Mirror assets, 404.html, admin, public icons, and .nojekyll to project root
          const distAssets = path.join(distDir, 'assets')
          const rootAssets = path.join(rootDir, 'assets')
          if (fs.existsSync(distAssets)) {
            copyDirRecursive(distAssets, rootAssets)
          }

          // Also mirror favicon and icons to root
          for (const iconFile of ['favicon.png', 'favicon.svg', 'icons.svg']) {
            const srcIcon = path.join(distDir, iconFile)
            if (fs.existsSync(srcIcon)) {
              fs.copyFileSync(srcIcon, path.join(rootDir, iconFile))
            }
          }

          // 5. Create a Kolathur-Babu-Catering folder alias in dist, docs, and root
          // This guarantees that ANY request to /Kolathur-Babu-Catering/... will ALWAYS find the files!
          for (const targetParent of [distDir, docsDir, rootDir]) {
            const compatDir = path.join(targetParent, 'Kolathur-Babu-Catering')
            if (!fs.existsSync(compatDir)) {
              fs.mkdirSync(compatDir, { recursive: true })
            }
            if (fs.existsSync(distAssets)) {
              copyDirRecursive(distAssets, path.join(compatDir, 'assets'))
            }
            for (const iconFile of ['favicon.png', 'favicon.svg', 'icons.svg']) {
              const srcIcon = path.join(distDir, iconFile)
              if (fs.existsSync(srcIcon)) {
                fs.copyFileSync(srcIcon, path.join(compatDir, iconFile))
              }
            }
            fs.writeFileSync(path.join(compatDir, 'index.html'), indexHtml)
            fs.writeFileSync(path.join(compatDir, '404.html'), indexHtml)
          }

          const rootAdmin = path.join(rootDir, 'admin')
          if (!fs.existsSync(rootAdmin)) {
            fs.mkdirSync(rootAdmin, { recursive: true })
          }
          fs.writeFileSync(path.join(rootAdmin, 'index.html'), adminHtml)
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
  base: command === 'build' ? './' : '/',
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

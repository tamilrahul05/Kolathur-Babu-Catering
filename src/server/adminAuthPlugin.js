import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Parses .env file manually if needed to guarantee values are available
 */
function readEnvFile() {
  try {
    const envPath = path.resolve(process.cwd(), '.env')
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8')
      const env = {}
      for (const line of content.split('\n')) {
        const trimmed = line.trim()
        if (trimmed && !trimmed.startsWith('#')) {
          const idx = trimmed.indexOf('=')
          if (idx !== -1) {
            const key = trimmed.slice(0, idx).trim()
            let val = trimmed.slice(idx + 1).trim()
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.slice(1, -1)
            }
            env[key] = val
          }
        }
      }
      return env
    }
  } catch {
    // Ignore error
  }
  return {}
}

/**
 * Timing-safe string comparison
 */
function safeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(bufA, bufB)
}

/**
 * Vite plugin providing secure backend admin authentication endpoints
 */
export function adminAuthPlugin() {
  const fileEnv = readEnvFile()
  const ADMIN_ID = process.env.ADMIN_ID || fileEnv.ADMIN_ID || 'Babucatering'
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || fileEnv.ADMIN_PASSWORD || 'Babucatering@9090'

  // Server-side active sessions store: token -> { user, expiresAt, createdAt }
  const activeSessions = new Map()

  // Clean expired sessions periodically
  setInterval(() => {
    const now = Date.now()
    for (const [token, session] of activeSessions.entries()) {
      if (session.expiresAt <= now) {
        activeSessions.delete(token)
      }
    }
  }, 15 * 60 * 1000).unref?.()

  const handleAuthRequests = (req, res, next) => {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)

    // 1. ADMIN LOGIN ENDPOINT
    if (url.pathname === '/api/admin/login' && req.method === 'POST') {
      let body = ''
      req.on('data', (chunk) => {
        body += chunk
      })
      req.on('end', () => {
        try {
          const { id, password } = JSON.parse(body || '{}')
          const trimmedId = typeof id === 'string' ? id.trim() : ''
          const trimmedPass = typeof password === 'string' ? password.trim() : ''

          const isIdValid = trimmedId.toLowerCase() === ADMIN_ID.toLowerCase()
          const isPassValid = safeCompare(trimmedPass, ADMIN_PASSWORD)

          if (isIdValid && isPassValid) {
            // Generate cryptographically secure random session token
            const token = crypto.randomBytes(32).toString('hex')
            const expiresAt = Date.now() + 8 * 60 * 60 * 1000 // 8 hours duration

            activeSessions.set(token, {
              user: ADMIN_ID,
              createdAt: Date.now(),
              expiresAt,
            })

            res.setHeader('Content-Type', 'application/json')
            res.setHeader(
              'Set-Cookie',
              `admin_session=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800`
            )
            res.statusCode = 200
            res.end(
              JSON.stringify({
                success: true,
                token,
                user: ADMIN_ID,
                expiresAt,
              })
            )
          } else {
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = 401
            res.end(
              JSON.stringify({
                success: false,
                message: 'Invalid ID or Password',
              })
            )
          }
        } catch {
          res.setHeader('Content-Type', 'application/json')
          res.statusCode = 400
          res.end(JSON.stringify({ success: false, message: 'Invalid request body' }))
        }
      })
      return
    }

    // 2. ADMIN VERIFY SESSION ENDPOINT
    if (url.pathname === '/api/admin/verify' && req.method === 'GET') {
      const authHeader = req.headers.authorization || ''
      let token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null

      if (!token && req.headers.cookie) {
        const match = req.headers.cookie.match(/admin_session=([^;]+)/)
        if (match) token = match[1]
      }

      if (token && activeSessions.has(token)) {
        const session = activeSessions.get(token)
        if (session.expiresAt > Date.now()) {
          res.setHeader('Content-Type', 'application/json')
          res.statusCode = 200
          res.end(JSON.stringify({ authenticated: true, user: session.user }))
          return
        }
        activeSessions.delete(token)
      }

      res.setHeader('Content-Type', 'application/json')
      res.statusCode = 401
      res.end(JSON.stringify({ authenticated: false, message: 'Unauthorized' }))
      return
    }

    // 3. ADMIN LOGOUT ENDPOINT
    if (url.pathname === '/api/admin/logout' && req.method === 'POST') {
      const authHeader = req.headers.authorization || ''
      let token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null

      if (!token && req.headers.cookie) {
        const match = req.headers.cookie.match(/admin_session=([^;]+)/)
        if (match) token = match[1]
      }

      if (token) {
        activeSessions.delete(token)
      }

      res.setHeader(
        'Set-Cookie',
        'admin_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'
      )
      res.setHeader('Content-Type', 'application/json')
      res.statusCode = 200
      res.end(JSON.stringify({ success: true }))
      return
    }

    next()
  }

  return {
    name: 'admin-auth-api',
    configureServer(server) {
      server.middlewares.use(handleAuthRequests)
    },
    configurePreviewServer(server) {
      server.middlewares.use(handleAuthRequests)
    },
  }
}

export default adminAuthPlugin

import { useState } from 'react'
import { Button } from '@/components/common'
import { formatDate } from '@/utils'
import { useAuth } from '../../hooks/useAuth'
import styles from './LoginForm.module.css'

export function LoginForm() {
  const { user, isAuthenticated, loading, error, login, logout } = useAuth()
  const [email, setEmail] = useState('developer@company.com')
  const [password, setPassword] = useState('secret123')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
    } catch {
      // Error handled in hook
    }
  }

  if (isAuthenticated && user) {
    return (
      <div className={styles.authenticatedBox}>
        <div className={styles.avatar}>✓</div>
        <div>
          <h4 className={styles.welcomeText}>Signed in as {user.name}</h4>
          <p className={styles.metaText}>Email: {user.email}</p>
          <p className={styles.metaText}>
            Logged in: {formatDate(user.lastLogin, { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={logout}>
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <div className={styles.errorAlert}>{error}</div>}

      <div className={styles.field}>
        <label className={styles.label} htmlFor="email-input">
          Work Email
        </label>
        <input
          id="email-input"
          type="email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@company.com"
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="password-input">
          Password
        </label>
        <input
          id="password-input"
          type="password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        disabled={loading}
        className={styles.submitBtn}
      >
        {loading ? 'Authenticating...' : 'Sign In Demo'}
      </Button>
    </form>
  )
}

import { useTheme } from '@/context'
import { Button } from '@/components/common'
import { CATERING_INFO } from '@/features/catering'
import styles from './Navbar.module.css'

export function Navbar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        <a href="#" className={styles.brand}>
          <span className={styles.logoBadge}>🍛</span>
          <div>
            <h1 className={styles.title}>{CATERING_INFO.name}</h1>
            <span className={styles.tagline}>High Class Caterers · Chennai</span>
          </div>
        </a>

        <nav className={styles.navLinks}>
          <a href="#menu" className={styles.link}>Menucard</a>
          <a href="#venues" className={styles.link}>Venues</a>
          <a href="#reviews" className={styles.link}>Reviews</a>
          <a href="#quote" className={styles.link}>Get Quote</a>
          <a href="#contact" className={styles.link}>Contact</a>
        </nav>

        <div className={styles.actions}>
          <a href={`tel:${CATERING_INFO.phones[0]}`} className={styles.phoneLink}>
            <Button variant="primary" size="sm" className={styles.callHeaderBtn}>
              📞 {CATERING_INFO.phones[0]}
            </Button>
          </a>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </Button>
        </div>
      </div>
    </header>
  )
}

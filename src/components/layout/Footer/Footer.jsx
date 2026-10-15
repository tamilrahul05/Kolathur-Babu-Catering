import { CATERING_INFO } from '@/features/catering'
import styles from './Footer.module.css'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.copy}>
          © {currentYear} {CATERING_INFO.name} · High Class Caterers in Chennai.
        </p>
        <div className={styles.meta}>
          <span>Authentic Taste</span>
          <span>•</span>
          <span>Hygienic Preparation</span>
          <span>•</span>
          <span>Punctual Service</span>
        </div>
      </div>
    </footer>
  )
}

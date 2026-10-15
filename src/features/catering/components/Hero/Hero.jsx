import { Button } from '@/components/common'
import { CATERING_INFO } from '../../data/cateringData'
import styles from './Hero.module.css'

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}>
        <div className={styles.content}>
          <span className={styles.badge}>ESTABLISHED & TRUSTED IN CHENNAI</span>
          <h1 className={styles.title}>{CATERING_INFO.name}</h1>
          <p className={styles.subtitle}>{CATERING_INFO.tagline}</p>
          <p className={styles.description}>{CATERING_INFO.description}</p>

          <div className={styles.actions}>
            <a href="#quote">
              <Button variant="primary" size="lg" className={styles.quoteBtn}>
                Get Free WhatsApp Quote →
              </Button>
            </a>
            <a href={`tel:${CATERING_INFO.phones[0]}`}>
              <Button variant="outline" size="lg" className={styles.callBtn}>
                📞 Call {CATERING_INFO.phones[0]}
              </Button>
            </a>
          </div>

          <div className={styles.highlights}>
            <div className={styles.highlightItem}>
              <span className={styles.stat}>100%</span>
              <span className={styles.label}>Authentic Taste</span>
            </div>
            <div className={styles.highlightItem}>
              <span className={styles.stat}>500+</span>
              <span className={styles.label}>Grand Weddings</span>
            </div>
            <div className={styles.highlightItem}>
              <span className={styles.stat}>Top</span>
              <span className={styles.label}>Convention Venues</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

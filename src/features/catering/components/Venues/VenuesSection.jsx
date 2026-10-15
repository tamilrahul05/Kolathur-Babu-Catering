import { Card } from '@/components/common'
import { VENUES } from '../../data/cateringData'
import styles from './VenuesSection.module.css'

export function VenuesSection() {
  return (
    <section id="venues" className={styles.section}>
      <div className={styles.header}>
        <span className={styles.badge}>PRESTIGIOUS LOCATIONS</span>
        <h2 className={styles.title}>Venues We Regularly Cater At</h2>
        <p className={styles.subtitle}>
          Trusted by top convention centres, kalyana mandapams, and luxury palaces across Chennai.
        </p>
      </div>

      <div className={styles.grid}>
        {VENUES.map((venue) => (
          <Card key={venue.id} hoverable className={styles.venueCard}>
            <div className={styles.cardHeader}>
              <span className={styles.pin}>📍</span>
              <h3 className={styles.venueName}>{venue.name}</h3>
            </div>
            <p className={styles.address}>{venue.address}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}

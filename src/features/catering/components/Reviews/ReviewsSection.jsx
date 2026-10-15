import { Card } from '@/components/common'
import { REVIEWS } from '../../data/cateringData'
import styles from './ReviewsSection.module.css'

export function ReviewsSection() {
  return (
    <section id="reviews" className={styles.section}>
      <div className={styles.header}>
        <span className={styles.ratingBadge}>⭐ 4.9 / 5.0 RATED ON GOOGLE</span>
        <h2 className={styles.title}>What Our Happy Clients Say</h2>
        <p className={styles.subtitle}>
          Read genuine feedback from families and event hosts who celebrated their milestones with us.
        </p>
      </div>

      <div className={styles.grid}>
        {REVIEWS.map((rev, idx) => (
          <Card key={idx} hoverable className={styles.reviewCard}>
            <div className={styles.reviewerHead}>
              <div className={styles.avatar}>{rev.name.charAt(0)}</div>
              <div>
                <h3 className={styles.name}>{rev.name}</h3>
                <span className={styles.time}>{rev.time}</span>
              </div>
            </div>

            <div className={styles.stars}>
              {'★'.repeat(rev.stars)}
            </div>

            <p className={styles.text}>"{rev.text}"</p>
          </Card>
        ))}
      </div>
    </section>
  )
}

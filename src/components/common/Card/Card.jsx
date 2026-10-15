import styles from './Card.module.css'

export function Card({ children, title, subtitle, className = '', hoverable = false }) {
  return (
    <div className={`${styles.card} ${hoverable ? styles.hoverable : ''} ${className}`}>
      {(title || subtitle) && (
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </div>
  )
}

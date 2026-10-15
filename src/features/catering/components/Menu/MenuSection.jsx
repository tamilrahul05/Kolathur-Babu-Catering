import { useState } from 'react'
import { Card } from '@/components/common'
import { VEG_MENU, NON_VEG_MENU } from '../../data/cateringData'
import styles from './MenuSection.module.css'

export function MenuSection() {
  const [activeTab, setActiveTab] = useState('veg') // 'veg' | 'nonveg'
  const currentMenu = activeTab === 'veg' ? VEG_MENU : NON_VEG_MENU

  return (
    <section id="menu" className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Grand Wedding & Event Menus</h2>
        <p className={styles.subtitle}>
          Tailored packages crafted by veteran chefs with the freshest ingredients and uncompromised hygiene.
        </p>

        {/* Tab Switcher */}
        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'veg' ? styles.activeVeg : ''}`}
            onClick={() => setActiveTab('veg')}
          >
            🌱 Traditional Vegetarian
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'nonveg' ? styles.activeNonVeg : ''}`}
            onClick={() => setActiveTab('nonveg')}
          >
            🍗 High Class Non-Vegetarian
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        {currentMenu.map((cat, idx) => (
          <Card
            key={idx}
            title={cat.category}
            hoverable
            className={`${styles.menuCard} ${activeTab === 'nonveg' ? styles.nonvegBorder : styles.vegBorder}`}
          >
            <ul className={styles.itemList}>
              {cat.items.map((item, i) => (
                <li key={i} className={styles.item}>
                  <span className={styles.bullet}>✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <div className={styles.customNotice}>
        <p>
          💡 <strong>Custom Menus Available:</strong> We customize menus for North Indian, Chettinad, Brahmin, Kerala, and Continental preferences.
        </p>
      </div>
    </section>
  )
}

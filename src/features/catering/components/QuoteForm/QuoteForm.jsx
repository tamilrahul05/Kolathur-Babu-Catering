import { useState } from 'react'
import { Button } from '@/components/common'
import { CATERING_INFO } from '../../data/cateringData'
import styles from './QuoteForm.module.css'

export function QuoteForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    venue: '',
    type: 'Wedding',
    count: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const lines = [
      `Hello ${CATERING_INFO.name}, I would like a catering quote.`,
      '',
      `Name: ${formData.name.trim()}`,
      `Phone: ${formData.phone.trim()}`,
      `Event Date: ${formData.date}`,
      `Venue: ${formData.venue.trim()}`,
      `Event Type: ${formData.type}`,
      `Guest Count: ${formData.count}`,
    ]

    const message = lines.join('\n')
    const url = `https://wa.me/${CATERING_INFO.whatsapp}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <section id="quote" className={styles.section}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.badge}>INSTANT WHATSAPP QUOTE</span>
          <h2 className={styles.title}>Get Your Event Quotation</h2>
          <p className={styles.subtitle}>
            Fill in your event details below — our team will immediately respond with menu options and pricing.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="quote-name">Your Full Name</label>
              <input
                id="quote-name"
                name="name"
                type="text"
                placeholder="e.g. Ramesh Kumar"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="quote-phone">Phone Number</label>
              <input
                id="quote-phone"
                name="phone"
                type="tel"
                placeholder="e.g. 9840012345"
                required
                pattern="[0-9+ ]{10,15}"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="quote-date">Event Date</label>
              <input
                id="quote-date"
                name="date"
                type="date"
                required
                value={formData.date}
                onChange={handleChange}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="quote-venue">Event Venue / Location</label>
              <input
                id="quote-venue"
                name="venue"
                type="text"
                placeholder="e.g. GPN Palace, Thiruverkadu"
                required
                value={formData.venue}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="quote-type">Event Type</label>
              <select
                id="quote-type"
                name="type"
                required
                value={formData.type}
                onChange={handleChange}
              >
                <option value="Wedding">Wedding</option>
                <option value="Reception">Reception</option>
                <option value="Corporate Event">Corporate Event</option>
                <option value="Birthday & Parties">Birthday & Parties</option>
                <option value="Outdoor Event">Outdoor Event</option>
                <option value="Housewarming">Housewarming</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="quote-count">Expected Guest Count</label>
              <input
                id="quote-count"
                name="count"
                type="number"
                min="20"
                placeholder="e.g. 500"
                required
                value={formData.count}
                onChange={handleChange}
              />
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" className={styles.submitBtn}>
            📱 Send Quote Request on WhatsApp
          </Button>
        </form>
      </div>
    </section>
  )
}

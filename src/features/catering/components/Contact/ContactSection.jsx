import { CATERING_INFO } from '../../data/cateringData'
import instaIcon from '@/assets/images/instagram-icon.png'
import fbIcon from '@/assets/images/facebook-icon.png'

export function ContactSection() {
  return (
    <section id="contact" className="contact">
      <div className="contact-container">
        <div className="contact-header">
          <span className="contact-badge">GET IN TOUCH</span>
          <h2>Contact Us</h2>
          <p className="contact-subtitle">
            Planning a wedding, reception, corporate gathering, or family celebration? Connect with our catering specialists for customized menus, date availability, and bespoke hospitality.
          </p>
        </div>

        <div className="contact-grid">
          {/* CARD 1: DIRECT PHONE LINES & WHATSAPP */}
          <div className="contact-card">
            <div className="contact-card-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <h3 className="contact-card-title">Phone & WhatsApp</h3>
            <p className="contact-card-desc">Call our catering team directly for instant booking support:</p>

            <div className="contact-phone-list">
              {CATERING_INFO.phones.map((phone, i) => (
                <a key={i} href={`tel:${phone}`} className="contact-phone-item">
                  <span className="contact-phone-icon">📞</span>
                  <span className="contact-phone-num">{phone}</span>
                </a>
              ))}
            </div>

            <div className="contact-divider" />

            <a
              href={`https://wa.me/${CATERING_INFO.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-whatsapp-btn"
              title="Chat on WhatsApp"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.79 14.07c-.24.68-1.2 1.3-1.96 1.46-.52.11-1.19.2-3.47-.74-2.91-1.21-4.78-4.18-4.93-4.37-.14-.2-1.19-1.59-1.19-3.03 0-1.44.75-2.15 1.02-2.44.27-.29.59-.36.79-.36.2 0 .4 0 .57.01.18.01.43-.07.67.52.25.6.85 2.08.92 2.23.08.15.13.33.03.53-.1.2-.15.33-.3.5-.15.18-.31.4-.45.53-.15.15-.31.31-.13.6.18.29.78 1.28 1.66 2.07 1.14 1.02 2.11 1.34 2.41 1.49.3.15.48.13.66-.08.18-.2.75-.87.95-1.18.2-.3.4-.25.68-.15.28.1 1.76.83 2.06.98.3.15.5.23.57.35.07.13.07.72-.17 1.4z"/>
              </svg>
              <span>WhatsApp: {CATERING_INFO.whatsappDisplay}</span>
            </a>
          </div>

          {/* CARD 2: HEAD OFFICE & BRANCHES */}
          <div className="contact-card">
            <div className="contact-card-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <h3 className="contact-card-title">Head Office & Branches</h3>

            <div className="contact-address-block">
              <strong className="contact-location-label">📍 Head Office – Kolathur:</strong>
              <p className="contact-address-text">{CATERING_INFO.address}</p>
              <a
                href={CATERING_INFO.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-map-link"
              >
                View on Google Maps →
              </a>
            </div>

            <div className="contact-divider" />

            <div className="contact-branches-block">
              <strong className="contact-location-label">🏢 Branch Locations:</strong>
              <div className="contact-branch-tags">
                {CATERING_INFO.branches.map((branch, i) => (
                  <span key={i} className="contact-branch-tag">
                    {branch}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* CARD 3: EMAIL & SOCIAL CHANNELS */}
          <div className="contact-card">
            <div className="contact-card-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <h3 className="contact-card-title">Email & Social Media</h3>
            <p className="contact-card-desc">Send event queries or follow our daily catering updates:</p>

            <a href={`mailto:${CATERING_INFO.email}`} className="contact-email-link">
              <span className="contact-email-icon">✉️</span>
              <span>{CATERING_INFO.email}</span>
            </a>

            <div className="contact-divider" />

            <div className="contact-social-buttons">
              <a
                href={CATERING_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social-item instagram"
                title="Follow on Instagram"
              >
                <img src={instaIcon} alt="Instagram" className="contact-social-img" />
                <span>Instagram</span>
              </a>
              <a
                href={CATERING_INFO.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social-item facebook"
                title="Follow on Facebook"
              >
                <img src={fbIcon} alt="Facebook" className="contact-social-img" />
                <span>Facebook</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default ContactSection

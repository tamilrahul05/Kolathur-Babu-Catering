import { useState, useEffect } from 'react'
import './catering.css'
import {
  getStoredQuotations,
  saveQuotation,
} from '@/utils'

import logoImg from '@/assets/images/logo.png'
import serviceWedding from '@/assets/images/service-wedding.jpg'
import serviceReception from '@/assets/images/service-reception.jpg'
import serviceCorporate from '@/assets/images/service-corporate.jpg'
import serviceBirthday from '@/assets/images/service-birthday.jpg'
import serviceOutdoor from '@/assets/images/service-outdoor.jpg'
import serviceLiveCounters from '@/assets/images/service-live-counters.jpg'
import {
  ALL_GALLERY_IMAGES,
  GALLERY_CATEGORIES,
} from './data'
import instaIcon from '@/assets/images/instagram-icon.png'
import fbIcon from '@/assets/images/facebook-icon.png'

export function CateringApp({ onNavigateAdmin }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    venue: '',
    type: 'Wedding',
    count: '',
  })

  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [storedQuotes, setStoredQuotes] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const filteredGallery =
    selectedCategory === 'all'
      ? ALL_GALLERY_IMAGES
      : ALL_GALLERY_IMAGES.filter((item) => item.category === selectedCategory)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return
      if (e.key === 'Escape') setLightboxIndex(null)
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev + 1) % filteredGallery.length)
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev - 1 + filteredGallery.length) % filteredGallery.length)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex, filteredGallery.length])

  // Load stored quotes on mount
  useEffect(() => {
    const list = getStoredQuotations()
    if (list.length === 0) {
      // Seed initial sample quotations so user can test Excel download right away
      const initialSeed = [
        {
          id: 'quote_1',
          name: 'Rajesh Kannan',
          phone: '9840123456',
          date: '2026-11-20',
          venue: 'Ramachandra Convention Centre, Thiruvanmiyur',
          type: 'Wedding',
          count: 650,
          submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
        {
          id: 'quote_2',
          name: 'Meena Sundaram',
          phone: '9884567890',
          date: '2026-12-05',
          venue: 'GPN Palace, Thiruverkadu',
          type: 'Reception',
          count: 450,
          submittedAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 'quote_3',
          name: 'Venkatesh Babu',
          phone: '9790112233',
          date: '2026-10-28',
          venue: 'RK Convention Centre, ECR',
          type: 'Corporate',
          count: 300,
          submittedAt: new Date().toISOString(),
        },
      ]
      localStorage.setItem('kolathur_babu_quotations', JSON.stringify(initialSeed))
      setStoredQuotes(initialSeed)
    } else {
      setStoredQuotes(list)
    }
  }, [])

  const handleInputChange = (e) => {
    const { id, value } = e.target
    const keyMap = {
      q_name: 'name',
      q_phone: 'phone',
      q_date: 'date',
      q_venue: 'venue',
      q_type: 'type',
      q_count: 'count',
    }
    const key = keyMap[id] || id
    setFormData((prev) => ({ ...prev, [key]: value }))

    // Real-time validation for count
    if (key === 'count') {
      setFormError('')
    }
  }

  const sendQuoteToWhatsApp = (e) => {
    e.preventDefault()

    const guestCount = Number(formData.count)
    if (!guestCount || guestCount < 1) {
      setFormError('Please enter a valid guest count.')
      return
    }

    setFormError('')

    // 1. Store in records for Excel format
    const updated = saveQuotation({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      date: formData.date,
      venue: formData.venue.trim(),
      type: formData.type,
      count: guestCount,
    })
    setStoredQuotes(updated)
    setFormSuccess('✅ Quotation inquiry submitted! Opening WhatsApp...')

    // 2. Prepare message and open WhatsApp
    const lines = [
      'Hello Kolathur Babu Catering, I would like a catering quote.',
      '',
      `Name: ${formData.name.trim()}`,
      `Phone: ${formData.phone.trim()}`,
      `Event Date: ${formData.date}`,
      `Venue: ${formData.venue.trim()}`,
      `Event Type: ${formData.type}`,
      `Guest Count: ${guestCount}`,
    ]
    const msg = lines.join('\n')
    const url = `https://wa.me/919884995445?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank')
  }

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="catering-root">
      {/* HEADER / NAVIGATION */}
      <header>
        <nav>
          <a className="logo" href="#" aria-label="Kolathur Babu Catering - High Class Caterers">
            <img src={logoImg} alt="Kolathur Babu Catering - High Class Caterers" />
          </a>
          <div className="links">
            <a
              href="#services"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection('services')
              }}
            >
              Services
            </a>
            <a
              href="#gallery"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection('gallery')
              }}
            >
              Gallery
            </a>
            <a
              href="#blog"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection('blog')
              }}
            >
              Blog
            </a>
            <a
              href="#venues"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection('venues')
              }}
            >
              Venues
            </a>
            <a
              href="#quote"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection('quote')
              }}
            >
              Get Quote
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection('contact')
              }}
            >
              Contact
            </a>
          </div>
          <a
            className="btn green"
            href="https://wa.me/919884995445"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="hero">
        <div>
          <div>20+ YEARS OF TASTE, TRUST & TRADITION</div>
          <h1>
            Premium Catering for<br />
            <span>Every Grand Celebration</span>
          </h1>
          <p>
            Chennai's premium catering experience — traditional taste, premium service and memorable events.
          </p>
          <div className="actions">
            <a className="btn green" href="tel:9944769090">
              CALL NOW
            </a>
            <a
              className="btn outline"
              href="#quote"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection('quote')
              }}
            >
              GET A QUOTE
            </a>
            <a
              className="btn outline"
              href="#reviews"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection('reviews')
              }}
              style={{ borderColor: '#ffb400', color: '#ffb400' }}
            >
              ⭐ REVIEWS
            </a>
          </div>
        </div>
      </section>

      {/* OUR SERVICES */}
      <section id="services">
        <h2>Our Services</h2>
        <div className="grid">
          <article className="card">
            <img src={serviceWedding} alt="Wedding Catering" />
            <div>
              <h3>Wedding Catering</h3>
              <p>Grand weddings and receptions with elegant food service.</p>
            </div>
          </article>

          <article className="card">
            <img src={serviceReception} alt="Reception & Engagement" />
            <div>
              <h3>Reception & Engagement</h3>
              <p>Memorable celebrations with delicious food and professional service.</p>
            </div>
          </article>

          <article className="card">
            <img src={serviceCorporate} alt="Corporate Catering" />
            <div>
              <h3>Corporate Catering</h3>
              <p>Reliable catering for meetings, conferences and corporate events.</p>
            </div>
          </article>

          <article className="card">
            <img src={serviceBirthday} alt="Birthday & Parties" />
            <div>
              <h3>Birthday & Parties</h3>
              <p>Beautiful food experiences for private celebrations.</p>
            </div>
          </article>

          <article className="card">
            <img src={serviceOutdoor} alt="Outdoor Catering" />
            <div>
              <h3>Outdoor Catering</h3>
              <p>Fresh, well-managed catering for outdoor events and family functions.</p>
            </div>
          </article>

          <article className="card">
            <img src={serviceLiveCounters} alt="Live Food Counters" />
            <div>
              <h3>Live Food Counters</h3>
              <p>Interactive live counters prepared fresh at your event.</p>
            </div>
          </article>
        </div>
      </section>

      {/* STATS */}
      <div className="stats">
        <div>
          <b>20+</b>Years Experience
        </div>
        <div>
          <b>5000+</b>Events Served
        </div>
        <div>
          <b>100+</b>Expert Chefs
        </div>
        <div>
          <b>100%</b>Quality Focus
        </div>
      </div>

      {/* REAL EVENT GALLERY */}
      <section id="gallery" className="gallery-section-wrapper">
        <h2
          style={{
            background: '#fff',
            color: '#0aa84f',
            display: 'inline-block',
            padding: '10px 28px',
            borderRadius: '12px',
          }}
        >
          Our Real Event Gallery
        </h2>
        <p className="sub">
          Authentic live photos from Kolathur Babu Catering's grand wedding buffets, live food counters, and royal dining setups across Chennai.
        </p>

        {/* CATEGORY FILTER BUTTONS */}
        <div className="gallery-filters">
          {GALLERY_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`gallery-filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* GALLERY GRID */}
        <div className="gallery-grid">
          {filteredGallery.map((item, idx) => (
            <div
              key={item.id}
              className="gallery-item"
              onClick={() => setLightboxIndex(idx)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setLightboxIndex(idx)
                }
              }}
            >
              <img src={item.src} alt={item.title} loading="lazy" />
              <span className="gallery-item-tag">{item.tag}</span>
              <div className="gallery-item-overlay">
                <div className="gallery-item-title">{item.title}</div>
                <div className="gallery-view-hint">🔍 View</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews">
        <h2
          style={{
            background: '#fff',
            color: '#0aa84f',
            display: 'inline-block',
            padding: '8px 24px',
            borderRadius: '12px',
            fontSize: '1.4rem',
            fontWeight: 700,
          }}
        >
          Reviews
        </h2>
        <p className="sub">Rated 4.9 / 5 by 1900+ happy customers across Chennai.</p>
        <div className="review-grid">
          <div className="review-card">
            <div className="review-head">
              <div className="review-avatar">D</div>
              <div>
                <div className="review-name">Dilli Babu1</div>
                <div className="review-stars">
                  ★★★★★ <span className="review-time">a month ago</span>
                </div>
              </div>
            </div>
            <p className="review-text">
              Excellent catering service! The food was delicious, fresh, and served hot. Every guest appreciated the taste and quality. The staff were professional, punctual, and handled everything smoothly. The menu had great variety, and the overall service exceeded our expectations. Highly recommended for weddings, family functions, and all special occasions. Thank you, Babu Catering, for making our event memorable! 😊
            </p>
          </div>

          <div className="review-card">
            <div className="review-head">
              <div className="review-avatar">G</div>
              <div>
                <div className="review-name">Gnanamozhi G</div>
                <div className="review-stars">
                  ★★★★★ <span className="review-time">a year ago</span>
                </div>
              </div>
            </div>
            <p className="review-text">
              I recently had the pleasure of hiring Babu Catering for a special event, and I couldn't be more impressed with their exceptional service. The food quality was outstanding, with a diverse menu that catered to all dietary preferences. The staff was courteous, efficient, and went above and beyond to accommodate our guests. I highly recommend Babu Catering for any event, whether it's a wedding, corporate gathering, or private party.
            </p>
          </div>

          <div className="review-card">
            <div className="review-head">
              <div className="review-avatar">J</div>
              <div>
                <div className="review-name">Jeevan Jeeva</div>
                <div className="review-stars">
                  ★★★★★ <span className="review-time">a month ago</span>
                </div>
              </div>
            </div>
            <p className="review-text">
              Babu Catering provided excellent food and service for our event. The food was delicious, fresh, and well-prepared. The staff were professional, friendly, and punctual. Everything was organized perfectly, making the event stress-free. Highly recommended for anyone looking for quality catering services.
            </p>
          </div>

          <div className="review-card">
            <div className="review-head">
              <div className="review-avatar">J</div>
              <div>
                <div className="review-name">Jeyaraman Jeyaraman</div>
                <div className="review-stars">
                  ★★★★☆ <span className="review-time">2 months ago</span>
                </div>
              </div>
            </div>
            <p className="review-text">
              Excellent catering service! The food taste was really amazing and the service was neat and professional. Everyone at the function enjoyed the food. Highly recommended!
            </p>
          </div>

          <div className="review-card">
            <div className="review-head">
              <div className="review-avatar">T</div>
              <div>
                <div className="review-name">Thamizharasan</div>
                <div className="review-stars">
                  ★★★★★ <span className="review-time">11 months ago</span>
                </div>
              </div>
            </div>
            <p className="review-text">
              Babu Catering exceeded all our expectations! The variety of dishes, taste, and presentation were simply outstanding. Guests kept complimenting the food throughout the event. Their staff was very friendly, well-organized, and ensured everything went smoothly. Truly a perfect combination of quality and service — I would definitely choose them again for future functions!
            </p>
          </div>

          <div className="review-card">
            <div className="review-head">
              <div className="review-avatar">P</div>
              <div>
                <div className="review-name">Purushothaman 1636</div>
                <div className="review-stars">
                  ★★★★★ <span className="review-time">10 months ago</span>
                </div>
              </div>
            </div>
            <p className="review-text">
              I am very delightful with this catering, in his menu I like veg prawns, parotta rasmalai, and halwa, and service had great and overall I am well satisfied with this performance in the event.
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '28px' }}>
          <a
            className="btn green btn-google-reviews"
            href="https://www.google.com/maps/search/?api=1&query=Babu+Catering+Kolathur+Chennai"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault()
              window.open(
                'https://www.google.com/maps/search/?api=1&query=Babu+Catering+Kolathur+Chennai',
                '_blank',
                'noopener,noreferrer'
              )
            }}
            title="Read customer reviews for Babu Catering on Google Maps"
          >
            ⭐ READ MORE REVIEWS ON GOOGLE
          </a>
        </div>
      </section>

      {/* BLOG & UPDATES */}
      <section id="blog">
        <h2
          style={{
            background: '#fff',
            color: '#0aa84f',
            display: 'inline-block',
            padding: '8px 24px',
            borderRadius: '12px',
            fontSize: '1.4rem',
            fontWeight: 700,
          }}
        >
          Blog &amp; Updates
        </h2>
        <p className="sub">Tips, stories and news from our kitchen.</p>
        <div className="menu-folders">
          <details className="menu-folder">
            <summary>
              5 Tips for Choosing the Right Wedding Caterer<span>READ MORE +</span>
            </summary>
            <div className="menu-content">
              <p style={{ color: '#999', fontSize: '0.82rem', margin: '0 0 12px' }}>July 2026</p>
              <p style={{ color: '#444', fontSize: '0.92rem', lineHeight: '1.7' }}>
                Choosing a caterer is one of the biggest decisions for any wedding. Here's what we tell every family who calls us:
                <br /><br />
                <b>1. Taste before you trust.</b> Always ask for a tasting session before confirming — a good caterer will never hesitate.
                <br />
                <b>2. Check their live counter experience.</b> Live dosa, chaat and dessert counters need skilled staff, not just equipment.
                <br />
                <b>3. Ask about guest count flexibility.</b> Last-minute changes happen — make sure your caterer can handle it smoothly.
                <br />
                <b>4. Hygiene matters more than decoration.</b> Visit their kitchen or ask for photos of their food prep process.
                <br />
                <b>5. Read real reviews, not just ratings.</b> A detailed review tells you more than a star rating ever will.
              </p>
            </div>
          </details>

          <details className="menu-folder">
            <summary>
              Behind the Scenes: Our Recent Event at RK Mahal<span>READ MORE +</span>
            </summary>
            <div className="menu-content">
              <p style={{ color: '#999', fontSize: '0.82rem', margin: '0 0 12px' }}>June 2026</p>
              <p style={{ color: '#444', fontSize: '0.92rem', lineHeight: '1.7' }}>
                We recently catered a grand wedding reception at RK Mahal, Chennai, serving over 1,200 guests across a full banana-leaf traditional menu along with live counters. Our team arrived 6 hours early to set up the buffet, live dosa and chaat stations, and dessert counters — all while keeping the kitchen running fresh, hot food throughout the event.
                <br /><br />
                Highlights from the night included our signature Hyderabadi Dum Biryani, a 4-flavour halwa counter, and a South Indian tiffin corner that guests kept coming back to. Moments like these are why we love what we do.
              </p>
            </div>
          </details>

          <details className="menu-folder">
            <summary>
              Why Banana Leaf Meals Are Still the Heart of Tamil Weddings<span>READ MORE +</span>
            </summary>
            <div className="menu-content">
              <p style={{ color: '#999', fontSize: '0.82rem', margin: '0 0 12px' }}>May 2026</p>
              <p style={{ color: '#444', fontSize: '0.92rem', lineHeight: '1.7' }}>
                In a world of buffets and fusion menus, the traditional banana leaf meal continues to hold a special place at Tamil weddings. It's more than a serving style — it's a symbol of hospitality, simplicity and togetherness.
                <br /><br />
                At Kolathur Babu Catering, we make sure every leaf is served in the right order — starters, sambar, rasam, curd, and payasam — the way elders have done for generations. Modern live counters are a wonderful addition, but the banana leaf remains our menu's heart.
              </p>
            </div>
          </details>
        </div>
      </section>

      {/* VENUES WE REGULARLY CATER AT */}
      <section id="venues">
        <h2
          style={{
            background: '#fff',
            color: '#0aa84f',
            display: 'inline-block',
            padding: '8px 24px',
            borderRadius: '12px',
            fontSize: '1.4rem',
            fontWeight: 700,
            letterSpacing: '0.3px',
          }}
        >
          Venues We Regularly Cater At
        </h2>
        <p className="sub">Trusted by leading convention centres and palaces across Chennai.</p>
        <div className="venue-list">
          <div className="venue-item">
            <h4>1. Ramachandra Convention Centre</h4>
            <p>24/13A, South Avenue Road, Vasudeva Nagar, Thiruvanmiyur, Chennai, Tamil Nadu 600041</p>
          </div>
          <div className="venue-item">
            <h4>2. RK Convention Centre</h4>
            <p>4/111, East Coast Road, Neelankarai, Chennai, Tamil Nadu 600115</p>
          </div>
          <div className="venue-item">
            <h4>3. GPN Palace</h4>
            <p>69, Perumalagaram Salai, Perumalagaram, Thiruverkadu, Chennai, Tamil Nadu 600077</p>
          </div>
          <div className="venue-item">
            <h4>4. Srivaru Venkatachalapathy Palace</h4>
            <p>No. 103, LBR Garden, Vanagaram-Ayanambakkam Road, Off Poonamallee High Road, Rajankuppam, Maduravoyal, Chennai, Tamil Nadu 600095</p>
          </div>
          <div className="venue-item">
            <h4>5. Kaldan Samudhra Palace</h4>
            <p>East Coast Road, Devaneri, Mahabalipuram, Chennai, Tamil Nadu 603104</p>
          </div>
          <div className="venue-item">
            <h4>6. Mayor Ramanathan Chettiar Centre</h4>
            <p>75/2, Santhome High Road, Mandavelipakkam, Raja Annamalai Puram, Chennai, Tamil Nadu 600028</p>
          </div>
        </div>
      </section>

      {/* GET A QUOTATION */}
      <section id="quote">
        <h2 style={{ color: '#d21f1f' }}>Get a Quotation</h2>
        <p className="sub">
          Fill in your event details below — all quotations are stored in Excel format and sent to our WhatsApp.
        </p>

        <form id="quoteForm" onSubmit={sendQuoteToWhatsApp} className="quote-form">
          {formSuccess && <div className="quote-alert-success">{formSuccess}</div>}
          {formError && <div className="quote-alert-error">{formError}</div>}

          <input
            type="text"
            id="q_name"
            placeholder="Name"
            required
            value={formData.name}
            onChange={handleInputChange}
          />
          <input
            type="tel"
            id="q_phone"
            placeholder="Phone Number"
            required
            pattern="[0-9+ ]{10,15}"
            value={formData.phone}
            onChange={handleInputChange}
          />
          <div className="date-field">
            <span>Event Date</span>
            <input
              type="date"
              id="q_date"
              required
              value={formData.date}
              onChange={handleInputChange}
            />
          </div>
          <input
            type="text"
            id="q_venue"
            placeholder="Event Venue"
            required
            value={formData.venue}
            onChange={handleInputChange}
          />
          <select
            id="q_type"
            required
            value={formData.type}
            onChange={handleInputChange}
          >
            <option value="" disabled>Event Type</option>
            <option value="Wedding">Wedding</option>
            <option value="Reception">Reception</option>
            <option value="Corporate">Corporate</option>
            <option value="Birthday & Parties">Birthday & Parties</option>
            <option value="Outdoor Event">Outdoor Event</option>
            <option value="Other">Other</option>
          </select>

          {/* GUEST COUNT */}
          <input
            type="number"
            id="q_count"
            placeholder="Guest Count"
            required
            min="1"
            value={formData.count}
            onChange={handleInputChange}
          />

          <button type="submit" className="btn quote-submit">
            SUBMIT ON WHATSAPP & SAVE QUOTE
          </button>
        </form>
      </section>

      {/* UNIFIED LUXURY BRAND FOOTER (DARK WATERMARK THEME WITH COMPLETE CONTACT DETAILS) */}
      <footer className="site-footer" id="contact">
        <div className="footer-container">
          {/* COLUMN 1: BRAND, DESCRIPTION & DIRECT CONTACT */}
          <div className="footer-col footer-col-brand">
            <div className="footer-brand-header">
              <div className="footer-logo-box">
                <img src={logoImg} alt="BABU Catering Logo" />
              </div>
              <div className="footer-brand-names">
                <h3 className="footer-brand-title">BABU Catering</h3>
                <span className="footer-brand-sub">LUXURY EVENTS</span>
              </div>
            </div>
            <p className="footer-desc">
              Making weddings, corporate events, birthdays and family celebrations memorable with
              premium catering and elegant service since 2010.
            </p>

            <div className="footer-contact-details">
              <div className="footer-contact-item">
                <span className="footer-contact-icon">📞</span>
                <span className="footer-contact-phones">
                  <a href="tel:9944769090">9944769090</a> ·{' '}
                  <a href="tel:9976379073">9976379073</a> ·{' '}
                  <a href="tel:9944775538">9944775538</a>
                </span>
              </div>
              <div className="footer-contact-item">
                <span className="footer-contact-icon">✉️</span>
                <a href="mailto:babucatering99@gmail.com" className="footer-contact-email">
                  babucatering99@gmail.com
                </a>
              </div>
            </div>

            <div className="footer-socials">
              <a
                href="https://wa.me/919884995445"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="WhatsApp"
                title="WhatsApp: +91 98849 95445"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.79 14.07c-.24.68-1.2 1.3-1.96 1.46-.52.11-1.19.2-3.47-.74-2.91-1.21-4.78-4.18-4.93-4.37-.14-.2-1.19-1.59-1.19-3.03 0-1.44.75-2.15 1.02-2.44.27-.29.59-.36.79-.36.2 0 .4 0 .57.01.18.01.43-.07.67.52.25.6.85 2.08.92 2.23.08.15.13.33.03.53-.1.2-.15.33-.3.5-.15.18-.31.4-.45.53-.15.15-.31.31-.13.6.18.29.78 1.28 1.66 2.07 1.14 1.02 2.11 1.34 2.41 1.49.3.15.48.13.66-.08.18-.2.75-.87.95-1.18.2-.3.4-.25.68-.15.28.1 1.76.83 2.06.98.3.15.5.23.57.35.07.13.07.72-.17 1.4z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/babucatering?igsh=dTE5aXZqY3RuOWNx&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="Instagram"
                title="Follow on Instagram"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.79-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/share/1GFw2CyD6k/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="Facebook"
                title="Follow on Facebook"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="YouTube"
                title="Watch on YouTube"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* COLUMN 2: OUR SERVICES */}
          <div className="footer-col">
            <h4 className="footer-col-title">Our Services</h4>
            <div className="footer-title-divider" />
            <ul className="footer-links-list">
              <li>
                <a href="#services" className="footer-link active-highlight">
                  → Wedding Catering
                </a>
              </li>
              <li>
                <a href="#services" className="footer-link">
                  Reception & Engagement
                </a>
              </li>
              <li>
                <a href="#services" className="footer-link">
                  Corporate Catering
                </a>
              </li>
              <li>
                <a href="#services" className="footer-link">
                  Birthday and Family Celebrations
                </a>
              </li>
              <li>
                <a href="#services" className="footer-link">
                  Live Counters and Food Stalls
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: QUICK LINKS & BRANCHES */}
          <div className="footer-col">
            <h4 className="footer-col-title">Quick Links</h4>
            <div className="footer-title-divider" />
            <ul className="footer-links-list">
              <li>
                <a href="#" className="footer-link">
                  Home
                </a>
              </li>
              <li>
                <a href="#services" className="footer-link">
                  Services
                </a>
              </li>
              <li>
                <a href="#menu" className="footer-link">
                  Our Menu
                </a>
              </li>
              <li>
                <a href="#gallery" className="footer-link">
                  Gallery
                </a>
              </li>
              <li>
                <a href="#book" className="footer-link">
                  Pre-Booking
                </a>
              </li>
            </ul>

            <div className="footer-branches-block">
              <span className="footer-branches-label">🏢 Branch Offices:</span>
              <div className="footer-branch-tags">
                <span className="footer-branch-tag">Tambaram</span>
                <span className="footer-branch-tag">Valasaravakkam</span>
              </div>
            </div>
          </div>

          {/* COLUMN 4: VISIT US & HEAD OFFICE */}
          <div className="footer-col footer-col-visit">
            <h4 className="footer-col-title">Visit Us</h4>
            <div className="footer-title-divider" />

            <div className="footer-address-box">
              <span className="footer-address-icon">📍</span>
              <p className="footer-address-text">
                <strong>Head Office – Kolathur:</strong>
                <br />
                No.155, Sakthi Vinayagar Koil Street, Sakthivel Nagar, Kolathur, Chennai – 600082
              </p>
            </div>

            <div className="footer-map-card">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Babu+Catering+Kolathur+Chennai"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-map-open-btn"
                onClick={(e) => {
                  e.preventDefault()
                  window.open(
                    'https://www.google.com/maps/search/?api=1&query=Babu+Catering+Kolathur+Chennai',
                    '_blank',
                    'noopener,noreferrer'
                  )
                }}
              >
                Open in Maps
                <svg
                  viewBox="0 0 24 24"
                  width="12"
                  height="12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
              <iframe
                src="https://maps.google.com/maps?q=Babu+Catering,+Sakthivel+Nagar,+Kolathur,+Chennai+600082&t=&z=15&ie=UTF8&iwloc=&output=embed"
                title="Babu Catering Kolathur Chennai Map Location"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT BAR */}
        <div className="footer-bottom">
          <p>© 2026 BABU Catering · High Class Caterers. All Rights Reserved.</p>
          <a
            href="/admin"
            className="footer-staff-link"
            onClick={(e) => {
              e.preventDefault()
              if (onNavigateAdmin) {
                onNavigateAdmin()
              } else {
                window.history.pushState({}, '', '/admin')
                window.dispatchEvent(new PopStateEvent('popstate'))
              }
            }}
            title="Administrative Management"
          >
            Staff Portal
          </a>
        </div>
      </footer>

      {/* LIGHTBOX MODAL */}
      {lightboxIndex !== null && filteredGallery[lightboxIndex] && (
        <div className="lightbox-backdrop" onClick={() => setLightboxIndex(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="lightbox-close-btn"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close image preview"
            >
              ✕
            </button>

            <button
              type="button"
              className="lightbox-nav-btn prev"
              onClick={(e) => {
                e.stopPropagation()
                setLightboxIndex(
                  (prev) => (prev - 1 + filteredGallery.length) % filteredGallery.length
                )
              }}
              aria-label="Previous image"
            >
              ‹
            </button>

            <img
              src={filteredGallery[lightboxIndex].src}
              alt={filteredGallery[lightboxIndex].title}
              className="lightbox-img"
            />

            <button
              type="button"
              className="lightbox-nav-btn next"
              onClick={(e) => {
                e.stopPropagation()
                setLightboxIndex((prev) => (prev + 1) % filteredGallery.length)
              }}
              aria-label="Next image"
            >
              ›
            </button>

            <div className="lightbox-caption">
              <h4>{filteredGallery[lightboxIndex].title}</h4>
              <span>
                {filteredGallery[lightboxIndex].tag} · {lightboxIndex + 1} of{' '}
                {filteredGallery.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING WHATSAPP BUTTON */}
      <a
        className="float"
        href="https://wa.me/919884995445"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          className="whatsapp-icon"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"
          />
        </svg>
      </a>
    </div>
  )
}
export default CateringApp

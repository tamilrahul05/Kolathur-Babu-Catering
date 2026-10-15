import { useState, useEffect } from 'react'
import './AdminPage.css'
import logoImg from '@/assets/images/logo.png'
import {
  exportQuotationsToExcel,
  getStoredQuotations,
  deleteQuotation,
  clearAllQuotations,
  loginAdmin,
  isAdminAuthenticated,
  verifyAdminSession,
  clearAdminSession,
} from '@/utils'

export function AdminPage({ onNavigateHome }) {
  const [isAdmin, setIsAdmin] = useState(isAdminAuthenticated())
  const [adminId, setAdminId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [storedQuotes, setStoredQuotes] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusMsg, setStatusMsg] = useState('')

  // Verify active session with backend on load
  useEffect(() => {
    async function verifyAuth() {
      if (isAdminAuthenticated()) {
        const isValid = await verifyAdminSession()
        if (isValid) {
          setIsAdmin(true)
          setStoredQuotes(getStoredQuotations())
        } else {
          setIsAdmin(false)
        }
      } else {
        setIsAdmin(false)
      }
    }
    verifyAuth()
  }, [])

  // Handle Login submission
  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await loginAdmin(adminId, password)
    setLoading(false)

    if (result.success) {
      setIsAdmin(true)
      setAdminId('')
      setPassword('')
      setStoredQuotes(getStoredQuotations())
      setStatusMsg('Logged in successfully!')
      setTimeout(() => setStatusMsg(''), 3000)
    } else {
      setError('Invalid ID or Password')
    }
  }

  // Handle Logout
  const handleLogout = async () => {
    await clearAdminSession()
    setIsAdmin(false)
    setAdminId('')
    setPassword('')
    setStoredQuotes([])
    setError('')
    setStatusMsg('')
  }

  // Handle Excel download
  const handleExportExcel = () => {
    if (storedQuotes.length === 0) {
      alert('No quotations available to export.')
      return
    }
    exportQuotationsToExcel(storedQuotes, 'Kolathur_Babu_Quotations')
  }

  // Delete individual quote
  const handleDelete = (id) => {
    if (window.confirm('Delete this quotation inquiry?')) {
      const updated = deleteQuotation(id)
      setStoredQuotes(updated)
      setStatusMsg('Record deleted successfully.')
      setTimeout(() => setStatusMsg(''), 2500)
    }
  }

  // Clear all quotes
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to permanently delete all quotation records?')) {
      clearAllQuotations()
      setStoredQuotes([])
      setStatusMsg('All quotation records cleared.')
      setTimeout(() => setStatusMsg(''), 2500)
    }
  }

  // Filtered quotes based on search query
  const filtered = storedQuotes.filter((q) => {
    if (!searchQuery) return true
    const term = searchQuery.toLowerCase()
    return (
      (q.name && q.name.toLowerCase().includes(term)) ||
      (q.phone && q.phone.includes(term)) ||
      (q.venue && q.venue.toLowerCase().includes(term)) ||
      (q.type && q.type.toLowerCase().includes(term))
    )
  })

  const totalGuests = storedQuotes.reduce((acc, q) => acc + (Number(q.count) || 0), 0)

  // ========================================================
  // 1. UNPROTECTED / LOGIN VIEW (Display ONLY the login page)
  // ========================================================
  if (!isAdmin) {
    return (
      <div className="admin-page-root admin-login-page-root">
        <div className="admin-login-wrapper">
          <div className="admin-login-brand">
            <div className="admin-login-logo">
              <img src={logoImg} alt="BABU Catering Logo" />
            </div>
            <h1 className="admin-login-title">BABU CATERING – ADMIN LOGIN</h1>
            <p className="admin-login-desc">
              Enter your administrative credentials to access the quotation management portal.
            </p>
          </div>

          {error && (
            <div className="admin-error-banner" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="admin-form-box" noValidate>
            {/* ID FIELD */}
            <div className="admin-field">
              <label htmlFor="admin_id">ID</label>
              <input
                id="admin_id"
                type="text"
                placeholder="Enter ID"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                required
                autoFocus
                autoComplete="username"
              />
            </div>

            {/* PASSWORD FIELD WITH SHOW/HIDE TOGGLE */}
            <div className="admin-field">
              <label htmlFor="admin_password">Password</label>
              <div className="admin-password-wrapper">
                <input
                  id="admin_password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="btn-toggle-password"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="btn-submit-login"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* RETURN TO WEBSITE LINK */}
          <div className="admin-login-footer">
            <button
              type="button"
              className="btn-back-website-link"
              onClick={onNavigateHome}
            >
              ← Back to Website
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ========================================================
  // 2. PROTECTED ADMIN DASHBOARD (Only visible when logged in)
  // ========================================================
  return (
    <div className="admin-page-root">
      {/* NAVBAR */}
      <header className="admin-page-navbar">
        <div className="admin-nav-brand">
          <h1>KOLATHUR BABU CATERING</h1>
          <span>Admin Quotation Management Portal</span>
        </div>
        <div className="admin-nav-actions">
          <span className="admin-status-pill active">🟢 Logged In as Admin</span>
          <button
            type="button"
            className="btn-back-website"
            onClick={onNavigateHome}
          >
            ← Public Website
          </button>
          <button
            type="button"
            className="btn-nav-logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="admin-page-main">
        <div className="admin-dashboard-container">
          <div className="admin-dash-header">
            <div>
              <h2>Quotation Inquiries &amp; Excel Export</h2>
              <p>Manage customer catering inquiries and download reports in Excel (.xlsx) format.</p>
            </div>
            {statusMsg && (
              <div style={{ color: '#059669', fontWeight: 700, fontSize: '14px' }}>
                {statusMsg}
              </div>
            )}
          </div>

          {/* STATS */}
          <div className="admin-stats-row">
            <div className="stat-box">
              <span className="stat-box-label">Total Inquiries</span>
              <span className="stat-box-val">{storedQuotes.length}</span>
            </div>
            <div className="stat-box">
              <span className="stat-box-label">Total Guests</span>
              <span className="stat-box-val">{totalGuests.toLocaleString()}</span>
            </div>
            <div className="stat-box">
              <span className="stat-box-label">Guest Count Rule</span>
              <span className="stat-box-val highlight">Flexible</span>
            </div>
            <div className="stat-box">
              <span className="stat-box-label">Database Status</span>
              <span className="stat-box-val green">Active</span>
            </div>
          </div>

          {/* TOOLBAR */}
          <div className="admin-dash-toolbar">
            <div className="admin-dash-toolbar-left">
              <button
                type="button"
                className="btn-main-excel-download"
                onClick={handleExportExcel}
                id="download-excel-btn"
              >
                📥 Download Quotations (Excel .xlsx)
              </button>
              <span className="excel-tag">File type: Microsoft Excel (.xlsx)</span>
            </div>

            <div>
              <input
                type="text"
                className="dash-search-input"
                placeholder="🔍 Search name, phone, venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* TABLE */}
          <div className="admin-table-card">
            <div className="admin-table-scroll">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Customer Name</th>
                    <th>Phone</th>
                    <th>Event Date</th>
                    <th>Venue</th>
                    <th>Event Type</th>
                    <th>Guests</th>
                    <th>Submitted On</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="9" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                        No quotation records found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((q, idx) => (
                      <tr key={q.id || idx}>
                        <td>{idx + 1}</td>
                        <td className="cell-name">
                          <strong>{q.name}</strong>
                        </td>
                        <td className="cell-phone">
                          <a href={`tel:${q.phone}`}>{q.phone}</a>
                        </td>
                        <td>{q.date}</td>
                        <td className="cell-venue" title={q.venue}>
                          {q.venue}
                        </td>
                        <td>
                          <span className="badge-tag-type">{q.type}</span>
                        </td>
                        <td>
                          <span className="badge-guest-pill">{q.count}</span>
                        </td>
                        <td className="cell-time">
                          {q.submittedAt ? new Date(q.submittedAt).toLocaleDateString() : 'Recent'}
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn-trash-row"
                            title="Delete record"
                            onClick={() => handleDelete(q.id)}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="table-footer-bar">
              <button
                type="button"
                className="btn-danger-clear"
                onClick={handleClearAll}
              >
                Clear All Records
              </button>

              <button
                type="button"
                className="btn-logout-admin"
                onClick={handleLogout}
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminPage

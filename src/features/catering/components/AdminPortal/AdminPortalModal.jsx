import { useState } from 'react'
import {
  exportQuotationsToExcel,
  clearAllQuotations,
  deleteQuotation,
  verifyAdminCredentials,
  setAdminSession,
  clearAdminSession,
} from '@/utils'

export function AdminPortalModal({
  isOpen,
  onClose,
  isAdmin,
  setIsAdmin,
  storedQuotes,
  setStoredQuotes,
}) {
  const [loginId, setLoginId] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [notification, setNotification] = useState('')

  if (!isOpen) return null

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')

    const isValid = await verifyAdminCredentials(loginId, loginPassword)
    if (isValid) {
      setAdminSession(true)
      setIsAdmin(true)
      setLoginId('')
      setLoginPassword('')
      setNotification('✅ Welcome, Admin! Access granted.')
      setTimeout(() => setNotification(''), 3000)
    } else {
      setLoginError('Invalid ID or Password')
    }
  }

  const handleLogout = () => {
    clearAdminSession()
    setIsAdmin(false)
    setNotification('')
  }

  const handleDownloadExcel = () => {
    if (storedQuotes.length === 0) {
      alert('No quotations available to export.')
      return
    }
    exportQuotationsToExcel(storedQuotes, 'Kolathur_Babu_Quotations')
  }

  const handleDeleteItem = (id) => {
    if (window.confirm('Delete this quotation record?')) {
      const updated = deleteQuotation(id)
      setStoredQuotes(updated)
      setNotification('Record deleted successfully.')
      setTimeout(() => setNotification(''), 2500)
    }
  }

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete ALL quotation records?')) {
      clearAllQuotations()
      setStoredQuotes([])
      setNotification('All records cleared.')
      setTimeout(() => setNotification(''), 2500)
    }
  }

  const filteredQuotes = storedQuotes.filter((q) => {
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

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div
        className="admin-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* MODAL HEADER */}
        <div className="admin-modal-header">
          <div className="admin-modal-title-group">
            <h3>
              {isAdmin ? '👑 Admin Quotation Dashboard' : '🔐 Admin Portal Login'}
            </h3>
            <span className="admin-brand-sub">Kolathur Babu Catering</span>
          </div>
          <button
            type="button"
            className="admin-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* NOTIFICATION BANNER */}
        {notification && <div className="admin-notification">{notification}</div>}

        {/* CONTENT */}
        {!isAdmin ? (
          /* LOGIN VIEW */
          <div className="admin-login-view">
            <div className="admin-login-notice">
              <p>
                Excel quotation export and confidential inquiries are protected. Please sign in with your administrator credentials.
              </p>
            </div>

            {loginError && <div className="admin-error-box">{loginError}</div>}

            <form onSubmit={handleLogin} className="admin-login-form">
              <div className="admin-form-group">
                <label htmlFor="admin_id">ID</label>
                <input
                  id="admin_id"
                  type="text"
                  placeholder="Enter ID"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="admin_pass">Password</label>
                <input
                  id="admin_pass"
                  type="password"
                  placeholder="Enter Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-admin-submit">
                Login
              </button>
            </form>
          </div>
        ) : (
          /* ADMIN DASHBOARD VIEW */
          <div className="admin-dashboard-view">
            {/* STATS STRIP */}
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <span className="stat-label">Total Quotations</span>
                <span className="stat-value">{storedQuotes.length}</span>
              </div>
              <div className="admin-stat-card">
                <span className="stat-label">Total Guests</span>
                <span className="stat-value">{totalGuests.toLocaleString()}</span>
              </div>
              <div className="admin-stat-card">
                <span className="stat-label">Guest Limit Rule</span>
                <span className="stat-value highlight">Flexible</span>
              </div>
              <div className="admin-stat-card">
                <span className="stat-label">Storage Status</span>
                <span className="stat-value green-text">Persistent</span>
              </div>
            </div>

            {/* ACTION TOOLBAR */}
            <div className="admin-toolbar">
              <div className="admin-toolbar-left">
                <button
                  type="button"
                  className="btn-download-excel-primary"
                  onClick={handleDownloadExcel}
                  id="admin-excel-download-btn"
                >
                  📥 Download Quotations (Excel .xlsx)
                </button>
                <span className="admin-file-tag">Format: Microsoft Excel (.xlsx)</span>
              </div>

              <div className="admin-toolbar-right">
                <input
                  type="text"
                  className="admin-search-input"
                  placeholder="🔍 Search inquiries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* TABLE OF QUOTATIONS */}
            <div className="admin-table-wrapper">
              {filteredQuotes.length === 0 ? (
                <div className="admin-empty-state">
                  <p>No quotation records found matching your search.</p>
                </div>
              ) : (
                <table className="admin-quotes-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Customer Name</th>
                      <th>Phone</th>
                      <th>Event Date</th>
                      <th>Venue</th>
                      <th>Type</th>
                      <th>Guests</th>
                      <th>Submitted On</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQuotes.map((q, idx) => (
                      <tr key={q.id || idx}>
                        <td>{idx + 1}</td>
                        <td>
                          <strong className="customer-name">{q.name}</strong>
                        </td>
                        <td>
                          <a href={`tel:${q.phone}`} className="phone-link">
                            {q.phone}
                          </a>
                        </td>
                        <td>{q.date}</td>
                        <td className="venue-cell" title={q.venue}>
                          {q.venue}
                        </td>
                        <td>
                          <span className="badge-event-type">{q.type}</span>
                        </td>
                        <td>
                          <span className="badge-count-pill">{q.count}</span>
                        </td>
                        <td className="timestamp-cell">
                          {q.submittedAt
                            ? new Date(q.submittedAt).toLocaleDateString()
                            : 'Recent'}
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn-delete-row"
                            title="Delete quotation"
                            onClick={() => handleDeleteItem(q.id)}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="admin-modal-footer">
              <button
                type="button"
                className="btn-clear-all"
                onClick={handleClearAll}
              >
                Clear All Records
              </button>

              <button
                type="button"
                className="btn-admin-logout"
                onClick={handleLogout}
              >
                🚪 Sign Out Admin
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

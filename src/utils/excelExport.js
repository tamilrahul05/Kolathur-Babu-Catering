import * as XLSX from 'xlsx'

/**
 * Exports an array of quotation objects to a real .xlsx Excel file.
 * @param {Array} quotations - List of quotation objects
 * @param {string} fileName - Optional custom file name
 */
export function exportQuotationsToExcel(quotations, fileName = 'Kolathur_Babu_Quotations') {
  if (!quotations || quotations.length === 0) {
    alert('No quotations to export yet.')
    return false
  }

  // Format data specifically for Excel columns
  const formattedData = quotations.map((q, index) => ({
    'S.No': index + 1,
    'Customer Name': q.name || '',
    'Phone Number': q.phone || '',
    'Event Date': q.date || '',
    'Event Venue': q.venue || '',
    'Event Type': q.type || '',
    'Guest Count': Number(q.count) || 0,
    'Submitted On': q.submittedAt ? new Date(q.submittedAt).toLocaleString() : new Date().toLocaleString(),
  }))

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedData)

  // Auto-fit column widths
  const columnWidths = [
    { wch: 6 },  // S.No
    { wch: 22 }, // Customer Name
    { wch: 16 }, // Phone Number
    { wch: 14 }, // Event Date
    { wch: 30 }, // Event Venue
    { wch: 18 }, // Event Type
    { wch: 14 }, // Guest Count
    { wch: 24 }, // Submitted On
  ]
  worksheet['!cols'] = columnWidths

  // Create workbook
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Quotations')

  // Generate file name with date stamp
  const today = new Date().toISOString().split('T')[0]
  const fullFileName = `${fileName}_${today}.xlsx`

  // Download Excel file
  XLSX.writeFile(workbook, fullFileName)
  return true
}

const STORAGE_KEY = 'kolathur_babu_quotations'

/**
 * Get all stored quotations from localStorage
 */
export function getStoredQuotations() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error reading quotations from storage:', error)
    return []
  }
}

/**
 * Save a new quotation to localStorage
 */
export function saveQuotation(quote) {
  try {
    const existing = getStoredQuotations()
    const newQuote = {
      id: Date.now().toString(),
      ...quote,
      submittedAt: new Date().toISOString(),
    }
    const updated = [newQuote, ...existing]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return updated
  } catch (error) {
    console.error('Error saving quotation:', error)
    return []
  }
}

/**
 * Clear all quotations
 */
export function clearAllQuotations() {
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * Delete a specific quotation by ID
 */
export function deleteQuotation(id) {
  try {
    const list = getStoredQuotations()
    const updated = list.filter((item) => item.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return updated
  } catch (error) {
    console.error('Error deleting quotation:', error)
    return []
  }
}

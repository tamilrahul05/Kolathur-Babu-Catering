/**
 * Formats a date into a localized readable format.
 * @param {string | Date} dateInput
 * @param {Intl.DateTimeFormatOptions} options
 * @returns {string}
 */
export function formatDate(dateInput, options = {}) {
  if (!dateInput) return ''
  const date = new Date(dateInput)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  }).format(date)
}

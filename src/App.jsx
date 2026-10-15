import { useState, useEffect } from 'react'
import { CateringApp } from '@/features/catering/CateringApp'
import { AdminPage } from '@/pages/AdminPage'

function checkIsAdminRoute() {
  const path = window.location.pathname.toLowerCase()
  const hash = window.location.hash.toLowerCase()
  return path === '/admin' || path.startsWith('/admin/') || hash === '#admin'
}

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(checkIsAdminRoute)

  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdminRoute(checkIsAdminRoute())
    }

    window.addEventListener('popstate', handleLocationChange)
    window.addEventListener('hashchange', handleLocationChange)

    return () => {
      window.removeEventListener('popstate', handleLocationChange)
      window.removeEventListener('hashchange', handleLocationChange)
    }
  }, [])

  const navigateTo = (path) => {
    window.history.pushState({}, '', path)
    setIsAdminRoute(checkIsAdminRoute())
  }

  if (isAdminRoute) {
    return <AdminPage onNavigateHome={() => navigateTo('/')} />
  }

  return <CateringApp onNavigateAdmin={() => navigateTo('/admin')} />
}

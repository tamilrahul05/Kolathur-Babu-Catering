import { useState, useEffect } from 'react'
import { CateringApp } from '@/features/catering/CateringApp'
import { AdminPage } from '@/pages/AdminPage'

function checkIsAdminRoute() {
  const path = window.location.pathname.toLowerCase().replace(/\/$/, '')
  const hash = window.location.hash.toLowerCase()
  return (
    path.endsWith('/admin') ||
    path.includes('/admin/') ||
    hash === '#admin'
  )
}

function getBasePath() {
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname.toLowerCase()
    if (pathname.includes('/kolathur-babu-catering')) {
      return '/Kolathur-Babu-Catering'
    }
  }
  return ''
}

function getNavigationPath(target) {
  const basePath = getBasePath()
  if (target === '/') {
    return basePath ? `${basePath}/` : '/'
  }
  if (target === '/admin') {
    return basePath ? `${basePath}/admin` : '/admin'
  }
  return target
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

  const navigateTo = (target) => {
    const fullPath = getNavigationPath(target)
    window.history.pushState({}, '', fullPath)
    setIsAdminRoute(checkIsAdminRoute())
  }

  if (isAdminRoute) {
    return <AdminPage onNavigateHome={() => navigateTo('/')} />
  }

  return <CateringApp onNavigateAdmin={() => navigateTo('/admin')} />
}

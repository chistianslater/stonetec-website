import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Sofort nach oben springen
    window.scrollTo(0, 0)
    
    // Falls Lenis aktiv ist, stellen wir sicher, dass es ebenfalls zurückgesetzt wird
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true })
    }
  }, [pathname])

  return null
}

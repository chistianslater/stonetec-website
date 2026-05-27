import { Outlet, Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

/* ─── Full Logo with Text ──────────────────────────────────── */
function FullLogo({ variant = 'light', className = '' }) {
  const isLight = variant === 'light'
  const c1 = isLight ? '#9a9590' : '#8a8580'
  const c2 = isLight ? '#6a6560' : '#b0aaa5'
  const c3 = isLight ? '#2a2825' : '#d8d4d0'
  const text = isLight ? '#1a1815' : '#f0ece8'

  return (
    <svg viewBox="0 0 400 280" className={className} style={{ display: 'block' }} xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(200, 90)">
        <g transform="translate(-50, -18) rotate(45)"><rect x="-34" y="-34" width="68" height="68" rx="2" fill={c1}/></g>
        <g transform="translate(50, -18) rotate(45)"><rect x="-34" y="-34" width="68" height="68" rx="2" fill={c2}/></g>
        <g transform="translate(0, 32) rotate(45)"><rect x="-34" y="-34" width="68" height="68" rx="2" fill={c3}/></g>
      </g>
      <text x="200" y="240" textAnchor="middle" fontFamily="Sora, sans-serif" fontWeight="400" fontSize="48" fill={text} letterSpacing="2">stonetec</text>
    </svg>
  )
}

/* ─── Logo Mark Only (3 squares, no text) ──────────────────────────────────── */
function LogoMark({ variant = 'light', className = '', animate = false }) {
  const isLight = variant === 'light'
  const c1 = isLight ? '#9a9590' : '#8a8580'
  const c2 = isLight ? '#6a6560' : '#b0aaa5'
  const c3 = isLight ? '#2a2825' : '#d8d4d0'

  return (
    <svg 
      viewBox="0 0 140 140" 
      className={`${className} ${animate ? 'logo-pulse' : ''}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(70, 70)">
        <g transform="translate(-35, -12) rotate(45)"><rect x="-24" y="-24" width="48" height="48" rx="2" fill={c1}/></g>
        <g transform="translate(35, -12) rotate(45)"><rect x="-24" y="-24" width="48" height="48" rx="2" fill={c2}/></g>
        <g transform="translate(0, 22) rotate(45)"><rect x="-24" y="-24" width="48" height="48" rx="2" fill={c3}/></g>
      </g>
    </svg>
  )
}

/* ─── Header Component ──────────────────────────────────── */
function Header() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setScrolled(scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        scrolled 
          ? 'bg-warm-bg/90 backdrop-blur-xl border-b border-warm-anthrazit/10 py-4' 
          : isHome 
            ? 'bg-transparent py-6' 
            : 'bg-warm-bg/95 backdrop-blur-sm py-6 border-b border-warm-anthrazit/10'
      }`}
    >
      <nav className="flex items-center justify-between px-6 md:px-12 lg:px-20">
        <Link to="/" className="flex items-center">
          <div 
            className="transition-transform duration-500 ease-out origin-left"
            style={{
              transform: scrolled ? 'scale(0.88)' : 'scale(1)'
            }}
          >
            <FullLogo 
              variant={scrolled ? 'light' : (isHome ? 'dark' : 'light')}
              className="w-36 md:w-40 h-auto" 
            />
          </div>
        </Link>
        
        <div className="hidden lg:flex items-center gap-8">
          <Link to="/portfolio" className={`font-dm text-[0.85rem] font-medium tracking-wide transition-colors duration-300 ${scrolled ? 'text-warm-text hover:text-warm-anthrazit' : isHome ? 'text-inv-light hover:text-white' : 'text-warm-mittel hover:text-warm-text'}`}>
            Portfolio
          </Link>
          <Link to="/projekte" className={`font-dm text-[0.85rem] font-medium tracking-wide transition-colors duration-300 ${scrolled ? 'text-warm-text hover:text-warm-anthrazit' : isHome ? 'text-inv-light hover:text-white' : 'text-warm-mittel hover:text-warm-text'}`}>
            Projekte
          </Link>
          <Link to="/lookbook" className={`font-dm text-[0.85rem] font-medium tracking-wide transition-colors duration-300 ${scrolled ? 'text-warm-text hover:text-warm-anthrazit' : isHome ? 'text-inv-light hover:text-white' : 'text-warm-mittel hover:text-warm-text'}`}>
            Lookbook
          </Link>
          <Link to="/team" className={`font-dm text-[0.85rem] font-medium tracking-wide transition-colors duration-300 ${scrolled ? 'text-warm-text hover:text-warm-anthrazit' : isHome ? 'text-inv-light hover:text-white' : 'text-warm-mittel hover:text-warm-text'}`}>
            Team
          </Link>
          <Link to="/magazin" className={`font-dm text-[0.85rem] font-medium tracking-wide transition-colors duration-300 ${scrolled ? 'text-warm-text hover:text-warm-anthrazit' : isHome ? 'text-inv-light hover:text-white' : 'text-warm-mittel hover:text-warm-text'}`}>
            Magazin
          </Link>
          <Link 
            to="/kontakt" 
            className={`px-5 py-2.5 font-dm text-[0.75rem] font-semibold tracking-wider uppercase transition-all duration-300 ${scrolled ? 'bg-warm-anthrazit text-warm-bg hover:bg-warm-text' : isHome ? 'bg-inv-light text-warm-text hover:bg-white' : 'bg-warm-text text-warm-bg hover:bg-warm-anthrazit'}`}
          >
            Kontakt
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="lg:hidden p-2" aria-label="Menu">
          <svg className={`w-6 h-6 ${scrolled ? 'text-warm-anthrazit' : isHome ? 'text-inv-light' : 'text-warm-text'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>
    </header>
  )
}

/* ─── Footer Component ──────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-[#060606] border-t border-dark-border py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="lg:col-span-1">
            <Link to="/">
              <FullLogo variant="dark" className="w-32" />
            </Link>
            <p className="font-dm text-[0.82rem] text-inv-muted leading-relaxed mt-4">
              Premium Fliesenverlegung, Keramikmanufaktur und 3D-Raumplanung in Bocholt.
            </p>
          </div>

          <div>
            <h4 className="font-sora font-light text-sm text-inv-light mb-4 tracking-wide">Kontakt</h4>
            <address className="not-italic space-y-2 font-dm text-[0.82rem] text-inv-muted">
              <p>StoneTec GmbH</p>
              <p>Hamalandstraße 2</p>
              <p>46399 Bocholt</p>
              <p className="mt-3">
                <a href="tel:+4928719912480" className="hover:text-inv-light transition-colors">+49 (0) 2871 99 12 480</a>
              </p>
              <p>
                <a href="mailto:info@stonetec-bocholt.de" className="hover:text-inv-light transition-colors">info@stonetec-bocholt.de</a>
              </p>
            </address>
          </div>

          <div>
            <h4 className="font-sora font-light text-sm text-inv-light mb-4 tracking-wide">Navigation</h4>
            <nav className="space-y-2 font-dm text-[0.82rem] text-inv-muted">
              <p><Link to="/portfolio" className="hover:text-inv-light transition-colors">Portfolio</Link></p>
              <p><Link to="/projekte" className="hover:text-inv-light transition-colors">Projekte</Link></p>
              <p><Link to="/lookbook" className="hover:text-inv-light transition-colors">Lookbook</Link></p>
              <p><Link to="/team" className="hover:text-inv-light transition-colors">Team</Link></p>
              <p><Link to="/magazin" className="hover:text-inv-light transition-colors">Magazin</Link></p>
              <p><Link to="/kontakt" className="hover:text-inv-light transition-colors">Kontakt</Link></p>
            </nav>
          </div>

          <div>
            <h4 className="font-sora font-light text-sm text-inv-light mb-4 tracking-wide">Folgen</h4>
            <div className="space-y-2 font-dm text-[0.82rem] text-inv-muted">
              <p><a href="https://www.instagram.com/stonetec_gmbh/" target="_blank" rel="noopener noreferrer" className="hover:text-inv-light transition-colors">Instagram</a></p>
            </div>
            <div className="mt-8 space-y-2 font-dm text-[0.72rem] text-inv-tagline">
              <p><Link to="/impressum" className="hover:text-inv-muted transition-colors">Impressum</Link></p>
              <p><Link to="/datenschutz" className="hover:text-inv-muted transition-colors">Datenschutz</Link></p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-dark-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-dm text-[0.72rem] text-inv-tagline">
            &copy; {new Date().getFullYear()} StoneTec GmbH &middot; Sitz Bocholt &middot; HRB 14999
          </p>
          <p className="font-dm text-[0.68rem] text-dark-border">
            Geschäftsleitung: Tim Dunkerbeck
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ─── Layout Component ──────────────────────────────────── */
export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

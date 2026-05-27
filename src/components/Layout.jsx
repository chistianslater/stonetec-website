import { Outlet, Link, useLocation } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'

/* ─── Smooth Scrolling Hook ──────────────────────────────────── */
function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])
}

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

/* ─── Magnetic Button Component ──────────────────────────────────── */
function MagneticButton({ children, className, ...props }) {
  const ref = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const x = (clientX - left - width / 2) * 0.3
    const y = (clientY - top - height / 2) * 0.3
    setPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.button
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 350, damping: 15, mass: 0.5 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}

/* ─── Mobile Menu Overlay ──────────────────────────────────── */
function MobileMenu({ isOpen, onClose, isHome, scrolled }) {
  const menuItems = [
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Projekte', path: '/projekte' },
    { name: 'Lookbook', path: '/lookbook' },
    { name: 'Team', path: '/team' },
    { name: 'Magazin', path: '/magazin' },
    { name: 'Kontakt', path: '/kontakt', isButton: true },
  ]

  const handleLinkClick = () => {
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-warm-bg/98 backdrop-blur-2xl"
            onClick={onClose}
          />

          {/* Menu Content */}
          <motion.nav
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 30,
              mass: 0.8
            }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 400, damping: 20 }}
              onClick={onClose}
              className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-warm-anthrazit/10 hover:bg-warm-anthrazit/20 transition-colors"
              aria-label="Menu schließen"
            >
              <svg className="w-6 h-6 text-warm-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            {/* Menu Items with stagger */}
            <div className="flex flex-col items-center gap-6">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    delay: 0.1 + index * 0.08,
                    type: 'spring',
                    stiffness: 200,
                    damping: 20
                  }}
                >
                  {item.isButton ? (
                    <Link
                      to={item.path}
                      onClick={handleLinkClick}
                      className="inline-block px-10 py-4 bg-warm-anthrazit text-warm-bg font-dm text-lg font-semibold tracking-wider uppercase hover:bg-warm-text transition-colors duration-300"
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={handleLinkClick}
                      className="group relative block overflow-hidden"
                    >
                      <span className="font-sora text-4xl md:text-5xl lg:text-6xl font-light text-warm-text tracking-tight block transition-transform duration-500 group-hover:-translate-y-full">
                        {item.name}
                      </span>
                      <span className="font-sora text-4xl md:text-5xl lg:text-6xl font-light text-warm-anthrazit tracking-tight block absolute top-full left-0 transition-transform duration-500 group-hover:-translate-y-full">
                        {item.name}
                      </span>
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Footer Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute bottom-10 left-6 right-6 flex flex-col md:flex-row justify-between items-center gap-4 text-warm-mittel font-dm text-sm"
            >
              <p>+49 (0) 2871 99 12 480</p>
              <p>Hamalandstraße 2, 46399 Bocholt</p>
            </motion.div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  )
}

/* ─── Header Component ──────────────────────────────────── */
function Header() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useSmoothScroll()

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setScrolled(scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <>
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
          scrolled 
            ? 'bg-warm-bg/90 backdrop-blur-xl border-b border-warm-anthrazit/10 py-3' 
            : isHome 
              ? 'bg-transparent py-6' 
              : 'bg-warm-bg/95 backdrop-blur-sm py-6 border-b border-warm-anthrazit/10'
        }`}
      >
        <nav className="flex items-center justify-between px-6 md:px-12 lg:px-20">
          <Link to="/" className="flex items-center relative">
            <motion.div 
              className="transition-transform duration-500 ease-out origin-left"
              animate={{ scale: scrolled ? 0.88 : 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <FullLogo 
                variant={scrolled ? 'light' : (isHome ? 'dark' : 'light')}
                className="w-36 md:w-40 h-auto" 
              />
            </motion.div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {['Portfolio', 'Projekte', 'Lookbook', 'Team', 'Magazin'].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link 
                  to={`/${item.toLowerCase()}`}
                  className={`group relative font-dm text-[0.95rem] font-medium tracking-[0.08em] uppercase overflow-hidden ${
                    scrolled ? 'text-warm-text' : isHome ? 'text-inv-light' : 'text-warm-mittel'
                  }`}
                >
                  <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                    {item}
                  </span>
                  <span className={`absolute top-full left-0 block transition-transform duration-300 group-hover:-translate-y-full ${
                    scrolled ? 'text-warm-anthrazit' : 'text-white'
                  }`}>
                    {item}
                  </span>
                </Link>
              </motion.div>
            ))}
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 200, damping: 20 }}
            >
              <MagneticButton
                as={Link}
                to="/kontakt"
                className={`px-6 py-3 font-dm text-[0.85rem] font-semibold tracking-[0.1em] uppercase transition-all duration-300 ${
                  scrolled 
                    ? 'bg-warm-anthrazit text-warm-bg hover:bg-warm-text' 
                    : isHome 
                      ? 'bg-inv-light text-warm-text hover:bg-white' 
                      : 'bg-warm-text text-warm-bg hover:bg-warm-anthrazit'
                }`}
              >
                Kontakt
              </MagneticButton>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button 
            onClick={() => setMenuOpen(true)}
            className="lg:hidden relative w-12 h-12 flex items-center justify-center rounded-full hover:bg-warm-anthrazit/10 transition-colors"
            aria-label="Menu öffnen"
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-6 flex flex-col gap-1.5 items-end">
              <motion.span 
                className={`block h-0.5 rounded-full transition-all duration-300 ${scrolled ? 'bg-warm-anthrazit' : isHome ? 'bg-inv-light' : 'bg-warm-text'}`}
                style={{ width: '100%' }}
              />
              <motion.span 
                className={`block h-0.5 rounded-full transition-all duration-300 ${scrolled ? 'bg-warm-anthrazit' : isHome ? 'bg-inv-light' : 'bg-warm-text'}`}
                style={{ width: '75%' }}
              />
              <motion.span 
                className={`block h-0.5 rounded-full transition-all duration-300 ${scrolled ? 'bg-warm-anthrazit' : isHome ? 'bg-inv-light' : 'bg-warm-text'}`}
                style={{ width: '100%' }}
              />
            </div>
          </motion.button>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={menuOpen} 
        onClose={() => setMenuOpen(false)} 
        isHome={isHome}
        scrolled={scrolled}
      />
    </>
  )
}

/* ─── Footer Component ──────────────────────────────────── */
function Footer() {
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="bg-[#060606] border-t border-dark-border py-16"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Link to="/">
              <FullLogo variant="dark" className="w-32" />
            </Link>
            <p className="font-dm text-[0.82rem] text-inv-muted leading-relaxed mt-4">
              Premium Fliesenverlegung, Keramikmanufaktur und 3D-Raumplanung in Bocholt.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="font-sora font-light text-sm text-inv-light mb-4 tracking-wide">Kontakt</h4>
            <address className="not-italic space-y-2 font-dm text-[0.82rem] text-inv-muted">
              <p>StoneTec GmbH</p>
              <p>Hamalandstraße 2</p>
              <p>46399 Bocholt</p>
              <p className="mt-3">
                <a href="tel:+4928719912480" className="hover:text-inv-light transition-colors relative group">
                  +49 (0) 2871 99 12 480
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-inv-light transition-all duration-300 group-hover:w-full" />
                </a>
              </p>
              <p>
                <a href="mailto:info@stonetec-bocholt.de" className="hover:text-inv-light transition-colors relative group">
                  info@stonetec-bocholt.de
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-inv-light transition-all duration-300 group-hover:w-full" />
                </a>
              </p>
            </address>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="font-sora font-light text-sm text-inv-light mb-4 tracking-wide">Navigation</h4>
            <nav className="space-y-2 font-dm text-[0.82rem] text-inv-muted">
              {['Portfolio', 'Projekte', 'Lookbook', 'Team', 'Magazin', 'Kontakt'].map((item) => (
                <p key={item}>
                  <Link 
                    to={`/${item.toLowerCase()}`} 
                    className="hover:text-inv-light transition-colors relative inline-block group"
                  >
                    {item}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-inv-light transition-all duration-300 group-hover:w-full" />
                  </Link>
                </p>
              ))}
            </nav>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h4 className="font-sora font-light text-sm text-inv-light mb-4 tracking-wide">Folgen</h4>
            <div className="space-y-2 font-dm text-[0.82rem] text-inv-muted">
              <p>
                <a 
                  href="https://www.instagram.com/stonetec_gmbh/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-inv-light transition-colors relative inline-block group"
                >
                  Instagram
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-inv-light transition-all duration-300 group-hover:w-full" />
                </a>
              </p>
            </div>
            <div className="mt-8 space-y-2 font-dm text-[0.72rem] text-inv-tagline">
              <p>
                <Link to="/impressum" className="hover:text-inv-muted transition-colors relative inline-block group">
                  Impressum
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-inv-muted transition-all duration-300 group-hover:w-full" />
                </Link>
              </p>
              <p>
                <Link to="/datenschutz" className="hover:text-inv-muted transition-colors relative inline-block group">
                  Datenschutz
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-inv-muted transition-all duration-300 group-hover:w-full" />
                </Link>
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="mt-16 pt-8 border-t border-dark-border flex flex-col md:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="font-dm text-[0.72rem] text-inv-tagline">
            &copy; {new Date().getFullYear()} StoneTec GmbH &middot; Sitz Bocholt &middot; HRB 14999
          </p>
          <p className="font-dm text-[0.68rem] text-dark-border">
            Geschäftsleitung: Tim Dunkerbeck
          </p>
        </motion.div>
      </div>
    </motion.footer>
  )
}

/* ─── Page Transition Wrapper ──────────────────────────────────── */
function PageTransition({ children }) {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ 
          duration: 0.5, 
          ease: [0.16, 1, 0.3, 1]
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

/* ─── Layout Component ──────────────────────────────────── */
export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
    </div>
  )
}

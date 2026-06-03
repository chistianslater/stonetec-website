import { Outlet, Link, useLocation } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
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

    window.lenis = lenis

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
      window.lenis = null
    }
  }, [])
}

/* ─── Custom Cursor Component ──────────────────────────────────── */
function CustomCursor() {
  const [cursorState, setCursorState] = useState('default')
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    const handleMouseOver = (e) => {
      const target = e.target
      const isInteractive = target.closest('button, a, .magnetic-area')
      if (isInteractive) {
        setCursorState('pointer')
      } else {
        setCursorState('default')
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
    }
  }, [mouseX, mouseY])

  return (
    <motion.div
      className="fixed top-0 left-0 w-5 h-5 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference hidden lg:block"
      style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      animate={{
        scale: cursorState === 'pointer' ? 4 : 1,
        opacity: 1
      }}
      transition={{ type: 'spring', stiffness: 250, damping: 25, mass: 0.5 }}
    />
  )
}

/* ─── Full Logo with Text ──────────────────────────────────── */
function FullLogo({ variant = 'light', className = '', scale = 1 }) {
  const isLight = variant === 'light'
  const c1 = isLight ? '#9a9590' : '#8a8580'
  const c2 = isLight ? '#6a6560' : '#b0aaa5'
  const c3 = isLight ? '#2a2825' : '#d8d4d0'
  const text = isLight ? '#1a1815' : '#f0ece8'

  return (
    <svg 
      viewBox="0 0 400 280" 
      className={className} 
      style={{ 
        display: 'block',
        transform: `scale(${scale})`,
        transformOrigin: 'left center',
        transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
      }} 
      xmlns="http://www.w3.org/2000/svg"
    >
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
function MagneticButton({ children, className, to, ...props }) {
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

  const content = (
    <motion.div
      ref={ref}
      className={`${className} magnetic-area flex items-center justify-center`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 350, damping: 15, mass: 0.5 }}
      {...props}
    >
      {children}
    </motion.div>
  )

  if (to) {
    return <Link to={to}>{content}</Link>
  }

  return content
}

/* ─── Mobile Menu Overlay ──────────────────────────────────── */
function MobileMenu({ isOpen, onClose }) {
  const menuItems = [
    { name: 'Leistungen', path: '/leistungen' },
    { name: 'Projekte', path: '/projekte' },
    { name: 'Lookbook', path: '/lookbook' },
    { name: 'Team', path: '/team' },
    { name: 'Magazin', path: '/magazin' },
    { name: 'Kontakt', path: '/kontakt', isButton: true },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-warm-bg/98 backdrop-blur-2xl"
            onClick={onClose}
          />

          <motion.nav
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 w-full md:w-[450px] z-[70] bg-warm-bg shadow-2xl flex flex-col items-center justify-center"
          >
            <button
              onClick={onClose}
              className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center rounded-none bg-warm-anthrazit/5 hover:bg-warm-anthrazit/10 transition-colors cursor-pointer"
            >
              <svg className="w-6 h-6 text-warm-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col items-center gap-8">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={item.isButton 
                      ? "inline-block px-10 py-4 bg-warm-anthrazit text-warm-bg font-dm text-lg font-semibold tracking-[0.1em] uppercase hover:bg-warm-text transition-colors duration-300"
                      : "group relative block overflow-hidden h-[1.2em] font-sora text-4xl font-light text-warm-text"
                    }
                  >
                    {!item.isButton ? (
                      <>
                        <span className="block transition-transform duration-500 ease-out group-hover:-translate-y-full uppercase tracking-wider">
                          {item.name}
                        </span>
                        <span className="absolute top-full left-0 block transition-transform duration-500 ease-out group-hover:-translate-y-full uppercase tracking-wider text-warm-mittel">
                          {item.name}
                        </span>
                      </>
                    ) : (
                      item.name
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
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
  const [animateLogo, setAnimateLogo] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const isScrolled = scrollY > 80
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
        if (isScrolled) {
          setAnimateLogo(true)
          setTimeout(() => setAnimateLogo(false), 800)
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrolled])

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
  }, [menuOpen])

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          scrolled 
            ? 'bg-white/80 backdrop-blur-xl border-b border-black/5 py-3' 
            : isHome 
              ? 'bg-transparent py-6' 
              : 'bg-warm-bg/95 backdrop-blur-sm py-6 border-b border-warm-anthrazit/10'
        }`}
      >
        <nav className="flex items-center justify-between px-6 md:px-12 lg:px-20">
          <Link to="/" className={`flex items-center transition-transform duration-500 ${animateLogo ? 'logo-pulse' : ''}`}>
            <FullLogo 
              variant={scrolled ? 'light' : (isHome ? 'dark' : 'light')}
              className="w-32 md:w-36 h-auto" 
              scale={scrolled ? 0.85 : 1}
            />
          </Link>
          
          <div className="hidden lg:flex items-center gap-10">
            {['Leistungen', 'Projekte', 'Lookbook', 'Team', 'Magazin'].map((item) => (
              <Link 
                key={item}
                to={`/${item.toLowerCase()}`}
                className={`group relative inline-block font-dm text-[0.95rem] font-medium tracking-[0.08em] uppercase overflow-hidden h-[1.2em] ${
                  scrolled ? 'text-black' : isHome ? 'text-inv-light' : 'text-warm-mittel'
                }`}
              >
                <span className="block transition-transform duration-500 ease-out group-hover:-translate-y-full">
                  {item}
                </span>
                <span className="absolute top-full left-0 block transition-transform duration-500 ease-out group-hover:-translate-y-full">
                  {item}
                </span>
              </Link>
            ))}
            
            <MagneticButton
              to="/kontakt"
              className={`px-6 py-3 font-dm text-[0.85rem] font-semibold tracking-[0.1em] uppercase transition-all duration-300 ${
                scrolled 
                  ? 'bg-black text-white hover:bg-warm-anthrazit' 
                  : isHome 
                    ? 'bg-inv-light text-warm-text hover:bg-white' 
                    : 'bg-warm-text text-warm-bg hover:bg-warm-anthrazit'
              }`}
            >
              Kontakt
            </MagneticButton>
          </div>

          <button 
            onClick={() => setMenuOpen(true)}
            className="lg:hidden flex flex-col gap-1.5 items-end group cursor-pointer"
            aria-label="Menu öffnen"
          >
            <span className={`block h-0.5 w-6 transition-all duration-300 group-hover:w-8 ${scrolled ? 'bg-black' : isHome ? 'bg-inv-light' : 'bg-warm-text'}`} />
            <span className={`block h-0.5 w-4 transition-all duration-300 group-hover:w-8 ${scrolled ? 'bg-black' : isHome ? 'bg-inv-light' : 'bg-warm-text'}`} />
            <span className={`block h-0.5 w-6 transition-all duration-300 group-hover:w-8 ${scrolled ? 'bg-black' : isHome ? 'bg-inv-light' : 'bg-warm-text'}`} />
          </button>
        </nav>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
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
                <a href="mailto:fliesen@stonetec-bocholt.de" className="hover:text-inv-light transition-colors">fliesen@stonetec-bocholt.de</a>
              </p>
            </address>
          </div>

          <div>
            <h4 className="font-sora font-light text-sm text-inv-light mb-4 tracking-wide">Navigation</h4>
            <nav className="space-y-2 font-dm text-[0.82rem] text-inv-muted">
              {['Leistungen', 'Projekte', 'Lookbook', 'Team', 'Magazin', 'Kontakt'].map((item) => (
                <p key={item}>
                  <Link to={`/${item.toLowerCase()}`} className="hover:text-inv-light transition-colors">{item}</Link>
                </p>
              ))}
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
  useSmoothScroll()
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col relative">
      <CustomCursor />
      <Header />
      <main className="flex-1 relative">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

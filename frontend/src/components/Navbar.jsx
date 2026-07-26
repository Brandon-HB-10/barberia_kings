import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { FaBars, FaTimes, FaCut } from 'react-icons/fa'

const navLinks = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#galeria', label: 'Galería' },
  { href: '#reservar', label: 'Reservar' },
  { href: '#testimonios', label: 'Testimonios' },
  { href: '#faq', label: 'FAQ' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const isAdmin = location.pathname.includes('/admin')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ─── DESKTOP ───
  const handleNavClick = (e, href) => {
    e.preventDefault()

    if (isAdmin) {
      // Si estamos en Admin, navegar a Home + anchor (scroll nativo del navegador)
      window.location.href = '/' + href
      return
    }

    // En Home: scroll suave directo
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  // ─── MÓVIL ───
  // Se separa porque hay que esperar a que cierre la animación del menú
  // antes de hacer scroll. Si no, el layout del menú colapsando interfiere.
  const handleMobileNavClick = (e, href) => {
    e.preventDefault()
    e.stopPropagation()          // Evita que el evento burbujee y se cancele
    setMobileOpen(false)

    if (isAdmin) {
      setTimeout(() => {
        window.location.href = '/' + href
      }, 350)
      return
    }

    // Esperamos 350ms a que termine la animación de cierre del menú móvil
    setTimeout(() => {
      const el = document.querySelector(href)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 350)
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-dark/80 backdrop-blur-xl border-b border-dark-border'
          : 'bg-dark/30 backdrop-blur-md border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              whileHover={{ scale: 1.04 }}
              className="w-10 h-10 rounded-full bg-street-green flex items-center justify-center"
            >
              <FaCut className="text-dark text-lg" />
            </motion.div>
            <span className="font-display font-semibold text-lg tracking-[-0.03em] text-ice hidden sm:block">
              Clipper Kings
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-4 py-2 text-sm font-medium text-ice-dim hover:text-ice rounded-full hover:bg-white/[0.04] transition-all"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/admin"
              className="ml-4 px-5 py-2.5 text-sm font-semibold text-dark bg-street-green rounded-full transition-all hover:bg-street-green-light hover:-translate-y-0.5"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 rounded-full bg-white/[0.04] border border-dark-border flex items-center justify-center text-ice relative z-50"
          >
            {mobileOpen ? <FaTimes /> : <FaBars />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden bg-dark/95 backdrop-blur-xl border-b border-dark-border overflow-hidden relative z-40"
          >
            <div className="px-4 py-6 space-y-2">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={(e) => handleMobileNavClick(e, link.href)}
                  className="block px-4 py-3 text-ice-dim hover:text-ice hover:bg-white/[0.04] rounded-xl transition-all font-medium text-base select-none"
                  style={{ touchAction: 'manipulation' }}
                >
                  {link.label}
                </motion.a>
              ))}
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-dark font-semibold bg-street-green rounded-full text-center mt-4"
              >
                Panel Admin
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
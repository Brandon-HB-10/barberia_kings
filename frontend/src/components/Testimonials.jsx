import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const testimonials = [
  {
    id: 1,
    name: 'Sánchez Montiel Abel Sain',
    initials: 'SA',
    rating: 5,
    text: 'Buen servicio, 1000/10 exelentes cortes y grecas 🔥🔥🔥',
    service: 'Diseños y Figuras'
  },
  {
    id: 2,
    name: 'Maximo Campuzano',
    initials: 'MC',
    rating: 5,
    text: 'Muy buen servicio 100% recomendado 🔥🔥',
    service: 'Flow Cut'
  },
  {
    id: 3,
    name: 'Marco Antonio Pérez Cruz',
    initials: 'MP',
    rating: 5,
    text: 'Buen ambiente, los cortes muy buenos, todos son muy amables y buen precio',
    service: 'Flow Cut + Barba'
  },
  {
    id: 4,
    name: 'Saronni Torres',
    initials: 'ST',
    rating: 5,
    text: 'Excelente servicio, son puntuales con las citas.',
    service: 'Flow Premium'
  },
  {
    id: 5,
    name: 'Cristian Montiel',
    initials: 'CM',
    rating: 5,
    text: 'Excelente servicio, aquí si saben como tocarme la cabeza.',
    service: 'Flow Cut'
  },
  {
    id: 6,
    name: 'Jonathan Olvera',
    initials: 'JO',
    rating: 5,
    text: 'Excelente servicio y buen ambiente con los clientes',
    service: 'Arreglo de Barba'
  },
  {
    id: 7,
    name: 'Daniel Hernández',
    initials: 'DH',
    rating: 5,
    text: 'Realiza buenos cortes y sugiere buenas opciones. Precio $300-350',
    service: 'Tinte y Color'
  }
]

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1)
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const next = () => {
    setDirection(1)
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setDirection(-1)
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
  }

  const t = testimonials[current]

  return (
    <section id="testimonios" className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-street-green/40 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-street-blue/5 rounded-full blur-[150px]" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-street-gold/10 border border-street-gold/20 mb-6">
            <FaStar className="text-street-gold" />
            <span className="text-street-gold text-sm font-bold uppercase tracking-wider">4.7 Estrellas</span>
          </div>
          <h2 className="graffiti-text text-3xl sm:text-5xl md:text-6xl text-gradient mb-4">
            Lo Que Dicen Nuestros Clientes
          </h2>
          <p className="text-ice-dim text-base sm:text-lg max-w-2xl mx-auto">
            La satisfacción de nuestros clientes es nuestra mayor recompensa.
          </p>
        </motion.div>

        <div className="relative">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card-strong rounded-3xl p-8 sm:p-12 neon-border-strong relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-street-green/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

              <div className="relative z-10 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-street-green to-street-blue flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(0,255,136,0.3)]"
                >
                  <span className="text-dark font-orbitron font-bold text-xl">{t.initials}</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <FaQuoteLeft className="text-street-green/30 text-3xl mx-auto mb-4" />
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-ice text-lg sm:text-xl md:text-2xl font-medium leading-relaxed mb-6 max-w-2xl mx-auto"
                >
                  "{t.text}"
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center justify-center gap-1 mb-4"
                >
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < t.rating ? 'text-street-gold' : 'text-ice-dim/30'} />
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <p className="font-orbitron font-bold text-ice text-lg">{t.name}</p>
                  <p className="text-street-green text-sm mt-1">{t.service}</p>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prev}
              className="w-12 h-12 rounded-full bg-dark-lighter border border-dark-border flex items-center justify-center text-ice hover:border-street-green hover:text-street-green transition-colors"
            >
              <FaChevronLeft />
            </motion.button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > current ? 1 : -1)
                    setCurrent(i)
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === current 
                      ? 'bg-street-green w-8 shadow-[0_0_10px_#00FF88]' 
                      : 'bg-dark-border hover:bg-ice-dim/50'
                  }`}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={next}
              className="w-12 h-12 rounded-full bg-dark-lighter border border-dark-border flex items-center justify-center text-ice hover:border-street-green hover:text-street-green transition-colors"
            >
              <FaChevronRight />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  )
}
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaExpand, FaInstagram } from 'react-icons/fa'

const images = [
  {
    id: 1,
    src: '/galeria/corte1.jpg',
    alt: 'Corte crop Clipper Kings',
    category: 'Cortes'
  },
  {
    id: 2,
    src: '/galeria/corte2.jpg',
    alt: 'Diseño',
    category: 'Diseños'
  },
  {
    id: 3,
    src: '/galeria/barba1.jpg',
    alt: 'Arreglo de barba',
    category: 'Barbas'
  },
  {
    id: 4,
    src: '/galeria/local1.jpg',
    alt: 'Interior de la barbería',
    category: 'Local'
  },
  {
    id: 5,
    src: '/galeria/corte3.jpg',
    alt: 'Low Fade',
    category: 'Cortes'
  },
  {
    id: 6,
    src: '/galeria/corte_tijera.jpg',
    alt: 'Mod Cut',
    category: 'Tijeras'
  }
]

const categories = [
  'Todos',
  'Cortes',
  'Barbas',
  'Diseños',
  'Tijeras',
  'Local'
]

export default function Gallery() {
  const [filter, setFilter] = useState('Todos')
  const [selectedImage, setSelectedImage] = useState(null)

  const filtered = (
    filter === 'Todos'
      ? images
      : images.filter((image) => image.category === filter)
  )

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  useEffect(() => {
    if (!selectedImage) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    const previousTouchAction = document.body.style.touchAction

    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeLightbox()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.touchAction = previousTouchAction
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedImage])

  const lightbox = (
    <AnimatePresence>
      {selectedImage && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Vista ampliada de ${selectedImage.alt}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={closeLightbox}
          className="fixed inset-0 z-[9999] flex h-[100dvh] w-screen items-center justify-center overflow-hidden bg-black/90 p-3 sm:p-6"
        >
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              closeLightbox()
            }}
            aria-label="Cerrar imagen"
            className="fixed right-3 top-3 z-[10000] flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/75 text-xl text-white shadow-lg transition hover:border-street-red hover:text-street-red sm:right-6 sm:top-6 sm:h-12 sm:w-12"
          >
            <FaTimes />
          </button>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => event.stopPropagation()}
            className="flex h-full w-full items-center justify-center"
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              draggable="false"
              className="block h-auto max-h-[calc(100dvh-1.5rem)] w-auto max-w-[calc(100vw-1.5rem)] rounded-xl object-contain shadow-2xl sm:max-h-[calc(100dvh-3rem)] sm:max-w-[calc(100vw-3rem)]"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <section
      id="galeria"
      className="relative py-24 sm:py-32"
    >
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-street-gold/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-street-gold/20 bg-street-gold/10 px-5 py-2.5">
            <FaExpand className="text-street-gold" />

            <span className="text-sm font-bold uppercase tracking-wider text-street-gold">
              Galería
            </span>
          </div>

          <h2 className="graffiti-text text-gradient mb-4 text-3xl sm:text-5xl md:text-6xl">
            Nuestro Trabajo
          </h2>

          <p className="mx-auto max-w-2xl text-base text-ice-dim sm:text-lg">
            Arte urbano en cada corte. Esto es lo que hacemos.
          </p>
        </motion.div>

        {/* Filtros */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <motion.button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`rounded-full px-5 py-2 text-sm font-bold transition-all ${
                filter === category
                  ? 'bg-street-green text-dark shadow-[0_0_15px_rgba(0,255,136,0.4)]'
                  : 'border border-dark-border bg-dark-lighter text-ice-dim hover:border-street-green/50'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Cuadrícula */}
        <motion.div
          layout
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((image, index) => (
              <motion.button
                key={image.id}
                type="button"
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{
                  duration: 0.25,
                  delay: index * 0.03
                }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedImage(image)}
                aria-label={`Abrir ${image.alt}`}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-dark-border text-left transition-colors hover:border-street-green/50"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-br from-street-green/10 to-street-blue/10" />

                <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="absolute bottom-0 left-0 right-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
                  <p className="text-sm font-bold text-ice">
                    {image.alt}
                  </p>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-10 text-center">
          <a
            href="https://instagram.com/bran.hb"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-ice-dim transition-colors hover:text-street-gold"
          >
            <FaInstagram />
            Ver más en @bran.hb
          </a>
        </div>

        <p className="mt-4 text-center text-xs text-ice-dim/50">
          Reemplaza las imágenes en la carpeta{' '}
          <code className="text-street-green">
            /public/galeria/
          </code>
        </p>
      </div>

      {typeof document !== 'undefined'
        ? createPortal(lightbox, document.body)
        : null}
    </section>
  )
}
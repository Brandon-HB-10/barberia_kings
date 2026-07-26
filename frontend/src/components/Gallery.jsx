import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaExpand, FaInstagram } from 'react-icons/fa'

const images = [
  { id: 1, src: '/galeria/corte1.jpg', alt: 'Corte crop Clipper Kings', category: 'Cortes' },
  { id: 2, src: '/galeria/corte2.jpg', alt: 'Diseño ', category: 'Diseños' },
  { id: 3, src: '/galeria/barba1.jpg', alt: 'Arreglo de barba', category: 'Barbas' },
  { id: 4, src: '/galeria/local1.jpg', alt: 'Interior de la barbería', category: 'Local' },
  { id: 5, src: '/galeria/corte3.jpg', alt: 'Low Fade', category: 'Cortes' },
  { id: 6, src: '/galeria/corte_tijera.jpg', alt: 'Mod Cut', category: 'Tijeras' },
]

const categories = ['Todos', 'Cortes', 'Barbas', 'Diseños', 'Tijeras', 'Local']

export default function Gallery() {
  const [filter, setFilter] = useState('Todos')
  const [selectedImage, setSelectedImage] = useState(null)

  const filtered = filter === 'Todos' ? images : images.filter(img => img.category === filter)

  return (
    <section id="galeria" className="py-24 sm:py-32 relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-street-gold/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-street-gold/10 border border-street-gold/20 mb-6">
            <FaExpand className="text-street-gold" />
            <span className="text-street-gold text-sm font-bold uppercase tracking-wider">Galería</span>
          </div>
          <h2 className="graffiti-text text-3xl sm:text-5xl md:text-6xl text-gradient mb-4">
            Nuestro Trabajo
          </h2>
          <p className="text-ice-dim text-base sm:text-lg max-w-2xl mx-auto">
            Arte urbano en cada corte. Esto es lo que hacemos.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(cat => (
            <motion.button
              key={cat}
              onClick={() => setFilter(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                filter === cat 
                  ? 'bg-street-green text-dark shadow-[0_0_15px_rgba(0,255,136,0.4)]' 
                  : 'bg-dark-lighter text-ice-dim border border-dark-border hover:border-street-green/50'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence>
            {filtered.map((img, i) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedImage(img)}
                className="relative group cursor-pointer overflow-hidden rounded-2xl border border-dark-border hover:border-street-green/50 transition-colors"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-br from-street-green/10 to-street-blue/10" />

                <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-ice font-bold text-sm">{img.alt}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="text-center mt-10">
          <a 
            href="https://instagram.com/bran.hb" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-ice-dim hover:text-street-gold transition-colors text-sm"
          >
            <FaInstagram /> Ver más en @bran.hb
          </a>
        </div>
        <p className="text-center text-ice-dim/50 text-xs mt-4">
          Reemplaza las imágenes en la carpeta <code className="text-street-green">/public/galeria/</code>
        </p>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-dark/95 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-dark-lighter border border-dark-border flex items-center justify-center text-ice hover:text-street-red hover:border-street-red transition-colors z-10"
            >
              <FaTimes />
            </motion.button>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full"
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-full object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
import { motion } from 'framer-motion'
import { FaInstagram, FaWhatsapp, FaMapMarkerAlt, FaClock, FaPhone } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="relative pt-20 pb-8 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-street-green/40 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-street-green/5 rounded-full blur-[150px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-orbitron font-bold text-2xl text-gradient mb-4">Clipper Kings</h3>
            <p className="text-ice-dim text-sm leading-relaxed mb-4">
              La barbería con más estilo urbano de Apizaco. Cortes, diseños, color y barba con actitud de calle.
            </p>
            <div className="flex gap-3">
              <a href="https://instagram.com/Yoel.cutts.mx" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-dark-lighter border border-dark-border flex items-center justify-center text-ice-dim hover:text-street-gold hover:border-street-gold transition-all">
                <FaInstagram />
              </a>
              <a href="https://wa.me/522461473968" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-dark-lighter border border-dark-border flex items-center justify-center text-ice-dim hover:text-street-green hover:border-street-green transition-all">
                <FaWhatsapp />
              </a>
            </div>
          </motion.div>

          {/* Horario */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-orbitron font-bold text-ice mb-4 flex items-center gap-2">
              <FaClock className="text-street-green" /> Horario
            </h4>
            <div className="space-y-2 text-sm text-ice-dim">
              <p className="flex justify-between"><span>Lunes</span> <span>11:00 AM - 8:00 PM</span></p>
              <p className="flex justify-between"><span>Martes</span> <span>11:00 AM - 8:00 PM</span></p>
              <p className="flex justify-between"><span>Miércoles</span> <span>11:00 AM - 8:00 PM</span></p>
              <p className="flex justify-between"><span>Jueves</span> <span>11:00 AM - 8:00 PM</span></p>
              <p className="flex justify-between"><span>Viernes</span> <span>11:00 AM - 8:00 PM</span></p>
              <p className="flex justify-between"><span>Sábado</span> <span>11:00 AM - 8:00 PM</span></p>
              <p className="flex justify-between"><span>Domingo</span> <span>11:00 AM - 8:00 PM</span></p>
            </div>
          </motion.div>

          {/* Ubicación y contacto */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: 0.2 }}
>
  <h4 className="font-semibold text-ice mb-4 flex items-center gap-2">
    <FaMapMarkerAlt className="text-street-green" />
    Visítanos
  </h4>

  <div className="space-y-4 text-sm text-ice-dim">
    <a
      href="https://maps.app.goo.gl/HT3f1M6cn88uGYMg8"
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 hover:border-street-green/40 hover:bg-street-green/[0.05]"
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
        <FaMapMarkerAlt className="text-street-green" />
      </div>

      <div>
        <span className="mb-1 block text-sm font-semibold text-ice transition-colors group-hover:text-street-green">
          Ver ubicación
        </span>

        <span className="block text-sm leading-relaxed text-ice-dim">
          C. 2 de Abril 305, Centro, 90300 Apizaco, Tlaxcala
        </span>

        <span className="mt-2 inline-block text-xs font-medium text-street-green">
          Abrir en Google Maps →
        </span>
      </div>
    </a>

    <p className="flex items-center gap-3">
      <FaPhone className="text-ice-dim flex-shrink-0" />
      <a
        href="tel:2461473968"
        className="hover:text-street-green transition-colors"
      >
        246 147 3968
      </a>
    </p>

    <p className="flex items-center gap-3">
      <FaWhatsapp className="text-street-green flex-shrink-0" />
      <a
        href="https://wa.me/522461473968"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-street-green transition-colors"
      >
        Contactar por WhatsApp
      </a>
    </p>

    <p className="flex items-center gap-3">
      <FaInstagram className="text-ice-dim flex-shrink-0" />
      <a
        href="https://instagram.com/Yoel.cutts.mx"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-street-green transition-colors"
      >
        @Yoel.cutts.mx
      </a>
    </p>
  </div>
</motion.div>
        </div>

        <div className="border-t border-dark-border pt-8 text-center">
          <p className="text-ice-dim/50 text-sm">
            © 2026 Clipper Kings Barbería. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
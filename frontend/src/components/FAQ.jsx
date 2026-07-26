import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaQuestionCircle, FaChevronDown } from 'react-icons/fa'

const faqs = [
  {
    question: '¿Necesito reservar con anticipación?',
    answer: 'Sí, recomendamos agendar tu cita con al menos un día de anticipación para asegurar tu lugar. También puedes escribirnos por WhatsApp para ver disponibilidad el mismo día.'
  },
  {
    question: '¿Aceptan pagos con tarjeta?',
    answer: 'Por el momento trabajamos principalmente con efectivo y transferencias bancarias. Estamos trabajando para incorporar pagos con tarjeta muy pronto.'
  },
  {
    question: '¿Cuánto dura un corte típico?',
    answer: 'Un corte estándar dura entre 35 y 45 minutos dependiendo del estilo. Los combos con barba o diseños pueden tomar hasta 50-65 minutos.'
  },
  {
    question: '¿Puedo cancelar o reprogramar mi cita?',
    answer: 'Claro, solo avísanos con al menos 2 horas de anticipación por WhatsApp al 246 147 3968 para que podamos reagendar tu lugar.'
  },
  {
    question: '¿Tienen servicio para niños?',
    answer: 'Sí, contamos con cortes especiales para los pequeños. Traen su propio estilo y actitud, nosotros nos encargamos del resto.'
  },
  {
    question: '¿Hacen diseños y figuras en el cabello?',
    answer: '¡Por supuesto! Es una de nuestras especialidades. Rayas, figuras geométricas, logos y arte personalizado en el cabello.'
  },
  {
    question: '¿Trabajan con citas o por orden de llegada?',
    answer: 'Trabajamos principalmente con citas programadas para respetar tu tiempo. Sin embargo, aceptamos walk-ins si hay disponibilidad.'
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i)
  }

  return (
    <section id="faq" className="py-24 sm:py-32 relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-street-blue/40 to-transparent" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-street-blue/10 border border-street-blue/20 mb-6">
            <FaQuestionCircle className="text-street-blue" />
            <span className="text-street-blue text-sm font-bold uppercase tracking-wider">Preguntas Frecuentes</span>
          </div>
          <h2 className="graffiti-text text-3xl sm:text-5xl md:text-6xl text-gradient mb-4">
            ¿Tienes Dudas?
          </h2>
          <p className="text-ice-dim text-base sm:text-lg">
            Aquí respondemos lo más común. Si no encuentras lo que buscas, contáctanos.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`glass-card rounded-2xl border transition-colors overflow-hidden ${
                openIndex === i ? 'border-street-green/40 shadow-[0_0_20px_rgba(0,255,136,0.1)]' : 'border-dark-border hover:border-street-green/20'
              }`}
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    openIndex === i ? 'bg-street-green/20 text-street-green' : 'bg-dark-lighter text-ice-dim'
                  }`}>
                    <FaQuestionCircle />
                  </div>
                  <span className="font-bold text-ice text-sm sm:text-base pr-4">{faq.question}</span>
                </div>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex-shrink-0 ${openIndex === i ? 'text-street-green' : 'text-ice-dim'}`}
                >
                  <FaChevronDown />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 pl-[4.5rem]">
                      <p className="text-ice-dim text-sm sm:text-base leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
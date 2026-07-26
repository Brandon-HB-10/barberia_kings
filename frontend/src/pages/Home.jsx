import { useState, useEffect } from 'react'
import {
  motion,
  useScroll,
  useTransform
} from 'framer-motion'

import {
  FaStar,
  FaCut,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaPhone,
  FaWhatsapp,
  FaCheckCircle,
  FaFire,
  FaGem,
  FaSprayCan,
  FaInstagram,
  FaArrowRight
} from 'react-icons/fa'

import api from '../axios'
import FAQ from '../components/FAQ'
import Testimonials from '../components/Testimonials'
import Gallery from '../components/Gallery'


function Home() {
  const [servicios, setServicios] = useState([])
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    cliente_nombre: '',
    cliente_telefono: '',
    cliente_email: '',
    servicio_id: '',
    servicio_nombre: '',
    fecha: '',
    hora: '',
    notas: ''
  })

  const [horarios, setHorarios] = useState([])
  const [loadingHorarios, setLoadingHorarios] = useState(false)

  const [mensaje, setMensaje] = useState({
    tipo: '',
    texto: ''
  })

  const [submitting, setSubmitting] = useState(false)
  const [selectedService, setSelectedService] = useState(null)


  const { scrollYProgress } = useScroll()

  const heroOpacity = useTransform(
    scrollYProgress,
    [0, 0.15],
    [1, 0]
  )

  const heroScale = useTransform(
    scrollYProgress,
    [0, 0.15],
    [1, 0.95]
  )

  const heroY = useTransform(
    scrollYProgress,
    [0, 0.15],
    [0, -50]
  )



  useEffect(() => {
  cargarServicios()
}, [])


  useEffect(() => {
    if (formData.fecha) {
      cargarHorasDisponibles(
        formData.fecha
      )
    } else {
      setHorarios([])
    }
  }, [formData.fecha])


  const cargarServicios = async () => {
    try {
      const response = await api.get(
        '/servicios'
      )

      setServicios(response.data)

    } catch (error) {
      console.error(
        'Error cargando servicios:',
        error
      )

    } finally {
      setLoading(false)
    }
  }


  const cargarHorasDisponibles = async (fecha) => {
    setLoadingHorarios(true)

    try {
      const response = await api.get(
        `/citas/disponibles?fecha=${fecha}`
      )

      setHorarios(
        response.data.horarios || []
      )

    } catch (error) {
      console.error(
        'Error cargando horarios:',
        error
      )

      setHorarios([])

    } finally {
      setLoadingHorarios(false)
    }
  }


  const handleServicioChange = (event) => {
    const servicio = servicios.find(
      (item) => (
        item.id === parseInt(
          event.target.value,
          10
        )
      )
    )

    setFormData({
      ...formData,
      servicio_id: event.target.value,
      servicio_nombre: servicio
        ? servicio.nombre
        : ''
    })

    setSelectedService(
      servicio || null
    )
  }


  const handleSubmit = async (event) => {
    event.preventDefault()

    setSubmitting(true)

    setMensaje({
      tipo: '',
      texto: ''
    })

    try {
      await api.post(
        '/citas',
        formData
      )

      setMensaje({
        tipo: 'success',
        texto: (
          '¡Cita agendada con éxito! ' +
          'Te esperamos en Clipper Kings.'
        )
      })

      setFormData({
        cliente_nombre: '',
        cliente_telefono: '',
        cliente_email: '',
        servicio_id: '',
        servicio_nombre: '',
        fecha: '',
        hora: '',
        notas: ''
      })

      setSelectedService(null)
      setHorarios([])

    } catch (error) {
      /*
       * Si alguien tomó el último espacio justo antes
       * de que el cliente confirmara, actualizamos
       * nuevamente los horarios.
       */
      if (
        error.response?.status === 409
        && formData.fecha
      ) {
        await cargarHorasDisponibles(
          formData.fecha
        )

        setFormData((datosAnteriores) => ({
          ...datosAnteriores,
          hora: ''
        }))
      }

      setMensaje({
        tipo: 'error',
        texto: (
          error.response?.data?.detail
          || 'Error al agendar. Intenta de nuevo.'
        )
      })

    } finally {
      setSubmitting(false)
    }
  }


  const fadeInUp = {
    hidden: {
      opacity: 0,
      y: 50
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }


  const staggerContainer = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  }


  const scaleIn = {
    hidden: {
      opacity: 0,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'backOut'
      }
    }
  }


  const serviceIcons = [
    <FaCut key="cut" />,
    <FaGem key="gem" />,
    <FaFire key="fire" />,
    <FaSprayCan key="spray" />,
    <FaCheckCircle key="check" />,
    <FaCut key="cut2" />,
    <FaGem key="gem2" />,
    <FaFire key="fire2" />
  ]


  const scrollToSection = (id) => {
    const section = document.querySelector(id)

    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }


  const stats = [
    {
      icon: FaStar,
      label: 'Calificación',
      value: '4.7/5'
    },
    {
      icon: FaCut,
      label: 'Servicios',
      value: '8+'
    },
    {
      icon: FaClock,
      label: 'Horario',
      value: '11AM - 8PM'
    },
    {
      icon: FaMapMarkerAlt,
      label: 'Ubicación',
      value: 'C. 2 de Abril 305'
    }
  ]


  return (
    <div className="overflow-x-hidden bg-dark">
      {/* ===== PARTÍCULAS DEL FONDO ===== */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(6)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full opacity-[0.035] blur-3xl"
            style={{
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              background: '#65FFC5',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.5
            }}
          />
        ))}
      </div>


      {/* ===== HERO EDITORIAL ===== */}
      <motion.section
        id="inicio"
        style={{
          opacity: heroOpacity,
          scale: heroScale,
          y: heroY
        }}
        className="relative min-h-screen px-3 pb-6 pt-24 sm:px-5 lg:px-6"
      >
        <div className="editorial-hero relative mx-auto min-h-[calc(100vh-7.5rem)] max-w-[1600px] overflow-hidden rounded-[1.75rem] border border-white/10 sm:rounded-[2.25rem]">
          <div className="editorial-hero-grid absolute inset-0" />
          <div className="editorial-hero-haze absolute inset-0" />

          <div className="relative z-10 flex min-h-[calc(100vh-7.5rem)] flex-col px-6 pb-7 pt-8 sm:px-10 sm:pb-9 sm:pt-10 lg:px-14 lg:pb-10 lg:pt-12 xl:px-16">
            <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-8">

              {/* Título editorial */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 32
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  duration: 0.85,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="lg:col-span-7"
              >
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 12
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  transition={{
                    delay: 0.15,
                    duration: 0.55
                  }}
                  className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 backdrop-blur-md"
                >
                  <span className="h-2 w-2 rounded-full bg-street-green" />

                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ice-dim">
                    Abierto ahora · Apizaco
                  </span>
                </motion.div>

                <h1
                  className="editorial-title"
                  aria-label="Clipper Kings"
                >
                  <span className="editorial-title-sans">
                    Clipper
                  </span>

                  <span className="editorial-title-serif">
                    Kings.
                  </span>
                </h1>
              </motion.div>


              {/* Mensaje, reputación y acciones */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 28
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  delay: 0.25,
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="lg:col-span-5 lg:ml-auto lg:max-w-[470px] lg:pt-24 xl:pt-28"
              >
                <p className="text-xl font-medium leading-[1.18] text-ice sm:text-2xl lg:text-[1.7rem]">
                  Precisión, estilo y una experiencia creada

                  <span className="text-ice-dim">
                    {' '}
                    con intención, detalle y actitud.
                  </span>
                </p>

                <div className="my-7 h-px bg-white/10" />

                <div className="mb-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                  <div className="flex items-center gap-1.5 text-ice">
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        className={`text-xs ${
                          index < 4
                            ? 'text-white'
                            : 'text-white/30'
                        }`}
                      />
                    ))}
                  </div>

                  <span className="font-medium text-ice">
                    4.7
                  </span>

                  <span className="text-ice-dim">
                    23 opiniones reales
                  </span>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <motion.button
                    type="button"
                    onClick={() => (
                      scrollToSection('#reservar')
                    )}
                    whileHover={{
                      y: -2
                    }}
                    whileTap={{
                      scale: 0.98
                    }}
                    className="btn-primary min-h-12 gap-3 px-6"
                  >
                    Reservar cita

                    <FaArrowRight className="text-sm" />
                  </motion.button>

                  <motion.a
                    href="https://wa.me/522411327555?text=Hola%2C%20vi%20tu%20demo%20para%20barber%C3%ADas%20y%20me%20interesa%20una%20p%C3%A1gina%20similar."
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{
                      y: -2
                    }}
                    whileTap={{
                      scale: 0.98
                    }}
                    className="btn-secondary min-h-12 gap-3 px-6"
                  >
                    <FaWhatsapp />

                    WhatsApp
                  </motion.a>
                </div>
              </motion.div>
            </div>


            {/* Objeto central */}
            <motion.div
                initial={{
                  opacity: 0,
                  y: 70,
                  scale: 0.88
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1
                }}
                transition={{
                  delay: 0.4,
                  duration: 1.05,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="editorial-object-wrap"
                aria-hidden="true"
              >
                <div className="editorial-object">
                  <div className="editorial-object-ring editorial-object-ring-one" />
                  <div className="editorial-object-ring editorial-object-ring-two" />

                  <div className="editorial-object-core">
                    <FaCut className="editorial-object-icon" />
                  </div>
                </div>
              </motion.div>


            <div className="mt-auto pt-20 sm:pt-24 lg:pt-36">
              <div className="grid gap-7 border-t border-white/10 pt-6 md:grid-cols-[1fr_auto_1fr] md:items-end">
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 18
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  transition={{
                    delay: 0.65,
                    duration: 0.6
                  }}
                >
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-ice-dim">
                    Especialistas en
                  </p>

                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-ice">
                    <span>Cortes</span>
                    <span className="text-ice-dim">/</span>
                    <span>Barba</span>
                    <span className="text-ice-dim">/</span>
                    <span>Diseño</span>
                    <span className="text-ice-dim">/</span>
                    <span>Color</span>
                  </div>
                </motion.div>

                <button
                  type="button"
                  onClick={() => (
                    scrollToSection('#servicios')
                  )}
                  className="editorial-scroll mx-auto hidden h-12 w-24 items-center justify-center rounded-full border border-white/10 text-xl text-ice-dim transition hover:border-white/25 hover:text-white md:flex"
                  aria-label="Ver servicios"
                >
                  ↓
                </button>

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 18
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  transition={{
                    delay: 0.75,
                    duration: 0.6
                  }}
                  className="md:text-right"
                >
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-ice-dim">
                    Síguenos
                  </p>

                  <a
                    href="https://instagram.com/bran.hb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-ice transition hover:text-street-green"
                  >
                    <FaInstagram />

                    @bran.hb
                  </a>
                </motion.div>
              </div>


              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 lg:grid-cols-4"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="editorial-stat bg-[#0b0b0b]/95 px-4 py-4 sm:px-5"
                  >
                    <div className="mb-1 flex items-center gap-2 text-xs text-ice-dim">
                      <stat.icon className="text-white/65" />

                      <span>
                        {stat.label}
                      </span>
                    </div>

                    <p className="font-display text-sm font-semibold text-ice sm:text-base">
                      {stat.value}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>


      {/* ===== SERVICIOS ===== */}
      <section
        id="servicios"
        className="py-24 sm:py-32 relative"
      >
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-street-green/40 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              margin: '-100px'
            }}
            className="text-center mb-16"
          >
            <motion.div
              variants={scaleIn}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-street-green/10 border border-street-green/20 mb-6"
            >
              <FaCut className="text-street-green" />

              <span className="text-street-green text-sm font-bold uppercase tracking-wider">
                Nuestros Servicios
              </span>
            </motion.div>

            <h2 className="graffiti-text text-3xl sm:text-5xl md:text-6xl text-gradient mb-4">
              Estilo Callejero
            </h2>

            <p className="text-ice-dim text-base sm:text-lg max-w-2xl mx-auto">
              Cada corte es una pieza de arte urbano.
              Descubre lo que tenemos para ti.
            </p>
          </motion.div>


          {loading ? (
            <div className="flex justify-center py-12">
              <motion.div
                animate={{
                  rotate: 360
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'linear'
                }}
                className="w-14 h-14 border-4 border-street-green border-t-transparent rounded-full shadow-[0_0_15px_rgba(0,255,136,0.3)]"
              />
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                margin: '-50px'
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
            >
              {servicios.map((servicio, index) => (
                <motion.div
                  key={servicio.id}
                  variants={fadeInUp}
                  whileHover={{
                    y: -10,
                    scale: 1.02,
                    transition: {
                      type: 'spring',
                      stiffness: 300,
                      damping: 20
                    }
                  }}
                  className={`glass-card rounded-2xl p-6 card-hover-strong group cursor-pointer relative overflow-hidden ${
                    selectedService?.id === servicio.id
                      ? 'border-street-green/50 shadow-[0_0_30px_rgba(0,255,136,0.15)]'
                      : ''
                  }`}
                  onClick={() => {
                    setSelectedService(servicio)

                    setFormData({
                      ...formData,
                      servicio_id: servicio.id,
                      servicio_nombre: servicio.nombre
                    })

                    document
                      .getElementById('reservar')
                      ?.scrollIntoView({
                        behavior: 'smooth'
                      })
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-street-green/5 via-transparent to-street-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <motion.div
                    whileHover={{
                      scale: 1.15,
                      rotate: 5
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 400
                    }}
                    className="w-14 h-14 rounded-xl bg-gradient-to-br from-street-green/20 to-street-blue/20 flex items-center justify-center mb-5 group-hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-shadow relative"
                  >
                    <span className="text-street-green text-2xl">
                      {
                        serviceIcons[
                          index % serviceIcons.length
                        ]
                      }
                    </span>
                  </motion.div>

                  <h3 className="font-orbitron font-bold text-lg sm:text-xl text-ice mb-2 group-hover:text-street-green transition-colors relative">
                    {servicio.nombre}
                  </h3>

                  <p className="text-ice-dim text-sm mb-5 line-clamp-2 relative">
                    {servicio.descripcion}
                  </p>

                  <div className="flex items-center justify-between relative">
                    <span className="font-orbitron font-bold text-2xl text-street-green drop-shadow-[0_0_8px_rgba(0,255,136,0.3)]">
                      ${servicio.precio}
                    </span>

                    <span className="text-ice-dim text-xs sm:text-sm flex items-center gap-1.5 bg-dark-lighter px-3 py-1 rounded-full">
                      <FaClock className="text-street-blue" />

                      {servicio.duracion_min} min
                    </span>
                  </div>

                  {selectedService?.id === servicio.id && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        height: 0
                      }}
                      animate={{
                        opacity: 1,
                        height: 'auto'
                      }}
                      className="mt-4 pt-4 border-t border-street-green/20 relative"
                    >
                      <span className="text-street-green text-xs font-bold flex items-center gap-1.5 uppercase tracking-wide">
                        <FaCheckCircle />

                        Seleccionado
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>


      {/* ===== GALERÍA ===== */}
      <Gallery />


      {/* ===== TESTIMONIOS ===== */}
      <Testimonials />


      {/* ===== FAQ ===== */}
      <FAQ />


      {/* ===== RESERVAR ===== */}
      <section
        id="reservar"
        className="py-24 sm:py-32 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-street-green/5 to-transparent" />

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-street-green/5 rounded-full blur-[150px]" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true
            }}
            className="text-center mb-14"
          >
            <motion.div
              variants={scaleIn}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-street-green/10 border border-street-green/20 mb-6"
            >
              <FaCalendarAlt className="text-street-green" />

              <span className="text-street-green text-sm font-bold uppercase tracking-wider">
                Reserva tu Cita
              </span>
            </motion.div>

            <h2 className="graffiti-text text-3xl sm:text-5xl md:text-6xl text-gradient mb-4">
              Agenda tu Momento
            </h2>

            <p className="text-ice-dim text-base sm:text-lg">
              Rápido, fácil y sin complicaciones.
              Tu estilo te espera.
            </p>
          </motion.div>


          <motion.div
            initial={{
              opacity: 0,
              y: 40
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.8
            }}
            className="glass-card-strong rounded-3xl p-6 sm:p-8 md:p-12 neon-border-strong relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-street-green/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />


            {mensaje.texto && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -10,
                  scale: 0.95
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1
                }}
                className={`mb-6 p-4 rounded-xl text-center text-sm sm:text-base font-bold ${
                  mensaje.tipo === 'success'
                    ? 'bg-street-green/10 text-street-green border border-street-green/30'
                    : 'bg-street-red/10 text-street-red border border-street-red/30'
                }`}
              >
                {mensaje.texto}
              </motion.div>
            )}


            <form
              onSubmit={handleSubmit}
              className="space-y-5 relative"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="group">
                  <label className="block text-sm font-bold text-ice mb-2 group-focus-within:text-street-green transition-colors">
                    Nombre completo *
                  </label>

                  <input
                    type="text"
                    required
                    value={formData.cliente_nombre}
                    onChange={(event) => (
                      setFormData({
                        ...formData,
                        cliente_nombre: event.target.value
                      })
                    )}
                    className="input-field"
                    placeholder="Tu nombre"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-bold text-ice mb-2 group-focus-within:text-street-green transition-colors">
                    Teléfono *
                  </label>

                  <input
                    type="tel"
                    required
                    value={formData.cliente_telefono}
                    onChange={(event) => (
                      setFormData({
                        ...formData,
                        cliente_telefono: event.target.value
                      })
                    )}
                    className="input-field"
                    placeholder="246 147 3968"
                  />
                </div>
              </div>


              <div className="group">
                <label className="block text-sm font-bold text-ice mb-2 group-focus-within:text-street-green transition-colors">
                  Email (opcional)
                </label>

                <input
                  type="email"
                  value={formData.cliente_email}
                  onChange={(event) => (
                    setFormData({
                      ...formData,
                      cliente_email: event.target.value
                    })
                  )}
                  className="input-field"
                  placeholder="tu@email.com"
                />
              </div>


              <div className="group">
                <label className="block text-sm font-bold text-ice mb-2 group-focus-within:text-street-green transition-colors">
                  Servicio *
                </label>

                <select
                  required
                  value={formData.servicio_id}
                  onChange={handleServicioChange}
                  className="input-field cursor-pointer"
                >
                  <option value="">
                    Selecciona un servicio
                  </option>

                  {servicios.map((servicio) => (
                    <option
                      key={servicio.id}
                      value={servicio.id}
                    >
                      {servicio.nombre} - ${servicio.precio}
                    </option>
                  ))}
                </select>
              </div>


              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="group">
                  <label className="block text-sm font-bold text-ice mb-2 group-focus-within:text-street-green transition-colors">
                    Fecha *
                  </label>

                  <input
                    type="date"
                    required
                    min={
                      new Date()
                        .toISOString()
                        .split('T')[0]
                    }
                    value={formData.fecha}
                    onChange={(event) => (
                      setFormData({
                        ...formData,
                        fecha: event.target.value,
                        hora: ''
                      })
                    )}
                    className="input-field"
                  />
                </div>


                <div className="group">
                  <label className="block text-sm font-bold text-ice mb-2 group-focus-within:text-street-green transition-colors">
                    Hora *
                  </label>

                  <select
                    required
                    value={formData.hora}
                    onChange={(event) => (
                      setFormData({
                        ...formData,
                        hora: event.target.value
                      })
                    )}
                    className="input-field cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={
                      !formData.fecha
                      || loadingHorarios
                    }
                  >
                    <option value="">
                      {!formData.fecha
                        ? 'Primero elige una fecha'
                        : loadingHorarios
                          ? 'Cargando horarios...'
                          : 'Selecciona una hora'
                      }
                    </option>

                    {horarios.map((horario) => {
                      const espacios = (
                        horario.espacios_disponibles
                      )

                      const textoDisponibilidad = (
                        espacios === 1
                          ? '1 espacio disponible'
                          : `${espacios} espacios disponibles`
                      )

                      return (
                        <option
                          key={horario.hora}
                          value={horario.hora}
                          disabled={!horario.disponible}
                        >
                          {horario.hora} —{' '}
                          {horario.disponible
                            ? textoDisponibilidad
                            : 'Ocupado'
                          }
                        </option>
                      )
                    })}
                  </select>

                  {formData.fecha && !loadingHorarios && (
                    <p className="mt-2 text-xs text-ice-dim">
                      Cada horario cuenta con un máximo
                      de 3 espacios disponibles.
                    </p>
                  )}
                </div>
              </div>


              <div className="group">
                <label className="block text-sm font-bold text-ice mb-2 group-focus-within:text-street-green transition-colors">
                  Notas (opcional)
                </label>

                <textarea
                  rows={3}
                  value={formData.notas}
                  onChange={(event) => (
                    setFormData({
                      ...formData,
                      notas: event.target.value
                    })
                  )}
                  className="input-field resize-none"
                  placeholder="¿Algo especial que debamos saber?"
                />
              </div>


              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{
                  scale: 1.02,
                  boxShadow: (
                    '0 0 30px rgba(0,255,136,0.3)'
                  )
                }}
                whileTap={{
                  scale: 0.98
                }}
                className="w-full btn-primary btn-glow text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed shine-sweep"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2 relative z-10">
                    <motion.div
                      animate={{
                        rotate: 360
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear'
                      }}
                      className="w-5 h-5 border-2 border-dark border-t-transparent rounded-full"
                    />

                    Agendando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2 relative z-10">
                    <FaCalendarAlt />

                    Confirmar Reserva
                  </span>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>


      {/* ===== CTA FINAL ===== */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-street-green/10 rounded-full" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9
            }}
            whileInView={{
              opacity: 1,
              scale: 1
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.8
            }}
            className="glass-card-strong rounded-3xl p-8 sm:p-14 neon-border-strong relative overflow-hidden"
          >
            <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-street-green/10 rounded-full blur-[80px]" />

            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/[0.03] rounded-full blur-[80px]" />
          </div>

            <div className="relative z-10">
              <motion.h2
                initial={{
                  opacity: 0,
                  y: 20
                }}
                whileInView={{
                  opacity: 1,
                  y: 0
                }}
                viewport={{
                  once: true
                }}
                className="graffiti-text text-2xl sm:text-4xl md:text-5xl text-gradient mb-4"
              >
                ¿Listo para tu nuevo look?
              </motion.h2>

              <motion.p
                initial={{
                  opacity: 0
                }}
                whileInView={{
                  opacity: 1
                }}
                viewport={{
                  once: true
                }}
                transition={{
                  delay: 0.2
                }}
                className="text-ice-dim text-base sm:text-lg mb-10"
              >
                No esperes más.
                Tu estilo te está llamando.
              </motion.p>

              <motion.div
                initial={{
                  opacity: 0,
                  y: 20
                }}
                whileInView={{
                  opacity: 1,
                  y: 0
                }}
                viewport={{
                  once: true
                }}
                transition={{
                  delay: 0.4
                }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <motion.button
                  type="button"
                  onClick={() => (
                    scrollToSection('#reservar')
                  )}
                  whileHover={{
                    scale: 1.05
                  }}
                  whileTap={{
                    scale: 0.95
                  }}
                  className="btn-primary btn-glow text-lg px-8 py-4 flex items-center gap-2 shine-sweep"
                >
                  <FaCalendarAlt />

                  <span className="relative z-10">
                    Agendar Ahora
                  </span>
                </motion.button>

                <motion.a
                  href="tel:2461473968"
                  whileHover={{
                    scale: 1.05
                  }}
                  whileTap={{
                    scale: 0.95
                  }}
                  className="btn-secondary text-lg px-8 py-4 flex items-center gap-2"
                >
                  <FaPhone />

                  Llamar
                </motion.a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}


export default Home
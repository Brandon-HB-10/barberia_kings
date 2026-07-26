import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaCalendarAlt, FaCheckCircle, FaClock, FaTimes, FaWhatsapp, 
  FaPlus, FaSignOutAlt, FaCut, FaTrash, FaChevronDown, FaChevronUp,
  FaUser, FaPhone, FaEnvelope, FaStickyNote, FaMoneyBillWave
} from 'react-icons/fa'
import api from '../axios'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [citas, setCitas] = useState([])
  const [servicios, setServicios] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('citas')
  const [showAgendar, setShowAgendar] = useState(false)
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' })
  const [expandedCita, setExpandedCita] = useState(null)

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
  const [horasOcupadas, setHorasOcupadas] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) {
      navigate('/admin')
      return
    }
    cargarDatos()
  }, [token])

  useEffect(() => {
    if (formData.fecha) {
      cargarHorasDisponibles(formData.fecha)
    }
  }, [formData.fecha])

  const cargarDatos = async () => {
    try {
      const [resCitas, resServicios] = await Promise.all([
        api.get('/citas', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/servicios')
      ])
      setCitas(resCitas.data)
      setServicios(resServicios.data)
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token')
        navigate('/admin')
      }
    } finally {
      setLoading(false)
    }
  }

  const cargarHorasDisponibles = async (fecha) => {
  try {
    const res = await api.get(`/citas/disponibles?fecha=${fecha}`)

    const horariosRespuesta = Array.isArray(res.data.horarios)
      ? res.data.horarios
      : []

    const horasCompletamenteOcupadas = horariosRespuesta
      .filter((horario) => !horario.disponible)
      .map((horario) => horario.hora)

    setHorasOcupadas(horasCompletamenteOcupadas)
  } catch (err) {
    console.error('Error cargando horas:', err)
    setHorasOcupadas([])
  }
}

  const handleServicioChange = (e) => {
    const servicio = servicios.find(s => s.id === parseInt(e.target.value))
    setFormData({
      ...formData,
      servicio_id: e.target.value,
      servicio_nombre: servicio ? servicio.nombre : ''
    })
  }

  const handleAgendarAdmin = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMensaje({ tipo: '', texto: '' })

    try {
      await api.post('/citas', {
        ...formData,
        agendado_por: 'admin'
      })
      setMensaje({ tipo: 'success', texto: '¡Cita agendada con éxito!' })
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
      setHorasOcupadas([])
      cargarDatos()
      setTimeout(() => setShowAgendar(false), 1500)
    } catch (err) {
      setMensaje({
        tipo: 'error',
        texto: err.response?.data?.detail || 'Error al agendar.'
      })
    } finally {
      setSubmitting(false)
    }
  }

  const actualizarEstado = async (id, estado) => {
    try {
      await api.put(`/citas/${id}/estado`, { estado }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      cargarDatos()
    } catch (err) {
      console.error(err)
    }
  }

  const eliminarCita = async (id) => {
    if (!confirm('¿Eliminar esta cita permanentemente?')) return
    try {
      await api.delete(`/citas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      cargarDatos()
    } catch (err) {
      console.error(err)
    }
  }

  const confirmarWhatsApp = (cita) => {
    const telefono = cita.cliente_telefono.replace(/\D/g, '')
    const mensaje = `Hola ${cita.cliente_nombre}, tu cita en *Clipper Kings* ha sido confirmada.\n\n📅 Fecha: ${cita.fecha}\n⏰ Hora: ${cita.hora}\n✂️ Servicio: ${cita.servicio_nombre}\n\nNos vemos pronto. ¡Gracias por confiar en nosotros! 🔥`
    const url = `https://wa.me/52${telefono}?text=${encodeURIComponent(mensaje)}`
    window.open(url, '_blank')
  }

  const cerrarSesion = () => {
    localStorage.removeItem('token')
    navigate('/admin')
  }

  const horasDisponibles = []
  for (let h = 11; h < 20; h++) {
    for (let m = 0; m < 60; m += 30) {
      const horaStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
      if (!(horasOcupadas ?? []).includes(horaStr)) {
        horasDisponibles.push(horaStr)
      }
    }
  }

  const stats = {
    total: citas.length,
    pendientes: citas.filter(c => c.estado === 'pendiente').length,
    completadas: citas.filter(c => c.estado === 'completada').length,
    canceladas: citas.filter(c => c.estado === 'cancelada').length,
  }

  const citasFiltradas = activeTab === 'citas' 
    ? citas 
    : citas.filter(c => c.estado === activeTab.slice(0, -1))

  const getStatusColor = (estado) => {
    switch(estado) {
      case 'pendiente': return 'bg-street-orange/20 text-street-orange border-street-orange/30'
      case 'completada': return 'bg-street-green/20 text-street-green border-street-green/30'
      case 'cancelada': return 'bg-street-red/20 text-street-red border-street-red/30'
      default: return 'bg-dark-lighter text-ice-dim border-dark-border'
    }
  }

  const getStatusIcon = (estado) => {
    switch(estado) {
      case 'pendiente': return <FaClock />
      case 'completada': return <FaCheckCircle />
      case 'cancelada': return <FaTimes />
      default: return <FaCalendarAlt />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-14 h-14 border-4 border-street-green border-t-transparent rounded-full shadow-[0_0_15px_rgba(0,255,136,0.3)]"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4"
        >
          <div>
            <h1 className="graffiti-text text-3xl sm:text-4xl text-gradient mb-1">Panel de Control</h1>
            <p className="text-ice-dim text-sm">Gestiona tus citas y servicios — Clipper Kings</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={cerrarSesion}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-street-red/10 text-street-red border border-street-red/30 font-bold text-sm hover:bg-street-red/20 transition-colors"
          >
            <FaSignOutAlt /> Cerrar Sesión
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          {[
            { label: 'Total Citas', value: stats.total, icon: FaCalendarAlt, color: 'text-street-blue', bg: 'bg-street-blue/10', border: 'border-street-blue/20' },
            { label: 'Pendientes', value: stats.pendientes, icon: FaClock, color: 'text-street-orange', bg: 'bg-street-orange/10', border: 'border-street-orange/20' },
            { label: 'Completadas', value: stats.completadas, icon: FaCheckCircle, color: 'text-street-green', bg: 'bg-street-green/10', border: 'border-street-green/20' },
            { label: 'Canceladas', value: stats.canceladas, icon: FaTimes, color: 'text-street-red', bg: 'bg-street-red/10', border: 'border-street-red/20' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, scale: 1.02 }}
              className={`glass-card rounded-2xl p-5 border ${stat.border} relative overflow-hidden`}
            >
              <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon />
              </div>
              <p className="font-orbitron font-bold text-2xl text-ice">{stat.value}</p>
              <p className="text-ice-dim text-xs mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center gap-3 mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAgendar(!showAgendar)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-street-green to-street-blue text-dark font-bold rounded-xl shadow-[0_0_20px_rgba(0,255,136,0.3)] hover:shadow-[0_0_30px_rgba(0,255,136,0.5)] transition-all"
          >
            <FaPlus /> {showAgendar ? 'Cancelar' : 'Agendar Cita'}
          </motion.button>
        </motion.div>

        {/* Formulario Agendar desde Admin */}
        <AnimatePresence>
          {showAgendar && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-10 overflow-hidden"
            >
              <div className="glass-card-strong rounded-3xl p-6 sm:p-8 neon-border-strong">
                <h3 className="font-orbitron font-bold text-xl text-gradient mb-6 flex items-center gap-2">
                  <FaCalendarAlt className="text-street-green" /> Nueva Cita (Admin)
                </h3>

                {mensaje.texto && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`mb-6 p-4 rounded-xl text-center text-sm font-bold ${
                      mensaje.tipo === 'success' 
                        ? 'bg-street-green/10 text-street-green border border-street-green/30' 
                        : 'bg-street-red/10 text-street-red border border-street-red/30'
                    }`}
                  >
                    {mensaje.texto}
                  </motion.div>
                )}

                <form onSubmit={handleAgendarAdmin} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-ice mb-1.5">Nombre completo *</label>
                      <input type="text" required value={formData.cliente_nombre}
                        onChange={(e) => setFormData({...formData, cliente_nombre: e.target.value})}
                        className="input-field text-sm py-2.5" placeholder="Nombre del cliente" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ice mb-1.5">Teléfono *</label>
                      <input type="tel" required value={formData.cliente_telefono}
                        onChange={(e) => setFormData({...formData, cliente_telefono: e.target.value})}
                        className="input-field text-sm py-2.5" placeholder="246 147 3968" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-ice mb-1.5">Email (opcional)</label>
                      <input type="email" value={formData.cliente_email}
                        onChange={(e) => setFormData({...formData, cliente_email: e.target.value})}
                        className="input-field text-sm py-2.5" placeholder="email@ejemplo.com" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ice mb-1.5">Servicio *</label>
                      <select required value={formData.servicio_id} onChange={handleServicioChange}
                        className="input-field text-sm py-2.5 cursor-pointer">
                        <option value="">Selecciona servicio</option>
                        {servicios.map(s => (
                          <option key={s.id} value={s.id}>{s.nombre} - ${s.precio}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-ice mb-1.5">Fecha *</label>
                      <input type="date" required min={new Date().toISOString().split('T')[0]}
                        value={formData.fecha}
                        onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                        className="input-field text-sm py-2.5" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ice mb-1.5">Hora *</label>
                      <select required value={formData.hora}
                        onChange={(e) => setFormData({...formData, hora: e.target.value})}
                        className="input-field text-sm py-2.5 cursor-pointer" disabled={!formData.fecha}>
                        <option value="">{formData.fecha ? 'Selecciona hora' : 'Primero elige fecha'}</option>
                        {horasDisponibles.map(h => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ice mb-1.5">Notas</label>
                    <textarea rows={2} value={formData.notas}
                      onChange={(e) => setFormData({...formData, notas: e.target.value})}
                      className="input-field text-sm resize-none" placeholder="Notas adicionales..." />
                  </div>

                  <motion.button type="submit" disabled={submitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full btn-primary btn-glow py-3 disabled:opacity-50 font-bold text-sm">
                    {submitting ? 'Agendando...' : 'Confirmar Cita'}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {[
            { key: 'citas', label: 'Todas', icon: FaCalendarAlt },
            { key: 'pendientes', label: 'Pendientes', icon: FaClock },
            { key: 'completadas', label: 'Completadas', icon: FaCheckCircle },
            { key: 'canceladas', label: 'Canceladas', icon: FaTimes },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.key
                  ? 'bg-street-green text-dark shadow-[0_0_15px_rgba(0,255,136,0.3)]'
                  : 'bg-dark-lighter text-ice-dim border border-dark-border hover:border-street-green/30'
              }`}
            >
              <tab.icon /> {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Lista de Citas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {citasFiltradas.length === 0 ? (
            <div className="glass-card rounded-3xl p-16 text-center">
              <FaCalendarAlt className="text-ice-dim/20 text-6xl mx-auto mb-4" />
              <p className="text-ice-dim text-lg">No hay citas registradas aún</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {citasFiltradas.map((cita, i) => (
                  <motion.div
                    key={cita.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: i * 0.03 }}
                    className="glass-card rounded-2xl border border-dark-border hover:border-street-green/30 transition-all overflow-hidden"
                  >
                    {/* Header de la cita */}
                    <div 
                      className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer"
                      onClick={() => setExpandedCita(expandedCita === cita.id ? null : cita.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${getStatusColor(cita.estado)}`}>
                          {getStatusIcon(cita.estado)}
                        </div>
                        <div>
                          <h4 className="font-bold text-ice">{cita.cliente_nombre}</h4>
                          <p className="text-ice-dim text-xs flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-1"><FaCalendarAlt className="text-street-green" /> {cita.fecha}</span>
                            <span className="flex items-center gap-1"><FaClock className="text-street-blue" /> {cita.hora}</span>
                            <span className="flex items-center gap-1"><FaCut className="text-street-gold" /> {cita.servicio_nombre}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        {cita.estado === 'pendiente' && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => { e.stopPropagation(); confirmarWhatsApp(cita); }}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-street-green/10 text-street-green border border-street-green/30 text-xs font-bold hover:bg-street-green/20 transition-colors"
                            >
                              <FaWhatsapp /> Confirmar
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => { e.stopPropagation(); actualizarEstado(cita.id, 'completada'); }}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-street-blue/10 text-street-blue border border-street-blue/30 text-xs font-bold hover:bg-street-blue/20 transition-colors"
                            >
                              <FaCheckCircle /> Completar
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => { e.stopPropagation(); actualizarEstado(cita.id, 'cancelada'); }}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-street-red/10 text-street-red border border-street-red/30 text-xs font-bold hover:bg-street-red/20 transition-colors"
                            >
                              <FaTimes /> Cancelar
                            </motion.button>
                          </>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => { e.stopPropagation(); eliminarCita(cita.id); }}
                          className="w-9 h-9 rounded-lg bg-dark-lighter border border-dark-border flex items-center justify-center text-ice-dim hover:text-street-red hover:border-street-red transition-colors"
                        >
                          <FaTrash className="text-xs" />
                        </motion.button>
                        <div className="hidden sm:block text-ice-dim">
                          {expandedCita === cita.id ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                      </div>
                    </div>

                    {/* Detalles expandibles */}
                    <AnimatePresence>
                      {expandedCita === cita.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 pt-2 border-t border-dark-border">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                              <div className="flex items-center gap-2 text-ice-dim">
                                <FaUser className="text-street-green" />
                                <span className="text-ice">{cita.cliente_nombre}</span>
                              </div>
                              <div className="flex items-center gap-2 text-ice-dim">
                                <FaPhone className="text-street-blue" />
                                <a href={`tel:${cita.cliente_telefono}`} className="text-ice hover:text-street-green transition-colors">{cita.cliente_telefono}</a>
                              </div>
                              {cita.cliente_email && (
                                <div className="flex items-center gap-2 text-ice-dim">
                                  <FaEnvelope className="text-street-gold" />
                                  <span className="text-ice">{cita.cliente_email}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2 text-ice-dim">
                                <FaMoneyBillWave className="text-street-gold" />
                                <span className="text-ice">{cita.servicio_nombre}</span>
                              </div>
                              {cita.notas && (
                                <div className="flex items-start gap-2 text-ice-dim sm:col-span-2">
                                  <FaStickyNote className="text-street-orange mt-0.5" />
                                  <span className="text-ice">{cita.notas}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2 text-ice-dim sm:col-span-2">
                                <span className="text-xs uppercase tracking-wider">Agendado por:</span>
                                <span className={`text-xs font-bold uppercase ${cita.agendado_por === 'admin' ? 'text-street-green' : 'text-street-blue'}`}>
                                  {cita.agendado_por === 'admin' ? 'Administrador' : 'Cliente'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
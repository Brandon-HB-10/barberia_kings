from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from database import Base

class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    es_admin = Column(Boolean, default=False)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())

class Servicio(Base):
    __tablename__ = "servicios"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)
    descripcion = Column(String)
    precio = Column(Integer)
    duracion_min = Column(Integer, default=60)
    activo = Column(Boolean, default=True)

class Cita(Base):
    __tablename__ = "citas"
    id = Column(Integer, primary_key=True, index=True)
    cliente_nombre = Column(String)
    cliente_telefono = Column(String)
    cliente_email = Column(String, nullable=True)
    servicio_id = Column(Integer)
    servicio_nombre = Column(String)
    fecha = Column(String)  # YYYY-MM-DD
    hora = Column(String)   # HH:MM
    notas = Column(Text, nullable=True)
    estado = Column(String, default="pendiente")  # pendiente, completada, cancelada
    agendado_por = Column(String, default="cliente")  # cliente o admin
    creado_en = Column(DateTime(timezone=True), server_default=func.now())
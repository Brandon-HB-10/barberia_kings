from datetime import datetime
import os

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import and_, func, text

from database import engine, get_db, SessionLocal
import models
import schemas

from auth import (
    verificar_password,
    hashear_password,
    crear_token,
    get_admin_actual
)


models.Base.metadata.create_all(bind=engine)


# ──────────────────────────────────────────────────
# CONFIGURACIÓN DE HORARIOS
# ──────────────────────────────────────────────────

CAPACIDAD_POR_HORARIO = 3
HORA_APERTURA = 11
HORA_CIERRE = 20
INTERVALO_MINUTOS = 30


def generar_horarios():
    """
    Genera horarios cada 30 minutos:

    11:00
    11:30
    12:00
    ...
    19:30
    """

    horarios = []

    for hora in range(HORA_APERTURA, HORA_CIERRE):
        for minuto in range(0, 60, INTERVALO_MINUTOS):
            horarios.append(f"{hora:02d}:{minuto:02d}")

    return horarios


HORARIOS_VALIDOS = generar_horarios()


# ──────────────────────────────────────────────────
# SEED AUTOMÁTICO AL INICIAR
# ──────────────────────────────────────────────────

def seed_database():
    db = SessionLocal()

    try:
        admin_existente = (
            db.query(models.Usuario)
            .filter(
                models.Usuario.email == "admin@clipperkings.com"
            )
            .first()
        )

        if not admin_existente:
            admin_password = os.getenv("ADMIN_PASSWORD")

            if not admin_password:
                raise RuntimeError(
                    "La variable ADMIN_PASSWORD no está configurada"
                )

            admin = models.Usuario(
                nombre="Clipper Kings",
                email="admin@clipperkings.com",
                password=hashear_password(admin_password),
                es_admin=True
            )

            db.add(admin)
            print("✅ Admin creado")

        else:
            print("ℹ️ Admin ya existe")

        servicios_existentes = db.query(
            models.Servicio
        ).count()

        if servicios_existentes == 0:
            servicios = [
                models.Servicio(
                    nombre="Flow Cut",
                    descripcion=(
                        "Corte urbano con diseño personalizado "
                        "y fade perfecto"
                    ),
                    precio=180,
                    duracion_min=35
                ),
                models.Servicio(
                    nombre="Flow Cut + Barba",
                    descripcion=(
                        "Combo completo: corte premium + arreglo "
                        "de barba con navaja"
                    ),
                    precio=280,
                    duracion_min=50
                ),
                models.Servicio(
                    nombre="Arreglo de Barba",
                    descripcion=(
                        "Delineado preciso con navaja al ras "
                        "y tratamiento hidratante"
                    ),
                    precio=130,
                    duracion_min=25
                ),
                models.Servicio(
                    nombre="Diseños y Figuras",
                    descripcion=(
                        "Diseños únicos, rayas, figuras geométricas "
                        "y arte en el cabello"
                    ),
                    precio=200,
                    duracion_min=45
                ),
                models.Servicio(
                    nombre="Flow Premium",
                    descripcion=(
                        "Corte + barba + mascarilla facial "
                        "+ bebida refrescante"
                    ),
                    precio=380,
                    duracion_min=65
                ),
                models.Servicio(
                    nombre="Flow Kids",
                    descripcion=(
                        "Corte especial para los pequeños "
                        "con estilo y actitud"
                    ),
                    precio=130,
                    duracion_min=30
                ),
                models.Servicio(
                    nombre="Tinte y Color",
                    descripcion=(
                        "Coloración profesional con productos "
                        "de alta calidad"
                    ),
                    precio=350,
                    duracion_min=90
                ),
                models.Servicio(
                    nombre="Tratamiento Capilar",
                    descripcion=(
                        "Hidratación profunda y reconstrucción "
                        "del cabello"
                    ),
                    precio=220,
                    duracion_min=40
                ),
            ]

            for servicio in servicios:
                db.add(servicio)

            print("✅ Servicios creados")

        else:
            print("ℹ️ Servicios ya existen")

        db.commit()

    except Exception as error:
        print(f"❌ Error en seed: {error}")
        db.rollback()

    finally:
        db.close()


seed_database()


# ──────────────────────────────────────────────────
# APLICACIÓN
# ──────────────────────────────────────────────────

app = FastAPI(
    title="Clipper Kings Barbershop API"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ──────────────────────────────────────────────────
# AUTH
# ──────────────────────────────────────────────────

@app.post(
    "/auth/login",
    response_model=schemas.Token
)
def login(
    datos: schemas.UsuarioLogin,
    db: Session = Depends(get_db)
):
    usuario = (
        db.query(models.Usuario)
        .filter(
            models.Usuario.email == datos.email
        )
        .first()
    )

    if (
        not usuario
        or not verificar_password(
            datos.password,
            usuario.password
        )
    ):
        raise HTTPException(
            status_code=401,
            detail="Credenciales incorrectas"
        )

    token = crear_token({
        "sub": usuario.email
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }


# ──────────────────────────────────────────────────
# SERVICIOS
# ──────────────────────────────────────────────────

@app.get(
    "/servicios",
    response_model=list[schemas.ServicioResponse]
)
def obtener_servicios(
    db: Session = Depends(get_db)
):
    return (
        db.query(models.Servicio)
        .filter(
            models.Servicio.activo == True
        )
        .all()
    )


@app.post(
    "/servicios",
    response_model=schemas.ServicioResponse
)
def crear_servicio(
    servicio: schemas.ServicioCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_admin_actual)
):
    nuevo = models.Servicio(
        **servicio.model_dump()
    )

    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)

    return nuevo


@app.delete("/servicios/{id}")
def eliminar_servicio(
    id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_admin_actual)
):
    servicio = (
        db.query(models.Servicio)
        .filter(
            models.Servicio.id == id
        )
        .first()
    )

    if not servicio:
        raise HTTPException(
            status_code=404,
            detail="Servicio no encontrado"
        )

    servicio.activo = False
    db.commit()

    return {
        "mensaje": "Servicio eliminado"
    }


# ──────────────────────────────────────────────────
# CITAS
# ──────────────────────────────────────────────────

@app.post(
    "/citas",
    response_model=schemas.CitaResponse
)
def crear_cita(
    cita: schemas.CitaCreate,
    db: Session = Depends(get_db)
):
    # Validar la fecha
    try:
        fecha_cita = datetime.strptime(
            cita.fecha,
            "%Y-%m-%d"
        ).date()

    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Formato de fecha inválido"
        )

    if fecha_cita < datetime.now().date():
        raise HTTPException(
            status_code=400,
            detail="No puedes agendar en fechas pasadas"
        )

    # Validar que la hora pertenezca a los horarios permitidos
    if cita.hora not in HORARIOS_VALIDOS:
        raise HTTPException(
            status_code=400,
            detail=(
                "Horario inválido. Selecciona uno "
                "de los horarios disponibles."
            )
        )

        # Bloqueo de transacción para PostgreSQL.
    # Evita que dos personas ocupen simultáneamente
    # el último espacio disponible.
    if (
        db.bind is not None
        and db.bind.dialect.name == "postgresql"
    ):
        clave_horario = (
            f"clipper-kings|{cita.fecha}|{cita.hora}"
        )

        db.execute(
            text(
                """
                SELECT pg_advisory_xact_lock(
                    CAST(hashtext(:clave_horario) AS BIGINT)
                )
                """
            ),
            {
                "clave_horario": clave_horario
            }
        )

    citas_en_horario = (
        db.query(
            func.count(models.Cita.id)
        )
        .filter(
            and_(
                models.Cita.fecha == cita.fecha,
                models.Cita.hora == cita.hora,
                models.Cita.estado != "cancelada"
            )
        )
        .scalar()
        or 0
    )

    if citas_en_horario >= CAPACIDAD_POR_HORARIO:
        db.rollback()

        raise HTTPException(
            status_code=409,
            detail=(
                "Ese horario ya está ocupado. "
                "Selecciona otro horario disponible."
            )
        )

    nueva = models.Cita(
        **cita.model_dump()
    )

    try:
        db.add(nueva)
        db.commit()
        db.refresh(nueva)

    except Exception:
        db.rollback()
        raise

    return nueva


@app.get(
    "/citas",
    response_model=list[schemas.CitaResponse]
)
def obtener_citas(
    db: Session = Depends(get_db),
    admin=Depends(get_admin_actual)
):
    return (
        db.query(models.Cita)
        .order_by(
            models.Cita.creado_en.desc()
        )
        .all()
    )


@app.get("/citas/disponibles")
def horarios_disponibles(
    fecha: str,
    db: Session = Depends(get_db)
):
    try:
        datetime.strptime(
            fecha,
            "%Y-%m-%d"
        )

    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Formato de fecha inválido"
        )

    conteos = (
        db.query(
            models.Cita.hora,
            func.count(
                models.Cita.id
            ).label("cantidad")
        )
        .filter(
            and_(
                models.Cita.fecha == fecha,
                models.Cita.estado != "cancelada"
            )
        )
        .group_by(
            models.Cita.hora
        )
        .all()
    )

    citas_por_hora = {
        hora: cantidad
        for hora, cantidad in conteos
    }

    horarios = []

    for hora in HORARIOS_VALIDOS:
        citas_agendadas = citas_por_hora.get(
            hora,
            0
        )

        espacios_disponibles = max(
            CAPACIDAD_POR_HORARIO - citas_agendadas,
            0
        )

        horarios.append({
            "hora": hora,
            "citas_agendadas": citas_agendadas,
            "espacios_disponibles": espacios_disponibles,
            "disponible": espacios_disponibles > 0
        })

    return {
        "fecha": fecha,
        "capacidad_por_horario": CAPACIDAD_POR_HORARIO,
        "horarios": horarios
    }


@app.put("/citas/{id}/estado")
def actualizar_estado(
    id: int,
    datos: schemas.CitaUpdateEstado,
    db: Session = Depends(get_db),
    admin=Depends(get_admin_actual)
):
    cita = (
        db.query(models.Cita)
        .filter(
            models.Cita.id == id
        )
        .first()
    )

    if not cita:
        raise HTTPException(
            status_code=404,
            detail="Cita no encontrada"
        )

    cita.estado = datos.estado
    db.commit()

    return {
        "mensaje": "Estado actualizado"
    }


@app.delete("/citas/{id}")
def eliminar_cita(
    id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_admin_actual)
):
    cita = (
        db.query(models.Cita)
        .filter(
            models.Cita.id == id
        )
        .first()
    )

    if not cita:
        raise HTTPException(
            status_code=404,
            detail="Cita no encontrada"
        )

    db.delete(cita)
    db.commit()

    return {
        "mensaje": "Cita eliminada"
    }


# ──────────────────────────────────────────────────
# INFORMACIÓN GENERAL
# ──────────────────────────────────────────────────

@app.get("/info")
def obtener_info():
    return {
        "nombre": "Clipper Kings Barbería",
        "direccion": (
            "C. 2 de Abril 305, Centro, "
            "90300 Cdad. de Apizaco, Tlax."
        ),
        "telefono": "246 147 3968",
        "horario": (
            "Lunes a Domingo: "
            "11:00 AM - 8:00 PM"
        ),
        "calificacion": 4.7,
        "opiniones": 23,
        "instagram": "Yoel.cutts.mx"
    }
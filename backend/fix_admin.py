from database import SessionLocal
from auth import hashear_password
import models

db = SessionLocal()

# Buscar el admin de Clipper Kings
admin = db.query(models.Usuario).filter(models.Usuario.email == 'admin@clipperkings.com').first()

if admin:
    # Forzar nueva contraseña
    admin.password = hashear_password("ClipperKings2026!")
    db.commit()
    print("✅ Contraseña ACTUALIZADA correctamente")
    print("   Email: admin@clipperkings.com")
    print("   Pass:  ClipperKings2026!")
else:
    # Si no existe, crearlo
    nuevo = models.Usuario(
        nombre="Clipper Kings",
        email="admin@clipperkings.com",
        password=hashear_password("ClipperKings2026!"),
        es_admin=True
    )
    db.add(nuevo)
    db.commit()
    print("✅ Admin CREADO correctamente")
    print("   Email: admin@clipperkings.com")
    print("   Pass:  ClipperKings2026!")

db.close()
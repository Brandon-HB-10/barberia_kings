from database import SessionLocal
import models

db = SessionLocal()

# Borrar el admin viejo de Only Flow
admin_viejo = db.query(models.Usuario).filter(models.Usuario.email == 'admin@onlyflow.com').first()
if admin_viejo:
    db.delete(admin_viejo)
    db.commit()
    print("✅ Admin viejo (admin@onlyflow.com) eliminado")
else:
    print("ℹ️ No había admin viejo")

# Verificar que el nuevo existe
admin_nuevo = db.query(models.Usuario).filter(models.Usuario.email == 'admin@clipperkings.com').first()
if admin_nuevo:
    print(f"✅ Admin nuevo listo:")
    print(f"   Email: {admin_nuevo.email}")
    print(f"   Nombre: {admin_nuevo.nombre}")
else:
    print("❌ No se encontró admin@clipperkings.com")

db.close()
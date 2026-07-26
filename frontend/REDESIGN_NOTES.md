# Rediseño visual — Only Flow Barbershop

Cambios principales:

- Se eliminó `<base target="_blank">` de `index.html`. Esa línea provocaba que los enlaces, incluido “Reservar cita”, se abrieran en otra pestaña.
- Nueva dirección visual minimalista: negro, grises, blanco y un solo verde de acento.
- Tipografías actualizadas a Space Grotesk para títulos e Inter para textos.
- Navbar, hero, botones, tarjetas, inputs y estados hover simplificados.
- Se conservaron las rutas, componentes, lógica de reservas, llamadas al backend y panel administrativo.

Para probar:

```bash
npm install
npm run dev
```

Si ya tenías `node_modules`, puedes ejecutar directamente `npm run dev`. Si aparece un error extraño de dependencias, elimina `node_modules` y corre de nuevo `npm install`.

## Hero editorial V2
- Nueva composición editorial asimétrica inspirada en sitios de agencias modernas.
- Título mixto: Space Grotesk + Instrument Serif en cursiva.
- Se conservaron las acciones de Reservar cita y WhatsApp.
- Se conservaron calificación, horario, ubicación, servicios e Instagram.
- Objeto cromado central construido únicamente con CSS, sin imágenes externas.

# Registro de UrbanTrack

Alta de empresas con una prueba gratuita de 10 días. No se muestran precios: durante la prueba, el equipo de UrbanTrack contacta al cliente para armar su plan.

## Flujo

1. **Tu cuenta:** nombre, apellido, correo, empresa y teléfono/WhatsApp.
2. **Tu equipo:** tamaño del equipo y, opcionalmente, qué quiere ordenar primero.
3. **Confirmar:** resumen, línea de tiempo de la prueba y aceptación de términos.

## Envío

La configuración vive en `../config.js`:

- `signupApiUrl` vacío → el registro se envía por correo al equipo (FormSubmit, `leadFormUrl`) para activar la cuenta manualmente.
- `signupApiUrl` con valor → se hace `POST` JSON a ese endpoint.

### Contrato esperado del endpoint

Solicitud:

```json
{
  "firstName": "Ana",
  "lastName": "Pérez",
  "email": "ana@empresa.com",
  "company": "Constructora Norte",
  "phone": "+591 70012345",
  "teamSize": "6-20",
  "message": "Rutas de visitas",
  "trialDays": 10,
  "acceptedTerms": true
}
```

`teamSize` es uno de `1-5`, `6-20`, `21-50`, `50+`.

El backend debe:

1. validar que el correo y la empresa puedan iniciar una prueba;
2. crear la organización y su usuario administrador;
3. enviar el correo de verificación con un enlace para **crear la contraseña** (el formulario no la pide);
4. establecer el estado `Trial` y `trialEndsAt` a 10 días;
5. avisar al equipo comercial para que contacte al cliente y arme su plan.

Respuesta: cualquier `2xx`. Si incluye `onboardingUrl`, el botón final lleva ahí. Un error no `2xx` muestra un mensaje genérico con el correo de contacto.

## Archivos

- `index.html`: flujo de tres pasos.
- `styles.css`: diseño responsive aislado.
- `app.js`: navegación, validación y envío.

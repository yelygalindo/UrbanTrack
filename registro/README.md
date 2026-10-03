# Registro de UrbanTrack

Frontend independiente para el alta de empresas, selección de planes y activación de una prueba gratuita de 10 días.

## Estado actual

La experiencia visual y sus validaciones están completas. Funciona como prototipo navegable y todavía no crea cuentas ni procesa pagos.

## Próxima integración

El envío final debe conectarse con un endpoint del backend que:

1. valide que el correo y la empresa puedan iniciar una prueba;
2. cree la organización y su usuario administrador;
3. envíe el correo de verificación;
4. guarde el plan seleccionado;
5. establezca el estado `Trial` y `trialEndsAt` a 10 días;
6. devuelva la URL del onboarding de la aplicación.

Las contraseñas nunca deben enviarse por correo, guardarse en el navegador ni registrarse en logs.

## Archivos

- `index.html`: flujo de tres pasos.
- `styles.css`: diseño responsive aislado.
- `app.js`: navegación, validación y resumen del plan.

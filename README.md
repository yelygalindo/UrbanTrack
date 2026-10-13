# UrbanTrack

Sitio comercial estático de UrbanTrack, listo para publicar en GitHub Pages.

## Estructura

- `index.html`: landing principal.
- `styles.css`: sistema visual y estilos responsive.
- `logo.svg`: logo original en alta resolución (no se usa en las páginas por su peso).
- `assets/logo-192.png`, `assets/logo-512.png`: logo liviano y favicon.
- `assets/og-image.jpg`: imagen al compartir el sitio en redes (1200×630).
- `config.js`: destino del formulario de demo.
- `main.js`: menú móvil y formulario de demo.
- `robots.txt`, `sitemap.xml`: indexación en buscadores.
- `privacy.html`: política de privacidad.
- `registro/`: solo redirige enlaces antiguos al registro de la aplicación.
- `CNAME`: dominio personalizado.

## Desarrollo local

No requiere compilación ni dependencias. Abre `index.html` en el navegador o sirve la carpeta con cualquier servidor HTTP estático.

## Formularios

La demo se envía con [FormSubmit](https://formsubmit.co) a `contacto@urbantrack.io`. El primer envío genera un correo de activación que hay que confirmar una sola vez.

## Registro de prueba gratuita

El registro con prueba de 10 días vive en la aplicación (proyecto SalesTracking-Web), en `https://app.urbantrack.io/trial-signup`. Los botones "Prueba gratis" y "Crear cuenta" de la landing apuntan ahí.

## Publicación

Publica el contenido de la raíz en GitHub Pages. El archivo `CNAME` conserva el dominio `urbantrack.io`.

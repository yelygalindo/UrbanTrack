// Configuración compartida del sitio. Es el único lugar que hay que tocar
// para conectar el formulario de demo con un servicio real.
// El registro de prueba gratuita vive en la aplicación: https://app.urbantrack.io/trial-signup
window.URBANTRACK_CONFIG = {
  // Recibe las solicitudes de demo. Usa FormSubmit (https://formsubmit.co): el
  // primer envío manda un correo de activación a esta dirección y hay que
  // confirmarlo una sola vez. Después puedes reemplazar el correo por el alias
  // aleatorio que te entrega FormSubmit para no exponer la dirección en el código.
  leadFormUrl: "https://formsubmit.co/ajax/contacto@urbantrack.io",

  contactEmail: "contacto@urbantrack.io",
};

// Envía un formulario a FormSubmit y lanza un error si no se pudo entregar.
window.sendLead = async function sendLead(subject, fields) {
  const response = await fetch(window.URBANTRACK_CONFIG.leadFormUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      _subject: subject,
      _template: "table",
      _captcha: "false",
      ...fields,
    }),
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok || String(result.success) !== "true") {
    throw new Error(result.message || "No se pudo enviar el formulario");
  }
};

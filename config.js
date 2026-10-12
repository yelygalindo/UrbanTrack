// Configuración compartida del sitio. Es el único lugar que hay que tocar
// para conectar formularios y registro con servicios reales.
window.URBANTRACK_CONFIG = {
  // Recibe las solicitudes de demo y, mientras no exista la API, también los
  // registros de prueba. Usa FormSubmit (https://formsubmit.co): el primer
  // envío manda un correo de activación a esta dirección y hay que confirmarlo
  // una sola vez. Después puedes reemplazar el correo por el alias aleatorio
  // que te entrega FormSubmit para no exponer la dirección en el código.
  leadFormUrl: "https://formsubmit.co/ajax/contacto@urbantrack.io",

  // Endpoint del backend que crea la empresa y su prueba de 10 días.
  // Déjalo vacío hasta que la API esté lista. Contrato esperado en registro/README.md.
  signupApiUrl: "",

  contactEmail: "contacto@urbantrack.io",
  trialDays: 10,
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

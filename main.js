const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");

function setMenu(open) {
  header.classList.toggle("menu-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
}

menuToggle.addEventListener("click", () => {
  setMenu(!header.classList.contains("menu-open"));
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && header.classList.contains("menu-open")) {
    setMenu(false);
    menuToggle.focus();
  }
});

const contactForm = document.getElementById("contacto");
const contactStatus = contactForm.querySelector(".form-status");
const contactButton = contactForm.querySelector("button[type='submit']");

function showContactStatus(type, html) {
  contactStatus.className = `form-status ${type}`;
  contactStatus.innerHTML = html;
  contactStatus.hidden = false;
}

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(contactForm);

  // Los bots suelen completar el campo oculto; las personas no lo ven.
  if (form.get("_honey")) {
    return;
  }

  contactButton.disabled = true;
  contactButton.firstChild.textContent = "Enviando… ";
  contactStatus.hidden = true;

  try {
    await window.sendLead("Nueva solicitud de demo · UrbanTrack", {
      Nombre: form.get("nombre"),
      Empresa: form.get("empresa"),
      Correo: form.get("correo"),
      Teléfono: form.get("telefono") || "No indicado",
      Mensaje: form.get("mensaje") || "Sin mensaje adicional",
      _replyto: form.get("correo"),
    });
    contactForm.reset();
    showContactStatus(
      "success",
      "<strong>¡Gracias!</strong> Recibimos tu solicitud. Te contactaremos en menos de un día hábil.",
    );
  } catch {
    const email = window.URBANTRACK_CONFIG.contactEmail;
    showContactStatus(
      "error",
      `No pudimos enviar tu solicitud. Inténtalo de nuevo o escríbenos a <a href="mailto:${email}">${email}</a>.`,
    );
  } finally {
    contactButton.disabled = false;
    contactButton.firstChild.textContent = "Solicitar una demo ";
  }
});

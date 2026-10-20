// Menú móvil del manual. Es el mismo comportamiento que main.js de la
// landing, sin el formulario de demo que esta página no tiene.
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

// Resalta en el menú la sección que se está leyendo.
const sectionLinks = new Map(
  [...document.querySelectorAll(".nav-links a[href^='#']")].map((link) => [
    link.getAttribute("href").slice(1),
    link,
  ]),
);

if ("IntersectionObserver" in window && sectionLinks.size) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach((link) => link.removeAttribute("aria-current"));
        sectionLinks.get(entry.target.id)?.setAttribute("aria-current", "true");
      });
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  sectionLinks.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
}

// Dibuja el menú lateral de las ventanas de ejemplo. Cada ilustración marca
// su sección con data-on (por ejemplo data-on="Agenda"). Es decorativo.
const sideMenu = [
  ["", ["Resumen", "Agenda"]],
  ["Comercial", ["Contactos", "Seguimientos", "Catálogo"]],
  ["Campo", ["Equipo en vivo", "Rutas", "Historial", "Entregas"]],
  ["Análisis", ["Productividad", "Embudo", "Informes"]],
  ["", ["Configuración"]],
];

document.querySelectorAll(".w-side[data-on]").forEach((side) => {
  const current = side.dataset.on;
  side.setAttribute("aria-hidden", "true");
  sideMenu.forEach(([group, items]) => {
    if (group) {
      const title = document.createElement("b");
      title.textContent = group;
      side.append(title);
    }
    items.forEach((item) => {
      const link = document.createElement("span");
      link.textContent = item;
      if (item === current) link.className = "on";
      side.append(link);
    });
  });
});

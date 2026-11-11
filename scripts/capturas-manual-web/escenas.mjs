// Contenido de cada escena: textos para el video y el detalle que se amplía.
// Las coordenadas están en píxeles CSS de la captura cruda (1440×900; el ingreso es 1280×800).
export const escenas = [
  {
    name: "resumen", capitulo: "03 · Inicio", titulo: "El día de tu equipo, de un vistazo.",
    puntos: ["Indicadores, pendientes y entregas urgentes", "Las obras en el mapa"],
    zoom: { x: 1044, y: 266, w: 366, h: 400, etiqueta: "Actividad reciente" },
  },
  {
    name: "buscador", capitulo: "01 · Primeros pasos", titulo: "Encuentra todo con Ctrl + K.",
    puntos: ["Páginas, clientes y obras", "Sin salir de donde estás"],
    zoom: { x: 420, y: 108, w: 600, h: 180, etiqueta: "Búsqueda rápida" },
  },
  {
    name: "ingreso", capitulo: "02 · Acceso", titulo: "Entra desde cualquier navegador.",
    puntos: ["La misma cuenta que en la app móvil", "Recupera tu contraseña por correo"],
    zoom: { x: 760, y: 300, w: 450, h: 250, etiqueta: "Inicia sesión" },
  },
  {
    name: "clientes", capitulo: "04 · Comercial", titulo: "Tu cartera de clientes, ordenada.",
    puntos: ["Estado, responsable y próximo contacto", "WhatsApp y correo desde la lista"],
    zoom: { x: 292, y: 250, w: 560, h: 258, etiqueta: "Clientes" },
  },
  {
    name: "obra", capitulo: "05 · Comercial", titulo: "Cada obra, de principio a fin.",
    puntos: ["Monto, avance, ubicación y archivos", "Toda la actividad en un solo lugar"],
    zoom: { x: 320, y: 318, w: 525, h: 242, etiqueta: "Ficha de la obra" },
  },
  {
    name: "agenda", capitulo: "06 · Agenda", titulo: "Que nada se escape.",
    puntos: ["Recordatorios de todo el equipo", "Lo vencido, marcado en rojo"],
    zoom: { x: 612, y: 650, w: 482, h: 150, etiqueta: "Esta semana" },
  },
  {
    name: "equipo-en-vivo", capitulo: "07 · Campo", titulo: "Tu equipo, en vivo.",
    puntos: ["Quién trabaja y desde qué hora", "Su última ubicación en el mapa"],
    zoom: { x: 293, y: 538, w: 470, h: 92, etiqueta: "Estado de cada persona" },
  },
  {
    name: "visitas-en-curso", capitulo: "07 · Campo", titulo: "Qué visita atiende cada uno.",
    puntos: ["La posición real que envía el celular", "Desde qué hora está en la visita"],
    zoom: { x: 1150, y: 776, w: 262, h: 96, etiqueta: "Visita actual" },
  },
  {
    name: "rutas", capitulo: "08 · Campo", titulo: "Planifica la ruta del día.",
    puntos: ["Elige las paradas y ordénalas", "Ve cuáles ya se visitaron"],
    zoom: { x: 311, y: 748, w: 362, h: 128, etiqueta: "Paradas visitadas" },
  },
  {
    name: "historial", capitulo: "09 · Campo", titulo: "Lo que pasó, con hora y lugar.",
    puntos: ["El recorrido de cada jornada", "Duración, visitas y ubicaciones"],
    zoom: { x: 1160, y: 316, w: 252, h: 222, etiqueta: "Resumen de la jornada" },
  },
  {
    name: "entrega", capitulo: "10 · Entregas", titulo: "De la promesa a la recepción.",
    puntos: ["Sucursal, fecha comprometida y responsable", "Cuánto llegó de cada producto"],
    zoom: { x: 292, y: 470, w: 366, h: 84, etiqueta: "Avance de recepción" },
  },
  {
    name: "carga-masiva", capitulo: "11 · Excel", titulo: "Carga cientos de clientes de una vez.",
    puntos: ["Sube tu Excel y relaciona las columnas", "Revisa cada fila antes de cargar"],
    zoom: { x: 600, y: 196, w: 510, h: 64, etiqueta: "Tres pasos" },
  },
  {
    name: "productividad", capitulo: "12 · Análisis", titulo: "Mide cómo rinde cada persona.",
    puntos: ["Visitas, horas y clientes atendidos", "Comparado con el período anterior"],
    zoom: { x: 292, y: 326, w: 588, h: 126, etiqueta: "Indicadores del período" },
  },
  {
    name: "embudo", capitulo: "12 · Análisis", titulo: "Todas tus obras, por etapa.",
    puntos: ["Montos estimados en cada etapa", "Cierres vencidos a la vista"],
    zoom: { x: 292, y: 286, w: 500, h: 116, etiqueta: "Etapas" },
  },
  {
    name: "informes", capitulo: "12 · Análisis", titulo: "Informes PDF con tu marca.",
    puntos: ["Elige una plantilla y el registro", "Genera el PDF con los datos actuales"],
    zoom: { x: 300, y: 230, w: 560, h: 240, etiqueta: "Generar informe" },
  },
  {
    name: "usuarios", capitulo: "13 · Configuración", titulo: "Tu equipo, con el acceso justo.",
    puntos: ["Invita usuarios por correo", "Roles y permisos por persona"],
    zoom: { x: 563, y: 300, w: 487, h: 220, etiqueta: "Usuarios y roles" },
  },
  {
    name: "soporte", capitulo: "14 · Ayuda", titulo: "Estamos para ayudarte.",
    puntos: ["Cuéntanos qué pasó", "Adjunta capturas de pantalla"],
    zoom: { x: 312, y: 188, w: 545, h: 70, etiqueta: "Tipo de consulta" },
  },
];

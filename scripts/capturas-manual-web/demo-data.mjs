// Datos de ejemplo para las capturas del manual. Todo es inventado.
export const NOW = "2026-11-10T14:30:00Z"; // 10:30 en La Paz
const day = (offset, hour = 14, min = 0) => {
  const d = new Date(NOW);
  d.setUTCDate(d.getUTCDate() + offset);
  d.setUTCHours(hour, min, 0, 0);
  return d.toISOString();
};
export { day };

const C = [-17.3895, -66.1568]; // Cochabamba
const at = (dLat, dLng) => [+(C[0] + dLat).toFixed(5), +(C[1] + dLng).toFixed(5)];

export const user = {
  id: 7,
  externalId: "usr-admin",
  username: "gabriela",
  fullName: "Gabriela Torrez",
  email: "gabriela@constructoraandina.bo",
  company: { id: 2, externalId: "cmp-1", name: "Constructora Andina", trialEndsAtUtc: null },
  roles: ["admin"],
  permissions: [
    "dashboard.read", "customers.read", "customers.create", "customers.update", "customers.delete",
    "customers.export", "customers.import", "projects.read", "projects.create", "projects.update",
    "projects.delete", "projects.export", "projects.import", "products.read", "products.create",
    "products.update", "products.import", "units.read", "units.create", "units.import",
    "visits.read", "sellers.read", "routes.read", "routes.manage", "timeline.read",
    "deliveries.read", "deliveries.create", "deliveries.update", "reports.read",
    "report-documents.generate", "report-templates.manage", "users.read", "users.update",
    "invitations.create", "branches.read", "branches.update", "companies.update", "roles.read",
    "workdays.manage", "project-duplicates.manage",
  ],
};

export const sellers = [
  { externalId: "s-ana", displayName: "Ana Rojas", email: "ana@constructoraandina.bo" },
  { externalId: "s-luis", displayName: "Luis Mendoza", email: "luis@constructoraandina.bo" },
  { externalId: "s-carla", displayName: "Carla Vargas", email: "carla@constructoraandina.bo" },
  { externalId: "s-pedro", displayName: "Pedro Suárez", email: "pedro@constructoraandina.bo" },
  { externalId: "s-jorge", displayName: "Jorge Quiroga", email: "jorge@constructoraandina.bo" },
];
const S = Object.fromEntries(sellers.map((s) => [s.externalId, s]));

export const customerStatuses = [
  { value: 1, label: "Prospecto" },
  { value: 2, label: "Interesado" },
  { value: 3, label: "Cliente activo" },
  { value: 4, label: "Inactivo" },
];
export const projectStatuses = [
  { value: 1, label: "Nuevo" },
  { value: 2, label: "En progreso" },
  { value: 3, label: "En negociación" },
  { value: 4, label: "Ganado" },
  { value: 5, label: "Perdido" },
];

const rawCustomers = [
  ["Ferretería El Constructor", "Marco Antezana", "s-ana", 3, -1, 2, at(0.004, 0.006)],
  ["Inmobiliaria Los Pinos", "Silvia Camacho", "s-luis", 3, -3, 1, at(-0.012, 0.01)],
  ["Edificio Torre Blanca", "Ricardo Paz", "s-carla", 2, -2, 0, at(0.009, -0.011)],
  ["Colegio San Agustín", "Hna. Teresa Ruiz", "s-ana", 1, -6, 3, at(-0.006, -0.004)],
  ["Hotel Cochabamba Plaza", "Daniel Arce", "s-pedro", 3, 0, 4, at(0.002, -0.002)],
  ["Clínica Los Ángeles", "Dra. Mónica Salinas", "s-jorge", 2, -4, 2, at(0.015, 0.004)],
  ["Condominio Valle Verde", "Fernando Ledezma", "s-luis", 3, -1, 5, at(-0.018, -0.015)],
  ["Supermercado Fidalga Norte", "Patricia Guzmán", "s-carla", 1, -9, 7, at(0.021, 0.012)],
  ["Universidad Privada del Valle", "Ing. Óscar Rivero", "s-pedro", 2, -5, 1, at(-0.003, 0.019)],
  ["Mueblería Artesanal Quillacollo", "Rosa Mamani", "s-jorge", 4, -30, null, at(-0.01, -0.03)],
  ["Panadería La Espiga", "Julio Céspedes", "s-ana", 3, -2, 6, at(0.007, 0.015)],
  ["Centro Comercial Hupermall", "Valeria Montaño", "s-luis", 2, -7, 2, at(0.012, -0.02)],
];
export const customers = rawCustomers.map(([company, name, seller, statusId, last, next, [lat, lng]], i) => ({
  id: i + 1,
  externalId: `c-${i + 1}`,
  code: `CLI-${String(1040 + i)}`,
  name,
  companyName: company,
  phone: `+591 7${String(1234567 + i * 13579).slice(0, 7)}`,
  email: `${name.split(" ").slice(-2, -1)[0] || name}`.toLowerCase().normalize("NFD").replace(/[^a-z]/g, "") + "@gmail.com",
  status: customerStatuses.find((s) => s.value === statusId).label,
  statusId,
  createdAt: day(-60 + i * 3),
  seller: { id: null, externalId: seller, name: S[seller].displayName },
  lastContactAtUtc: day(last, 15),
  nextContactAtUtc: next === null ? null : day(next, 13),
  address: `Av. ${["América", "Blanco Galindo", "Heroínas", "Ayacucho", "Pando", "Libertador Bolívar"][i % 6]} #${120 + i * 37}, Cochabamba`,
  latitude: lat,
  longitude: lng,
  updatedAtUtc: day(-1),
  notes: [],
  reminders: [],
}));

const rawProjects = [
  ["Ampliación Torre Blanca, bloque B", 2, 3, "s-carla", 2, 65, 185000],
  ["Remodelación Hotel Plaza, piso 4", 4, 5, "s-pedro", 2, 40, 96000],
  ["Condominio Valle Verde, fase 2", 6, 7, "s-luis", 3, 15, 420000],
  ["Aulas nuevas Colegio San Agustín", 3, 4, "s-ana", 1, 0, 78000],
  ["Clínica Los Ángeles, área de emergencias", 5, 6, "s-jorge", 3, 10, 260000],
  ["Fachada Ferretería El Constructor", 0, 1, "s-ana", 4, 100, 34000],
  ["Estacionamiento Hupermall", 11, 12, "s-luis", 2, 55, 310000],
  ["Laboratorios Univalle", 8, 9, "s-pedro", 1, 0, 150000],
  ["Galpón Panadería La Espiga", 10, 11, "s-ana", 2, 80, 52000],
  ["Sucursal Fidalga Norte", 7, 8, "s-carla", 5, 0, 205000],
  ["Departamentos Los Pinos, torre 3", 1, 2, "s-luis", 4, 100, 530000],
  ["Showroom Mueblería Quillacollo", 9, 10, "s-jorge", 1, 0, 41000],
];
export const projects = rawProjects.map(([name, ci, _n, seller, statusId, progress, amount], i) => {
  const c = customers[ci];
  return {
    id: i + 1,
    externalId: `p-${i + 1}`,
    code: `OBR-${String(310 + i)}`,
    name,
    description: "Provisión de cemento, fierro y agregados según cronograma de obra.",
    customerExternalId: c.externalId,
    customerName: c.companyName,
    sellerExternalId: seller,
    sellerName: S[seller].displayName,
    status: projectStatuses.find((s) => s.value === statusId).label,
    statusId,
    statusName: projectStatuses.find((s) => s.value === statusId).label,
    estimatedAmount: amount,
    startDateUtc: day(-40 + i * 2),
    expectedCloseDateUtc: day(30 + i * 5),
    progressPercentage: progress,
    actualCloseDateUtc: statusId === 4 ? day(-3) : null,
    address: c.address,
    latitude: c.latitude + 0.0015,
    longitude: c.longitude - 0.001,
    createdAtUtc: day(-45 + i * 2),
    updatedAtUtc: day(-1),
  };
});

export const products = [
  ["Cemento IP-30", "bolsa"], ["Fierro corrugado 12 mm", "barra"], ["Arena fina", "m³"],
  ["Ladrillo 6 huecos", "pieza"], ["Grava 3/4", "m³"], ["Cerámica 45×45", "m²"],
];

const reminderTexts = [
  "Llamar para confirmar pedido de cemento", "Visita técnica de avance", "Enviar cotización de fierro",
  "Reunión con el arquitecto", "Confirmar fecha de entrega", "Presentar catálogo de cerámicas",
  "Seguimiento a la propuesta", "Revisar planos de la fase 2", "Cobro de la segunda cuota",
];
export const reminders = Array.from({ length: 26 }, (_, i) => {
  const c = customers[i % customers.length];
  const p = projects.find((p) => p.customerExternalId === c.externalId);
  const offset = ((i * 7) % 30) - 9;
  const isProject = i % 3 === 0 && p;
  return {
    externalId: `r-${i + 1}`,
    text: reminderTexts[i % reminderTexts.length],
    reminderAtUtc: day(offset, 12 + (i % 8), (i % 2) * 30),
    completed: offset < 0 && i % 4 !== 0,
    customerExternalId: c.externalId,
    customerName: c.companyName,
    sourceType: isProject ? "project" : "customer",
    projectExternalId: isProject ? p.externalId : null,
    projectName: isProject ? p.name : null,
    assignedTo: { id: null, externalId: c.seller.externalId, name: c.seller.name },
  };
});

// Equipo en vivo
export const activeSellers = [
  { s: "s-ana", pos: at(0.0042, 0.0058), visit: customers[0], started: day(0, 12, 5) },
  { s: "s-luis", pos: at(-0.0175, -0.0148), visit: customers[6], started: day(0, 12, 20) },
  { s: "s-carla", pos: at(0.006, -0.008), visit: null, started: day(0, 12, 45) },
  { s: "s-pedro", pos: at(0.0022, -0.0019), visit: customers[4], started: day(0, 13, 0) },
  { s: "s-jorge", pos: null, visit: null, started: null },
].map(({ s, pos, visit, started }, i) => ({
  sellerExternalId: s,
  sellerName: S[s].displayName,
  hasOpenWorkday: Boolean(started),
  workdayExternalId: started ? `w-${s}` : null,
  workdayStartedAtUtc: started,
  startedAtUtc: started ?? "0001-01-01T00:00:00Z",
  status: started ? "open" : undefined,
  latitude: pos?.[0] ?? null,
  longitude: pos?.[1] ?? null,
  accuracyMeters: pos ? 8 + i * 3 : null,
  lastLocationAtUtc: pos ? day(0, 14, 26 - i * 2) : null,
  currentVisitExternalId: visit ? `v-live-${i}` : null,
  currentVisitTargetType: visit ? "customer" : null,
  currentVisitTargetExternalId: visit?.externalId ?? null,
  currentVisitTargetName: visit?.companyName ?? null,
  currentVisitStartedAtUtc: visit ? day(0, 14, 5 + i * 4) : null,
  trackingHealth: started
    ? { installationId: `inst-${s}`, isError: false, message: "Ubicación activa", occurredAtUtc: day(0, 14, 20), receivedAtUtc: day(0, 14, 20) }
    : null,
}));

export const visitsToday = [
  [customers[10], "s-ana", 12, 20, 12, 55, "Pedido de 120 bolsas de cemento"],
  [customers[0], "s-ana", 14, 5, null, null, null],
  [customers[1], "s-luis", 12, 30, 13, 10, "Interesados en fierro para torre 3"],
  [customers[6], "s-luis", 14, 9, null, null, null],
  [customers[4], "s-pedro", 14, 13, null, null, null],
  [customers[2], "s-carla", 13, 5, 13, 50, "Revisión de avance, bloque B"],
  [customers[7], "s-carla", 13, 58, 14, 15, "Dejé catálogo de cerámicas"],
].map(([c, s, h, m, oh, om, result], i) => ({
  externalId: `v-${i + 1}`,
  customerExternalId: c.externalId,
  customerName: c.companyName,
  projectExternalId: null,
  projectName: null,
  visitedAtUtc: day(0, h, m),
  checkOutAtUtc: oh ? day(0, oh, om) : null,
  result,
  sellerExternalId: s,
  sellerName: S[s].displayName,
}));

// Recorrido de Ana para el Historial y las Rutas
export const anaTrack = [
  at(-0.004, 0.012), at(-0.002, 0.0135), at(0.0005, 0.0148), at(0.003, 0.0152), at(0.007, 0.015),
  at(0.0072, 0.0125), at(0.0068, 0.0098), at(0.0055, 0.0078), at(0.0042, 0.0058),
];

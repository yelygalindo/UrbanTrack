// Paso 1: saca las pantallas crudas (PNG en alta resolución) en scripts/capturas-manual-web/crudas/.
// Después, componer.mjs arma con ellas las imágenes del manual web y las del video.
// Uso, desde la raíz del repositorio:
//   1. En SalesTrackingWeb: VITE_API_BASE_URL=http://127.0.0.1:5000 npx vite --host 127.0.0.1 --port 4173
//   2. node scripts/capturas-manual-web/capturar.mjs [nombre...]
// SALES_TRACKING_WEB indica dónde está SalesTrackingWeb (por defecto ../SalesTrackingWeb),
// de donde se toma Playwright. La API se simula: no se usan datos reales.
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as D from "./demo-data.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(process.env.SALES_TRACKING_WEB || join(here, "../../../SalesTrackingWeb"));
const require = createRequire(join(appDir, "package.json"));
const { chromium } = require("@playwright/test");

const APP = "http://127.0.0.1:4173";
const API = "http://127.0.0.1:5000";
const outDir = join(here, "crudas");
const only = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });

const paged = (items, key = "items") => ({
  [key]: items,
  ...(key === "items"
    ? { pagination: { page: 1, pageSize: 50, totalItems: items.length, totalPages: 1 } }
    : { page: 1, pageSize: 50, totalItems: items.length, totalPages: 1 }),
});
const project1 = D.projects[0];
const deliveries = D.projects.slice(0, 7).map((p, i) => {
  const items = D.products.slice(0, 2 + (i % 3)).map(([name, unit], j) => {
    const qty = [200, 80, 12, 3000, 10, 150][j];
    return {
      externalId: `di-${i}-${j}`, productExternalId: `prod-${j}`, productName: name, unitName: unit,
      quantity: qty, deliveredQuantity: i === 0 ? Math.round(qty * [0.6, 0.6, 0.6, 0.6][j % 4]) : i % 3 === 1 ? qty : 0,
    };
  });
  const statusId = i === 0 ? 2 : i % 3 === 1 ? 3 : 1;
  return {
    id: i + 1, externalId: `d-${i + 1}`, projectExternalId: p.externalId, projectName: p.name,
    originBranchExternalId: "br-1", originBranchName: i % 2 ? "Depósito Norte" : "Depósito Parque Industrial",
    sellerExternalId: p.sellerExternalId, sellerName: p.sellerName, statusId,
    statusName: ["", "Pendiente", "Parcial", "Entregado"][statusId],
    committedDateUtc: D.day(i - 2), deliveredDateUtc: statusId === 3 ? D.day(-1) : null,
    notes: i === 0 ? "Entregar en portón trasero, coordinar con el capataz." : null,
    createdAtUtc: D.day(-10), updatedAtUtc: D.day(-1), attachmentCount: i === 0 ? 2 : 0, items,
  };
});

function api(path, q) {
  const seg = path.split("/").filter(Boolean).slice(1); // sin "api"
  const p = "/" + seg.join("/");
  switch (p) {
    case "/auth/refresh": return { accessToken: "demo" };
    case "/auth/me": return D.user;
    case "/companies/current/time-zone": return { timeZoneId: "America/La_Paz" };
    case "/companies/current/operation-settings":
      return {
        industryCode: "construction", industryName: "Construcción", source: "industry",
        labels: {
          customer: { singular: "Cliente", plural: "Clientes" },
          project: { singular: "Obra", plural: "Obras" },
          visit: { singular: "Visita", plural: "Visitas" },
        },
        modules: { deliveries: true, catalog: true, tracking: true },
      };
    case "/sellers": return D.sellers;
    case "/customers/statuses": return D.customerStatuses;
    case "/projects/statuses": return D.projectStatuses;
    case "/delivery-statuses":
      return ["Pendiente", "Parcial", "Entregado"].map((name, i) => ({ deliveryStatusId: i + 1, name, description: name, isActive: true }));
    case "/dashboard": {
      return {
        metrics: { activeCustomers: 184, activeProjects: 37, pendingDeliveries: 12, overdueDeliveries: 2, completedDeliveriesThisMonth: 29, todayFollowUps: 6 },
        projectLocations: D.projects.map((p) => ({ projectExternalId: p.externalId, name: p.name, customerName: p.customerName, sellerExternalId: p.sellerExternalId, sellerName: p.sellerName, statusId: p.statusId, statusName: p.statusName, progressPercentage: p.progressPercentage, latitude: p.latitude, longitude: p.longitude })),
        recentActivity: [
          ["Ampliación Torre Equipetrol, bloque B", "ProjectVisitCheckOutCreated", "Revisión de avance, bloque B", "Carla Vargas", 13, 50],
          ["Tinglado Panadería La Espiga", "CustomerNoteAdded", "Pedido de 80 hojas de calamina", "Ana Rojas", 12, 55],
          ["Departamentos Las Palmas, torre 3", "ProjectUpdated", "Estado: Ganado", "Luis Mendoza", 12, 10],
          ["Remodelación Hotel Jardín, piso 4", "ProjectAttachmentAdded", "Foto de avance", "Pedro Suárez", 11, 40],
          ["Estacionamiento Las Brisas", "CustomerReminderCompleted", "Confirmar fecha de entrega", "Luis Mendoza", 10, 15],
        ].map(([projectName, eventTypeName, title, userName, h, m], i) => ({ projectExternalId: `p-${i + 1}`, projectName, eventTypeName, title, userName, occurredAtUtc: D.day(0, h, m) })),
        upcomingFollowUps: D.reminders.filter((r) => !r.completed && r.reminderAtUtc >= D.NOW).slice(0, 5).map((r) => ({ reminderExternalId: r.externalId, customerExternalId: r.customerExternalId, customerName: r.customerName, projectName: r.projectName, text: r.text, reminderAtUtc: r.reminderAtUtc, assignedToName: r.assignedTo.name })),
        urgentDeliveries: deliveries.filter((d) => d.statusId !== 3).slice(0, 3).map((d, i) => ({ deliveryExternalId: d.externalId, projectExternalId: d.projectExternalId, projectName: d.projectName, customerName: D.projects.find((p) => p.externalId === d.projectExternalId).customerName, productName: d.items[0].productName, statusName: d.statusName, committedDateUtc: d.committedDateUtc, isOverdue: i === 0 })),
      };
    }
    case "/dashboard/map-items": return api("/api/dashboard", q).projectLocations;
    case "/customers": { const s = (q.get("search") || q.get("q") || "").toLowerCase(); return paged(D.customers.filter((c) => !s || (c.name + " " + c.companyName + " " + c.email).toLowerCase().includes(s)), "customers"); }
    case "/projects": { const s = (q.get("search") || q.get("q") || "").toLowerCase(); return paged(D.projects.filter((x) => !s || (x.name + " " + x.customerName).toLowerCase().includes(s))); }
    case "/reminders": return D.reminders.filter((r) => (!q.get("from") || r.reminderAtUtc >= q.get("from")) && (!q.get("to") || r.reminderAtUtc <= q.get("to") + "T23:59:59Z"));
    case "/tracking/active-sellers": return D.activeSellers;
    case "/visits": return D.visitsToday;
    case "/workdays":
      return D.activeSellers.filter((s) => s.hasOpenWorkday).map((s) => ({ id: s.workdayExternalId, sellerExternalId: s.sellerExternalId, sellerName: s.sellerName, status: "open", startedAtUtc: s.workdayStartedAtUtc, endedAtUtc: null, visitCount: D.visitsToday.filter((v) => v.sellerExternalId === s.sellerExternalId).length, locationCount: 120 }));
    case "/seller-routes":
      return { routePoints: D.anaTrack.map(([latitude, longitude], i) => ({ externalId: `pt-${i}`, capturedAtUtc: D.day(0, 12, 5 + i * 15), latitude, longitude })), segments: [{ type: "LineString", coordinates: D.anaTrack.map(([a, b]) => [b, a]) }], mapMatched: true };
    case "/route-plans": {
      const stops = [D.customers[10], D.customers[0], D.customers[3], D.customers[2], D.customers[8]];
      return { sellerExternalId: "s-ana", sellerName: "Ana Rojas", date: q.get("date") || "2026-11-10", revision: 3, stops: stops.map((c, i) => ({ targetType: "customer", targetExternalId: c.externalId, name: c.companyName, address: c.address, latitude: c.latitude, longitude: c.longitude, visitedAtUtc: i < 2 ? D.day(0, 12 + i * 2, 10) : null })) };
    }
    case "/deliveries": return paged(q.get("projectExternalId") ? deliveries.filter((d) => d.projectExternalId === q.get("projectExternalId")) : deliveries);
    case "/deliveries/origin-branches": return [{ externalId: "br-1", name: "Depósito Parque Industrial", isActive: true }, { externalId: "br-2", name: "Depósito Norte", isActive: true }];
    case "/deliveries/attachment-options":
    case "/project-attachments/options":
      return { maxFileSizeBytes: 10485760, maxFilesPerReceipt: 10, attachmentTypes: [{ value: "photo", label: "Foto", description: "Foto" }], acceptedFormats: [{ description: "Imágenes", extensions: [".jpg", ".png"], contentTypes: ["image/jpeg", "image/png"] }] };
    case "/reports/seller-productivity": {
      const rows = [["s-ana", 92], ["s-luis", 78], ["s-carla", 71], ["s-pedro", 60], ["s-jorge", 44]].map(([s, v], i) => {
        const m = (k) => ({ workedDays: 20 - i, activeHours: Math.round(v * 1.7), visits: v, completedVisits: v - 4, contactedCustomers: Math.round(v * 0.6), newCustomers: 9 - i, completedReminders: Math.round(v * 0.5), overdueReminders: i + 1, averageVisitsPerWorkedDay: +(v / (20 - i)).toFixed(1), reminderComplianceRate: 94 - i * 6, conversionRate: 32 - i * 4, closedProjects: 5 - i, closedAmount: (5 - i) * 61000 })[k];
        const metrics = Object.fromEntries(["workedDays", "activeHours", "visits", "completedVisits", "contactedCustomers", "newCustomers", "completedReminders", "overdueReminders", "averageVisitsPerWorkedDay", "reminderComplianceRate", "conversionRate", "closedProjects", "closedAmount"].map((k) => [k, m(k)]));
        const previous = Object.fromEntries(Object.entries(metrics).map(([k, x]) => [k, +(x * (0.85 + i * 0.06)).toFixed(1)]));
        return { sellerExternalId: s, sellerName: D.sellers.find((x) => x.externalId === s).displayName, current: metrics, previous, variationPercentage: { visits: 15 - i * 7, conversionRate: 8 - i * 5 } };
      });
      return paged(rows);
    }
    case "/reports/projects":
      return paged(D.projects.map((p) => ({ ...p, projectExternalId: p.externalId })));
    case "/report-studio/templates":
      return [
        { id: "t-1", name: "Informe de avance de obra", description: "Fotos, visitas y materiales entregados en la obra", entityType: "project", createdAtUtc: D.day(-20), updatedAtUtc: D.day(-2) },
        { id: "t-2", name: "Acta de visita", description: "Resumen de una visita con firma", entityType: "visit", createdAtUtc: D.day(-20), updatedAtUtc: D.day(-5) },
      ];

    case "/companies/current/user-capacity": return { activeUsers: 8, userLimit: 15 };
    case "/users":
      return paged([D.user, ...D.sellers.map((s, i) => ({ id: 10 + i, externalId: s.externalId, username: s.email.split("@")[0], fullName: s.displayName, email: s.email, roles: ["seller"], isActive: true, status: "active", createdAtUtc: D.day(-90) }))].map((u) => ({ ...u, isActive: true, status: "active" })));
    case "/branches": return [];
  }
  if (/^\/(customers|projects)\/custom-fields$/.test(p) || p === "/custom-fields") return { schemaVersion: 1, definitions: [] };
  if (/custom-fields\/values$/.test(p)) return [];
  if (/^\/(customers|projects)\/[cp]-\d+\/custom-fields$/.test(p))
    return { entityType: seg[0] === "customers" ? "customer" : "project", entityExternalId: seg[1], contract: "custom-fields.v1", schemaVersion: 1, revision: 0, state: "notStarted", completedSchemaVersion: null, definitions: [], values: [], missingRequiredFieldIds: [] };
  if (p === "/project-duplicates") return [];
  if (p === "/roles") return [{ id: 1, name: "admin", displayName: "Administrador" }, { id: 2, name: "supervisor", displayName: "Supervisor" }, { id: 3, name: "seller", displayName: "Vendedor" }];
  if (/^\/customers\/c-\d+$/.test(p)) return D.customers.find((c) => c.externalId === seg[1]);
  if (/^\/projects\/p-\d+$/.test(p)) return D.projects.find((x) => x.externalId === seg[1]);
  if (/^\/projects\/p-\d+\/materials-summary$/.test(p))
    return { items: D.products.slice(0, 4).map(([n, u], j) => { const c = [600, 240, 40, 9000][j]; const d = Math.round(c * [0.7, 0.5, 0.65, 0.8][j]); return { productExternalId: `prod-${j}`, productName: n, unit: u, committedQuantity: c, deliveredQuantity: d, pendingQuantity: c - d }; }) };
  if (/^\/projects\/p-\d+\/timeline$/.test(p))
    return paged([
      ["ProjectVisitCheckOutCreated", "Revisión de avance, bloque B", "Carla Vargas", -0, 13, 50],
      ["ProjectUpdated", "Recepción parcial: 60 hojas de calamina", "Carla Vargas", -1, 15, 0],
      ["ProjectAttachmentAdded", "Foto de losa del piso 3", "Carla Vargas", -2, 16, 20],
      ["ProjectNoteAdded", "El cliente pide adelantar la pintura para el 15", "Carla Vargas", -3, 13, 0],
      ["ProjectUpdated", "Estado: En negociación → En progreso", "Gabriela Torrez", -8, 14, 0],
    ].map(([eventTypeName, title, name, d, h, m], i) => ({ externalId: `tl-${i}`, eventTypeName, title, description: null, occurredAtUtc: D.day(d, h, m), createdBy: { externalId: "x", name } })));
  if (/^\/projects\/p-\d+\/notes$/.test(p)) return [{ externalId: "n-1", content: "El cliente pide adelantar la pintura para el 15 de noviembre.", createdBy: { name: "Carla Vargas" }, occurredAtUtc: D.day(-3, 13) }];
  if (/^\/projects\/p-\d+\/reminders$/.test(p)) return [{ externalId: "pr-1", text: "Confirmar fecha de entrega de pintura", reminderAtUtc: D.day(2, 13), assignedTo: { name: "Carla Vargas" }, completed: false }];
  if (/^\/projects\/p-\d+\/visits$/.test(p)) return [{ externalId: "v-6", projectExternalId: project1.externalId, projectName: project1.name, customerExternalId: "c-3", customerName: "Edificio Torre Equipetrol", visitedAtUtc: D.day(0, 13, 5), checkOutAtUtc: D.day(0, 13, 50), notes: null, result: "Revisión de avance, bloque B", sellerName: "Carla Vargas" }];
  if (/^\/projects\/p-\d+\/attachments$/.test(p)) return [];
  if (/^\/customers\/c-\d+\/(notes|reminders)$/.test(p)) return [];
  if (/^\/customers\/c-\d+\/timeline$/.test(p)) return { items: [], pagination: { page: 1, pageSize: 50, totalItems: 0, totalPages: 0 } };
  if (/^\/deliveries\/d-\d+$/.test(p)) return deliveries.find((d) => d.externalId === seg[1]);
  if (/^\/deliveries\/d-\d+\/attachments$/.test(p)) return { items: [], failedFiles: [] };
  if (/^\/workdays\/[^/]+$/.test(p)) return { ...api("/api/workdays", q)[0], visits: [] };
  if (/^\/workdays\/[^/]+\/locations$/.test(p)) return api("/api/seller-routes", q);
  return undefined;
}

async function setup(page, { loggedIn = true } = {}) {
  await page.clock.setFixedTime(new Date(D.NOW));
  // Leaflet duplica la ruta del ícono por defecto (…/images//node_modules/…); en la captura se pide la correcta.
  await page.route((u) => u.href.includes("leaflet/dist/images//"), (route) => route.continue({ url: APP + "/node_modules/leaflet/dist/images/" + route.request().url().split("/").pop() }));
  await page.route(`${API}/**`, async (route) => {
    const url = new URL(route.request().url());
    const method = route.request().method();
    if (url.pathname === "/api/auth/refresh" && !loggedIn)
      return route.fulfill({ status: 401, contentType: "application/json", body: "{}" });
    if (method === "POST" && url.pathname === "/api/route-plans/path") {
      const pts = D.customers.filter((c) => ["c-11", "c-1", "c-4", "c-3", "c-9"].includes(c.externalId));
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ order: [0, 1, 2, 3, 4], distanceMeters: 14800, geometry: route.request().postDataJSON().points, matched: false }) });
    }
    const data = method === "GET" || url.pathname === "/api/auth/refresh" ? api(url.pathname, url.searchParams) : undefined;
    if (data === undefined) {
      console.log("SIN DATOS:", method, url.pathname + url.search);
      return route.fulfill({ status: 200, contentType: "application/json", body: "[]" });
    }
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(data) });
  });
}

const shots = [
  { name: "ingreso", path: "/login", loggedIn: false, size: [1280, 800] },
  { name: "resumen", path: "/" },
  { name: "buscador", path: "/", run: async (p) => { await p.keyboard.press("Control+k"); await p.waitForTimeout(400); await p.keyboard.type("torre"); } },
  { name: "clientes", path: "/customers" },
  { name: "obra", path: "/projects?selected=p-1" },
  { name: "agenda", path: "/reminders" },
  { name: "equipo-en-vivo", path: "/operations/dashboard" },
  { name: "visitas-en-curso", path: "/operations/active" },
  { name: "rutas", path: "/operations/routes", run: async (p) => { await p.getByLabel("Responsable").first().selectOption({ label: "Ana Rojas" }); } },
  { name: "historial", path: "/operations/history", run: async (p) => { await p.getByLabel("Responsable").first().selectOption({ label: "Ana Rojas" }); await p.waitForTimeout(800); await p.getByRole("button", { name: "Ver día" }).first().click(); } },
  { name: "entrega", path: "/deliveries?selected=d-1" },
  { name: "carga-masiva", path: "/customers/import" },
  { name: "productividad", path: "/operations/productivity" },
  { name: "embudo", path: "/projects/pipeline" },
  { name: "informes", path: "/report-studio/generate?template=t-1&project=p-1" },
  { name: "usuarios", path: "/admin/users" },
  { name: "soporte", path: "/support" },
];

const browser = await chromium.launch();
for (const shot of shots.filter((s) => !only.length || only.includes(s.name))) {
  const [w, h] = shot.size ?? [1440, 900];
  const context = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, locale: "es-BO", timezoneId: "America/La_Paz" });
  const page = await context.newPage();
  page.on("pageerror", (e) => console.log("ERROR JS", shot.name, e.message));

  await setup(page, { loggedIn: shot.loggedIn !== false });
  for (let i = 0; ; i++) { try { await page.goto(APP + shot.path); break; } catch (e) { if (i >= 3) throw e; await new Promise((r) => setTimeout(r, 3000)); } }
  await page.addStyleTag({ content: ".leaflet-tile{opacity:1!important}" });
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1200); await page.waitForFunction(() => [...document.querySelectorAll(".leaflet-tile, .leaflet-marker-icon")].filter((t) => t.tagName === "IMG").every((t) => t.complete), null, { timeout: 15000 }).catch(() => console.log("mosaicos lentos"));
  if (shot.run) { await shot.run(page); await page.waitForLoadState("networkidle"); await page.waitForTimeout(1500); await page.waitForFunction(() => [...document.querySelectorAll(".leaflet-tile, .leaflet-marker-icon")].filter((t) => t.tagName === "IMG").every((t) => t.complete), null, { timeout: 15000 }).catch(() => {}); }
  writeFileSync(join(outDir, `${shot.name}.png`), await page.screenshot());
  console.log("OK", shot.name);
  await context.close();
}
await browser.close();

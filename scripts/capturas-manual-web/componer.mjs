// Paso 2: arma, con las pantallas crudas de capturar.mjs, las imágenes finales.
//   - Web:   manual/web/capturas/<nombre>.webp (1600×1000, fondo claro, sin texto).
//   - Video: <SALIDA_VIDEO>/con-texto y /sin-texto, PNG 1920×1080 con fondo oscuro.
//            SALIDA_VIDEO por defecto es ../UrbanTrack-material/video-plataforma-web.
// Uso: node scripts/capturas-manual-web/componer.mjs [--4k] [nombre...]
import { createRequire } from "node:module";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { escenas } from "./escenas.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, "../..");
const appDir = resolve(process.env.SALES_TRACKING_WEB || join(repo, "../SalesTrackingWeb"));
const { chromium } = createRequire(join(appDir, "package.json"))("@playwright/test");

const args = process.argv.slice(2);
const k4 = args.includes("--4k");
const only = args.filter((a) => !a.startsWith("--"));
const crudas = join(here, "crudas");
const salidaWeb = join(repo, "manual/web/capturas");
const salidaVideo = resolve(process.env.SALIDA_VIDEO || join(repo, "../UrbanTrack-material/video-plataforma-web"));
for (const d of [salidaWeb, join(salidaVideo, "con-texto"), join(salidaVideo, "sin-texto")]) mkdirSync(d, { recursive: true });

const icono = `<img src="${pathToFileURL(join(repo, "assets/logo-192.png")).href}" alt="">`;
const orden = ["buscador", "ingreso", "resumen", "clientes", "obra", "agenda", "equipo-en-vivo", "visitas-en-curso", "rutas", "historial", "entrega", "carga-masiva", "productividad", "embudo", "informes", "usuarios", "soporte"];
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

// Ventana de navegador con la captura completa.
function ventana(e, src, ancho, cw, ch, oscuro) {
  const alto = Math.round((ancho * ch) / cw);
  return `<div class="win ${oscuro ? "dark" : ""}" style="width:${ancho}px">
    <div class="bar"><i></i><i></i><i></i><span>app.urbantrack.io${e.url}</span></div>
    <div class="shot" style="height:${alto}px;background-image:url('${src}')"></div>
  </div>`;
}

// Tarjeta flotante que amplía el detalle.
function lupa(e, src, cw, maxAncho, maxAlto) {
  const z = e.zoom;
  const escala = Math.min(1.9, maxAncho / z.w, maxAlto / z.h);
  return `<div class="zoom">
    <b>${esc(z.etiqueta)}</b>
    <div class="zimg" style="width:${Math.round(z.w * escala)}px;height:${Math.round(z.h * escala)}px;
      background-image:url('${src}');background-size:${Math.round(cw * escala)}px auto;
      background-position:-${Math.round(z.x * escala)}px -${Math.round(z.y * escala)}px"></div>
  </div>`;
}

const css = `
  *{box-sizing:border-box;margin:0}
  body{width:var(--w);height:var(--h);overflow:hidden;font-family:"DM Sans",system-ui,sans-serif;position:relative}
  .bg-dark{background:radial-gradient(900px 700px at 8% 100%,rgba(255,107,23,.32),transparent 70%),
    radial-gradient(800px 600px at 100% 0%,rgba(255,107,23,.16),transparent 70%),#141414}
  .bg-light{background:radial-gradient(800px 600px at 100% 100%,rgba(255,107,23,.22),transparent 70%),
    radial-gradient(700px 500px at 0% 0%,rgba(255,170,90,.18),transparent 70%),#f4efe7}
  .dots{position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.07) 1px,transparent 1px);background-size:28px 28px}
  .bg-light .dots{background-image:radial-gradient(rgba(21,21,21,.06) 1px,transparent 1px)}
  .win{position:relative;overflow:hidden;border-radius:18px;background:#fff;border:1px solid rgba(0,0,0,.12);
    box-shadow:0 50px 100px -30px rgba(0,0,0,.55),0 20px 40px -20px rgba(0,0,0,.35)}
  .win.dark{border-color:rgba(255,255,255,.14);box-shadow:0 60px 120px -30px rgba(0,0,0,.9),0 0 0 1px rgba(255,255,255,.04)}
  .bar{display:flex;align-items:center;gap:8px;height:44px;padding:0 16px;background:#f3f1ec;border-bottom:1px solid #e6e3dc}
  .bar i{width:12px;height:12px;border-radius:50%;background:#ff5f57}.bar i:nth-child(2){background:#febc2e}.bar i:nth-child(3){background:#28c840}
  .bar span{flex:1;margin-left:14px;max-width:560px;padding:6px 14px;border-radius:9px;background:#fff;color:#6b6b6b;font-size:15px}
  .shot{background-size:100% auto;background-repeat:no-repeat}
  .zoom{position:relative;padding:12px;border-radius:20px;background:#fff;
    box-shadow:0 40px 80px -24px rgba(0,0,0,.55),0 0 0 3px #ff6b17}
  .zoom b{position:absolute;top:-17px;left:22px;padding:6px 14px;border-radius:999px;background:#ff6b17;color:#fff;
    font:700 17px Manrope,system-ui,sans-serif;letter-spacing:.01em;box-shadow:0 8px 18px -6px rgba(255,107,23,.7)}
  .zimg{border-radius:10px;background-repeat:no-repeat;border:1px solid #ece8e1}
  .logo{position:absolute;top:52px;left:110px;display:flex;align-items:center;gap:14px;color:#fff;font:800 28px Manrope,system-ui,sans-serif}
  .logo img{width:50px;height:50px;border-radius:12px}.logo em{font-style:normal;color:#ff6b17}
  .copy{position:absolute;left:110px;top:0;bottom:0;width:560px;display:flex;flex-direction:column;justify-content:center}
  .copy small{color:#ff8a45;font:800 20px Manrope,system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase}
  .copy h1{margin:22px 0 34px;color:#fff;font:800 66px/1.04 Manrope,system-ui,sans-serif;letter-spacing:-.03em}
  .copy li{list-style:none;position:relative;margin:0 0 16px;padding-left:30px;color:#c9c6c0;font-size:27px;line-height:1.35}
  .copy li::before{content:"";position:absolute;left:0;top:13px;width:12px;height:12px;border-radius:3px;background:#ff6b17;transform:rotate(45deg)}
  .copy ul{padding:0}
`;

function html(e, variante, src, cw, ch) {
  const logo = `<div class="logo">${icono}<span>UrbanTrack<em>CRM</em></span></div>`;
  if (variante === "web") {
    return `<body class="bg-light" style="--w:1600px;--h:1000px"><div class="dots"></div>
      <div style="position:absolute;left:56px;top:52px">${ventana(e, src, 1330, cw, ch)}</div>
      <div style="position:absolute;right:40px;bottom:40px">${lupa(e, src, cw, 700, 400)}</div></body>`;
  }
  if (variante === "sin-texto") {
    return `<body class="bg-dark" style="--w:1920px;--h:1080px"><div class="dots"></div>${logo}
      <div style="position:absolute;left:170px;top:130px">${ventana(e, src, 1380, cw, ch, true)}</div>
      <div style="position:absolute;right:90px;bottom:70px">${lupa(e, src, cw, 760, 420)}</div></body>`;
  }
  return `<body class="bg-dark" style="--w:1920px;--h:1080px"><div class="dots"></div>${logo}
    <div class="copy"><small>${esc(e.capitulo)}</small><h1>${esc(e.titulo)}</h1>
      <ul>${e.puntos.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div>
    <div style="position:absolute;left:760px;top:150px">${ventana(e, src, 1300, cw, ch, true)}</div>
    <div style="position:absolute;left:640px;bottom:64px">${lupa(e, src, cw, 760, 380)}</div></body>`;
}

const urls = { resumen: "", buscador: "", ingreso: "/login", clientes: "/customers", obra: "/projects",
  agenda: "/reminders", "equipo-en-vivo": "/operations/dashboard", "visitas-en-curso": "/operations/active",
  rutas: "/operations/routes", historial: "/operations/history", entrega: "/deliveries",
  "carga-masiva": "/customers/import", productividad: "/operations/productivity", embudo: "/projects/pipeline",
  informes: "/report-studio/generate", usuarios: "/admin/users", soporte: "/support" };

const browser = await chromium.launch();
const page = await browser.newPage();
const lista = escenas.filter((e) => !only.length || only.includes(e.name));
for (const e of lista) {
  e.url = urls[e.name] ?? "";
  const png = join(crudas, `${e.name}.png`);
  const src = pathToFileURL(png).href;
  const [cw, ch] = e.name === "ingreso" ? [1280, 800] : [1440, 900];
  const n = String(orden.indexOf(e.name) + 1).padStart(2, "0");
  for (const variante of ["web", "con-texto", "sin-texto"]) {
    const [w, h] = variante === "web" ? [1600, 1000] : [1920, 1080];
    await page.setViewportSize({ width: w, height: h });
    const file = join(crudas, "_escena.html");
    writeFileSync(file, `<!doctype html><html><head><meta charset="utf-8">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Manrope:wght@700;800&display=swap" rel="stylesheet">
      <style>${css}</style></head>${html(e, variante, src, cw, ch)}</html>`);
    await page.goto(pathToFileURL(file).href);
    await page.evaluate(() => document.fonts.ready);
    if (variante === "web") {
      const shot = await page.screenshot({ type: "png" });
      const webp = await page.evaluate(async (b64) => {
        const img = new Image(); img.src = "data:image/png;base64," + b64; await img.decode();
        const c = document.createElement("canvas"); c.width = img.width; c.height = img.height;
        c.getContext("2d").drawImage(img, 0, 0); return c.toDataURL("image/webp", 0.88).split(",")[1];
      }, shot.toString("base64"));
      writeFileSync(join(salidaWeb, `${e.name}.webp`), Buffer.from(webp, "base64"));
    } else {
      // En 4K se vuelve a dibujar con el doble de densidad, así el texto sale nítido.
      if (k4) { const p4 = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
        await p4.goto(pathToFileURL(file).href); await p4.evaluate(() => document.fonts.ready);
        await p4.screenshot({ path: join(salidaVideo, variante, `${n}-${e.name}.png`) }); await p4.close(); }
      else await page.screenshot({ path: join(salidaVideo, variante, `${n}-${e.name}.png`) });
    }
  }
  console.log("OK", e.name);
}
await browser.close();

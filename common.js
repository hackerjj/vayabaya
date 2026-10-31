// Lógica compartida entre el menú (index.html) y la página para Uber Eats (uber.html).
const API = "https://proyectobowl-backend.onrender.com/api/data";
const PACKAGING = ["contenedor", "vaso", "empaque", "cuchara", "servilleta", "sticker", "agua mineral"];
// Nombre para el cliente según palabras clave del insumo (los nombres internos traen marca y tienda).
const FRIENDLY = [
  ["avena", "avena"], ["yogurt", "yogurt griego"], ["plátano", "plátano"], ["platano", "plátano"],
  ["fresa", "fresa"], ["zarzamora", "zarzamora"], ["mora", "zarzamora"], ["blueberr", "blueberries"],
  ["mango", "mango"], ["manzana", "manzana"], ["chía", "chía"], ["chia", "chía"],
  ["granola", "granola"], ["granos ancestrales", "granola de granos ancestrales"], ["coco", "coco tostado"],
  ["cocoa", "cacao"], ["cacao", "cacao"], ["vainilla", "vainilla"], ["miel", "miel"], ["canela", "canela"],
  ["acai", "açaí"], ["açaí", "açaí"], ["espirulina", "espirulina"], ["curcuma", "cúrcuma"], ["cúrcuma", "cúrcuma"],
  ["leche", "leche"], ["café", "café"], ["cafe", "café"]
];
const PHOTO = {baby: "bowl-baby", baya: "bowl-baya", apple: "bowl-apple", choco: "bowl-choco", monkey: "bowl-monkey", tropi: "bowl-tropi"};
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const money = n => "$" + Math.round(n).toLocaleString("es-MX");

function friendly(insumo) {
  const n = insumo.nombre.toLowerCase();
  if (PACKAGING.some(k => n.includes(k))) return null;
  for (const [k, v] of FRIENDLY) if (n.includes(k)) return v;
  return insumo.nombre.replace(/\s*\(.*?\)\s*/g, "").trim().toLowerCase() || null;
}
function ingredients(p, insumos) {
  const out = [];
  for (const i of insumos) {
    if (!p.cantidades || !(+p.cantidades[i.id] > 0)) continue;
    const f = friendly(i);
    if (f && !out.includes(f)) out.push(f);
  }
  if (!out.length) return "";
  const s = out.length > 1 ? out.slice(0, -1).join(", ") + " y " + out[out.length - 1] : out[0];
  return s.charAt(0).toUpperCase() + s.slice(1) + ".";
}
function isBowl(p, insumos) {
  return /bowl/i.test(p.nombre) || insumos.some(i => /contenedor/i.test(i.nombre) && +p.cantidades?.[i.id] > 0);
}
function photoFor(p) {
  const k = p.nombre.trim().split(/\s+/)[0].toLowerCase();
  return PHOTO[k] ? `img/fotos/${PHOTO[k]}.jpg` : null;
}


// Descripción para Uber: base común + toppings
function uberDescription(p, insumos) {
  const items = [];
  for (const i of insumos) {
    if (!p.cantidades || !(+p.cantidades[i.id] > 0)) continue;
    const f = friendly(i);
    if (f && !items.includes(f)) items.push(f);
  }
  const base = items.filter(x => x === "avena" || x === "yogurt griego");
  const tops = items.filter(x => !base.includes(x));
  const list = a => a.length > 1 ? a.slice(0, -1).join(", ") + " y " + a[a.length - 1] : (a[0] || "");
  if (base.length === 2 && tops.length) return "Avena remojada y yogurt griego con " + list(tops) + ".";
  const all = list(items);
  return all ? all.charAt(0).toUpperCase() + all.slice(1) + "." : "";
}
async function loadMenuData(onData) {
  try { const r = await fetch("menu.json", {cache: "no-store"}); if (r.ok) onData(await r.json(), false); } catch (e) {}
  try { const r = await fetch(API, {cache: "no-store"}); if (r.ok) onData(await r.json(), true); } catch (e) {}
}

// Vaya Baya · Ayudante para llenar el Menu Maker de Uber Eats
// Uso: en merchants.ubereats.com → Menu Maker, abre la consola (Cmd+Opción+J),
// pega todo este archivo y Enter. Aparece un panel abajo a la derecha.
// 1) Abre "Add category" y da clic en el botón de la categoría → revisa → Save.
// 2) Abre "Add item" y da clic en el botón del producto → revisa → Save.
// El script solo llena campos; nunca guarda por ti.
(() => {
  const MENU = "Desayuno & Brunch";
  const FOTO = k => `https://raw.githubusercontent.com/hackerjj/vayabaya/main/img/uber/uber-bowl-${k}.jpg`;
  const BASE = "Base de overnight avena cremosa (con yogurt griego natural) mezclada con ";
  const CATEGORIAS = ["Bowls", "De temporada", "Bebidas"];
  const PRODUCTOS = [
    {k: "baby",   cat: "Bowls", nombre: "Baby Bowl",      precio: 179, desc: BASE + "cúrcuma, pasta de vainilla y chía hidratada. Banana y fresas. Coco tostado y granos ancestrales."},
    {k: "baya",   cat: "Bowls", nombre: "Baya Bowl",      precio: 229, desc: BASE + "açaí deshidratado, pasta de vainilla y chía hidratada. Bayas (fresas, blueberries y zarzamoras). Coco tostado."},
    {k: "monkey", cat: "Bowls", nombre: "Monkey Bowl",    precio: 169, desc: BASE + "spirulina azul, pasta de vainilla y chía hidratada. Banana y blueberries. Coco tostado."},
    {k: "apple",  cat: "Bowls", nombre: "Apple Pay Bowl", precio: 169, desc: BASE + "canela y pasta de vainilla. Manzana y banana. Granola de granos ancestrales."},
    {k: "choco",  cat: "Bowls", nombre: "Choco Bowl",     precio: 169, desc: BASE + "cocoa y pasta de vainilla. Banana y fresas. Coco tostado."},
    {k: "tropi",  cat: "De temporada", nombre: "Tropi Bowl", precio: 179, desc: BASE + "açaí deshidratado, pasta de vainilla y chía hidratada. Mango y banana. Coco tostado.", nota: "Márcalo como no disponible hasta que haya mango."},
    {k: null, cat: "Bebidas", nombre: "Café americano", precio: 45, desc: "Café americano."},
    {k: null, cat: "Bebidas", nombre: "Café latte",     precio: 65, desc: "Café con leche."},
    {k: null, cat: "Bebidas", nombre: "Agua mineral",   precio: 49, desc: "Agua mineral."}
  ];

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const log = (m, ok = true) => { console.log(`%c[Vaya Baya] ${m}`, `color:${ok ? "#2e7d4f" : "#b00020"}`); status(m, ok); };

  function panel() {
    const asides = [...document.querySelectorAll("aside")].filter(a => a.offsetParent !== null && a.querySelector("input,textarea"));
    return asides[asides.length - 1] || null;
  }
  // Busca el campo por el texto de su etiqueta (Name, Description, Price, Menus...)
  function field(root, labels) {
    labels = [].concat(labels).map(s => s.toLowerCase());
    for (const lab of root.querySelectorAll("label")) {
      const t = lab.textContent.trim().toLowerCase();
      if (!labels.some(l => t === l || t.startsWith(l))) continue;
      let n = lab;
      for (let i = 0; i < 6 && n; i++) {
        const sib = n.nextElementSibling;
        const el = (sib && sib.querySelector("input:not([type=file]),textarea")) || null;
        if (el) return el;
        n = n.parentElement;
      }
    }
    for (const l of labels) {
      const el = root.querySelector(`input[name="${l}"],textarea[name="${l}"],input[name*="${l}" i],textarea[name*="${l}" i]`);
      if (el) return el;
    }
    return null;
  }
  function setVal(el, v) {
    const proto = el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, "value").set.call(el, String(v));
    el.dispatchEvent(new Event("input", {bubbles: true}));
    el.dispatchEvent(new Event("change", {bubbles: true}));
    el.dispatchEvent(new Event("blur", {bubbles: true}));
  }
  async function pick(root, labels, text) {
    const el = field(root, labels);
    if (!el) return false;
    el.focus(); el.click();
    setVal(el, text);
    el.dispatchEvent(new Event("focus", {bubbles: true}));
    for (let i = 0; i < 15; i++) {
      await sleep(200);
      const opt = [...document.querySelectorAll('[role="option"]')].find(o => o.textContent.trim().toLowerCase().includes(text.toLowerCase()));
      if (opt) {
        ["mousedown", "mouseup", "click"].forEach(t => opt.dispatchEvent(new MouseEvent(t, {bubbles: true})));
        await sleep(200);
        return true;
      }
    }
    return false;
  }
  async function photo(root, url) {
    const inp = root.querySelector('input[type="file"]') || document.querySelector('aside input[type="file"], [role="dialog"] input[type="file"]');
    if (!inp) return false;
    const blob = await (await fetch(url)).blob();
    const dt = new DataTransfer();
    dt.items.add(new File([blob], url.split("/").pop(), {type: "image/jpeg"}));
    inp.files = dt.files;
    inp.dispatchEvent(new Event("change", {bubbles: true}));
    return true;
  }

  async function fillCategory(name) {
    const p = panel();
    if (!p) return log('Primero abre "Add category" (botón Add → Category).', false);
    const n = field(p, ["name"]);
    if (!n) return log("No encontré el campo Name en el panel.", false);
    setVal(n, name);
    const okMenu = await pick(p, ["menus", "menu"], MENU);
    log(`Categoría "${name}" lista${okMenu ? ` y asignada a ${MENU}` : `. Asigna el menú ${MENU} a mano`}. Revisa y da Save.`, okMenu);
  }

  async function fillItem(it) {
    const p = panel();
    if (!p) return log('Primero abre "Add item".', false);
    const faltan = [];
    const n = field(p, ["name", "item name", "title"]); n ? setVal(n, it.nombre) : faltan.push("nombre");
    const d = field(p, ["description", "descripción"]); d ? setVal(d, it.desc) : faltan.push("descripción");
    const pr = field(p, ["price", "precio"]); pr ? setVal(pr, it.precio) : faltan.push("precio");
    if (!(await pick(p, ["categories", "category", "categoría"], it.cat))) faltan.push(`categoría (${it.cat})`);
    if (it.k) {
      try { if (!(await photo(p, FOTO(it.k)))) faltan.push("foto: da clic en Add photo y vuelve a presionar el botón, o súbela a mano"); }
      catch (e) { faltan.push("foto (no se pudo descargar)"); }
    }
    log(`${it.nombre}: ${faltan.length ? "llena a mano: " + faltan.join(", ") : "todo lleno"}.${it.nota ? " " + it.nota : ""} Revisa y da Save.`, !faltan.length);
  }

  // ---------- Panel flotante ----------
  document.getElementById("vb-helper")?.remove();
  const box = document.createElement("div");
  box.id = "vb-helper";
  box.style.cssText = "position:fixed;right:16px;bottom:16px;z-index:2147483647;background:#EDE3B2;color:#7A1F37;border:2px solid #7A1F37;border-radius:12px;padding:10px;width:250px;font:13px -apple-system,sans-serif;box-shadow:0 6px 24px rgba(0,0,0,.25);max-height:80vh;overflow:auto";
  const btn = (txt, fn) => { const b = document.createElement("button"); b.textContent = txt; b.style.cssText = "display:block;width:100%;margin:3px 0;padding:6px 8px;border:1px solid #7A1F37;border-radius:8px;background:#fff;color:#7A1F37;font-weight:600;cursor:pointer;text-align:left"; b.onclick = fn; return b; };
  box.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;font-weight:800;margin-bottom:4px">Vaya Baya<span id="vb-x" style="cursor:pointer">×</span></div><div style="font-size:11px;margin-bottom:6px">Abre el panel en Uber, da clic aquí, revisa y Save.</div><div style="font-weight:700;margin-top:4px">Categorías</div>';
  CATEGORIAS.forEach(c => box.appendChild(btn(c, () => fillCategory(c))));
  const h = document.createElement("div"); h.style.cssText = "font-weight:700;margin-top:8px"; h.textContent = "Productos"; box.appendChild(h);
  PRODUCTOS.forEach(it => box.appendChild(btn(`${it.nombre} · $${it.precio}`, () => fillItem(it))));
  const st = document.createElement("div"); st.id = "vb-status"; st.style.cssText = "margin-top:8px;font-size:11px;min-height:28px"; box.appendChild(st);
  document.body.appendChild(box);
  document.getElementById("vb-x").onclick = () => box.remove();
  function status(m, ok) { const s = document.getElementById("vb-status"); if (s) { s.textContent = m; s.style.color = ok ? "#2e7d4f" : "#b00020"; } }
  log("Listo. Abre Add category y da clic en Bowls.");
})();

"""Regenera el menú estático y el PDF de Vaya Baya.

Qué hace:
  1. Baja los datos en vivo (precios y productos del backend, descripciones de Andrea) y
     actualiza las copias locales menu.json y descripciones.json.
  2. Abre index.html en Chrome, toma los bowls y bebidas ya dibujados y los escribe dentro
     del HTML (entre los marcadores PRERENDER). Así el menú se lee sin JavaScript: lo pueden
     importar Uber Eats, Google y cualquier lector.
  3. Escribe los datos estructurados de menú (schema.org, JSON-LD) en el <head>.
  4. Genera vaya-baya-menu.pdf (A4) desde menu-imprimible.html.

Uso (desde la carpeta menu/):
  ../../tools/stepstone-browser/.venv/bin/python tools/build.py

Requiere Playwright con Chrome (el venv de arriba ya lo tiene). Después de correrlo:
revisar los cambios, subir la versión y hacer commit.
"""
import functools
import http.server
import json
import pathlib
import re
import socketserver
import threading
import urllib.request

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
API = "https://proyectobowl-backend.onrender.com/api/data"
DESC_URL = "https://raw.githubusercontent.com/andvelasco/vayabaya/main/menu/descripciones.json"
SITE = "http://vayabaya.foo.ng"  # cambiar a https:// cuando GitHub emita el certificado
PORT = 8080


def fetch_json(url):
    with urllib.request.urlopen(url, timeout=120) as r:
        return json.load(r)


def replace_block(html, name, content):
    pat = re.compile(rf"(<!--PRERENDER:{name}-->)(.*?)(<!--/PRERENDER:{name}-->)", re.S)
    if not pat.search(html):
        raise SystemExit(f"No encontré el marcador PRERENDER:{name} en index.html")
    return pat.sub(lambda m: m.group(1) + content + m.group(3), html)


def json_ld(data, desc):
    ins = {i["id"]: i for i in data.get("insumos", [])}
    def is_bowl(p):
        return "bowl" in p["nombre"].lower() or any(
            "contenedor" in ins.get(k, {}).get("nombre", "").lower() for k, v in (p.get("cantidades") or {}).items() if v)
    def item(p):
        key = p["nombre"].split()[0].lower()
        d = (desc.get("productos") or {}).get(key)
        it = {
            "@type": "MenuItem",
            "name": re.sub(r"\s*\(temporada\)\s*", "", p["nombre"], flags=re.I).strip(),
            "offers": {
                "@type": "Offer", "price": f'{p["precio"]:.2f}', "priceCurrency": "MXN",
                "availability": "https://schema.org/" + ("InStock" if p.get("activo") else "OutOfStock"),
            },
        }
        if d:
            it["description"] = " ".join(x for x in (d.get("base"), d.get("fruta"), d.get("topping")) if x)
        if is_bowl(p) and (ROOT / f"img/fotos/bowl-{key}.jpg").exists():
            it["image"] = f"{SITE}/img/fotos/bowl-{key}.jpg"
        return it
    prods = data.get("productos", [])
    ld = {
        "@context": "https://schema.org",
        "@type": "Restaurant",
        "name": "Vaya Baya",
        "url": f"{SITE}/",
        "image": f"{SITE}/img/logo-vainilla-2-lineas.png",
        "servesCuisine": ["Desayunos", "Saludable", "Café"],
        "address": {"@type": "PostalAddress", "addressLocality": "Ciudad de México",
                    "addressRegion": "CDMX", "addressCountry": "MX"},
        "hasMenu": {
            "@type": "Menu", "name": "Menú Vaya Baya", "inLanguage": "es-MX",
            "hasMenuSection": [
                {"@type": "MenuSection", "name": "Bowls", "hasMenuItem": [item(p) for p in prods if is_bowl(p)]},
                {"@type": "MenuSection", "name": "Bebidas",
                 "hasMenuItem": [item(p) for p in prods if not is_bowl(p) and p.get("activo")]},
            ],
        },
    }
    return '\n<script type="application/ld+json">\n' + json.dumps(ld, ensure_ascii=False, indent=1) + "\n</script>\n"


def main():
    data = fetch_json(API)
    desc = fetch_json(DESC_URL)
    snap = {"productos": [{k: p[k] for k in ("id", "nombre", "precio", "activo", "cantidades")} for p in data["productos"]],
            "insumos": [{"id": i["id"], "nombre": i["nombre"]} for i in data["insumos"]]}
    (ROOT / "menu.json").write_text(json.dumps(snap, ensure_ascii=False, indent=1) + "\n")
    (ROOT / "descripciones.json").write_text(json.dumps(desc, ensure_ascii=False, indent=2) + "\n")
    print("datos:", len(snap["productos"]), "productos,", len(desc.get("productos", {})), "descripciones")

    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass
    handler = functools.partial(Quiet, directory=str(ROOT))
    socketserver.TCPServer.allow_reuse_address = True
    srv = socketserver.TCPServer(("127.0.0.1", PORT), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    try:
        with sync_playwright() as pw:
            b = pw.chromium.launch(channel="chrome", headless=True)
            pg = b.new_page()
            pg.goto(f"http://localhost:{PORT}/index.html")
            pg.wait_for_function("document.querySelectorAll('#bowlGrid .card').length > 0 && document.querySelectorAll('#drinkList li').length > 0", timeout=120000)
            pg.wait_for_timeout(1500)
            bowls = pg.inner_html("#bowlGrid").strip()
            drinks = pg.inner_html("#drinkList").strip()
            print("prerender:", pg.locator("#bowlGrid .card").count(), "bowls,", pg.locator("#drinkList li").count(), "bebidas")

            html = (ROOT / "index.html").read_text()
            html = replace_block(html, "bowls", "\n" + bowls + "\n  ")
            html = replace_block(html, "drinks", "\n" + drinks + "\n  ")
            html = replace_block(html, "jsonld", json_ld(data, desc))
            (ROOT / "index.html").write_text(html)

            pp = b.new_page()
            pp.goto(f"http://localhost:{PORT}/menu-imprimible.html")
            pp.wait_for_function("document.body.dataset.ready === '1'", timeout=120000)
            pp.wait_for_load_state("networkidle")
            pp.pdf(path=str(ROOT / "vaya-baya-menu.pdf"), format="A4", print_background=True,
                   margin={"top": "0", "right": "0", "bottom": "0", "left": "0"}, prefer_css_page_size=True)
            print("pdf:", (ROOT / "vaya-baya-menu.pdf").stat().st_size // 1024, "KB")
            b.close()
    finally:
        srv.shutdown()


if __name__ == "__main__":
    main()

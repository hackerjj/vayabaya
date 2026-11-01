# Changelog

Menú público de Vaya Baya. Lo más reciente arriba. La misma lista vive en el chip de versión
del pie de página.

## v1.6 — 01 nov 2026 · 14:46
### Agregado
- Prerender: `tools/build.py` abre el menú en Chrome y escribe los bowls y bebidas dentro de
  `index.html` (marcadores `PRERENDER`), para que se lea sin JavaScript (importador de Uber
  Eats, Google). El JavaScript sigue actualizando precios en vivo encima.
- JSON-LD `Restaurant` → `Menu` → `MenuSection` → `MenuItem` con precio en MXN y
  disponibilidad.
- `menu-imprimible.html` y `vaya-baya-menu.pdf` (A4, una página), con link de descarga en el
  pie del menú.
### Cambiado
- Canonical, og:url y og:image en `http://` hasta que salga el certificado HTTPS.

## v1.5 — 31 oct 2026 · 18:11
### Agregado
- Dominio propio `vayabaya.foo.ng` (archivo `CNAME`, PR #364 de Pokymon/foo.ng). La URL
  `hackerjj.github.io/vayabaya/` redirige al dominio nuevo. Canonical y og:url actualizados.

## v1.4 — 31 oct 2026 · 16:45
### Corregido
- Las tarjetas del menú recortaban la base de Andrea; ahora muestran el texto completo
  ("Base de overnight avena cremosa (con yogurt griego natural) mezclada con ...").

## v1.3 — 31 oct 2026 · 16:42
### Agregado
- Descripciones oficiales (Base, Fruta, Topping) leídas de
  `andvelasco/vayabaya/menu/descripciones.json`, con copia local `descripciones.json` de
  respaldo. Si falta un bowl, se usa la lista automática de ingredientes.
- Nota de Andrea sobre el azúcar al pie del menú.
### Cambiado
- `uber.html`: descripción de cada producto con el texto completo de Andrea.

## v1.2 — 31 oct 2026 · 16:27
### Cambiado
- Bowls en 2 columnas (3 renglones) en todas las pantallas; ancho máximo de 860 px.

## v1.1 — 31 oct 2026 · 16:05
### Agregado
- `uber.html`: material para Uber Eats. Fotos de producto en 5:4 (2048 × 1638, JPG) recortadas
  de las originales de 2048 × 2048, portada de 2880 × 2304 (tres bowls sobre frambuesa, sin
  texto) y nombre, descripción, precio y categoría por producto con botón de copiar. Precios
  en vivo del backend.
### Cambiado
- Paleta limitada a los dos colores de marca: vainilla `#EDE3B2` y frambuesa `#7A1F37`.
- Logo y favicon recoloreados a esos valores exactos (el PNG original traía `#7B1934`).
- Lógica de ingredientes compartida en `common.js`.

## v1.0 — 31 oct 2026 · 15:53
### Agregado
- Menú con bowls y bebidas: foto, ingredientes y precio de cada producto.
- Precios y disponibilidad en vivo desde el backend de Proyecto Bowl
  (`proyectobowl-backend.onrender.com/api/data`). Un producto inactivo aparece como "Agotado".
- Copia local `menu.json` para que abra al instante aunque Render esté dormido.
- Favicon, logo y colores de marca (frambuesa #7A1F37, vainilla #EDE3B2).

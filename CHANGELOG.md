# Changelog

Menú público de Vaya Baya. Lo más reciente arriba. La misma lista vive en el chip de versión
del pie de página.

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

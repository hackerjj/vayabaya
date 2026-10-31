# Vaya Baya · Menú

**Vaya Baya** es una dark kitchen de bowls en la Colonia Obrera, Ciudad de México. Cada bowl
lleva una base de overnight avena cremosa con yogurt griego natural, fruta y un topping
crujiente. También vendemos café y bebidas. La venta es por Uber Eats, por pedido directo y
para recoger en mostrador.

Este repo es el **menú público** y la **página con el material para Uber Eats**.

## Enlaces

| Qué | Link | Para quién |
|---|---|---|
| Menú | https://hackerjj.github.io/vayabaya/ | Clientes |
| Material para Uber Eats | https://hackerjj.github.io/vayabaya/uber.html | Equipo (fotos, textos y precios para subir a Uber) |
| Calculadora de costos y precios | https://hackerjj.github.io/proyectobowl/ | Equipo (insumos, recetas, márgenes) |
| Marca, fotos y descripciones | https://github.com/andvelasco/vayabaya | Equipo |
| Dominio propio | https://vayabaya.foo.ng/ | En trámite ([PR #364](https://github.com/Pokymon/foo.ng/pull/364)). Cuando se active, los links de arriba redirigen solos. |

## Menú

| Bowl | Base mezclada con | Fruta | Topping |
|---|---|---|---|
| Baby Bowl | Cúrcuma, pasta de vainilla y chía hidratada | Banana y fresas | Coco tostado y granos ancestrales |
| Baya Bowl | Açaí deshidratado, pasta de vainilla y chía hidratada | Fresas, blueberries y zarzamoras | Coco tostado |
| Monkey Bowl | Spirulina azul, pasta de vainilla y chía hidratada | Banana y blueberries | Coco tostado |
| Apple Pay Bowl | Canela y pasta de vainilla | Manzana y banana | Granola de granos ancestrales |
| Choco Bowl | Cocoa y pasta de vainilla | Banana y fresas | Coco tostado |
| Tropi Bowl (temporada de mango) | Açaí deshidratado, pasta de vainilla y chía hidratada | Mango y banana | Coco tostado |

Bebidas: café americano, café latte y agua mineral. Porción de bowl: 750 ml.

Los precios no van en este README porque cambian. Están en vivo en el menú.

## Cómo se actualiza

El menú no se edita a mano. Lee tres fuentes:

| Qué cambia | Dónde se cambia | Cuándo se ve |
|---|---|---|
| Precios y si un bowl está activo o agotado | Calculadora → Insumos y recetas (con PIN) | Al recargar el menú |
| Descripciones (base, fruta, topping) | `menu/descripciones.json` en [andvelasco/vayabaya](https://github.com/andvelasco/vayabaya) | En un par de minutos |
| Fotos | Este repo, `img/fotos/` (menú) y `img/uber/` (Uber) | Al publicar |

El menú abre al instante con una copia guardada (`menu.json` y `descripciones.json`) y
luego carga los datos en vivo. Así no se queda en blanco cuando el servidor está dormido.

## Archivos

```
index.html           menú público
uber.html            material para Uber Eats (no indexado, sin link desde el menú)
common.js            lógica compartida: ingredientes, descripciones, carga de datos
menu.json            copia de respaldo de productos y precios
descripciones.json   copia de respaldo de las descripciones de Andrea
img/
  fotos/             fotos del menú, 1200 x 1200
  uber/              fotos de producto 5:4 (2048 x 1638) y portada 2880 x 2304
  logo-*.png, favicon-*.png, apple-touch-icon.png
CHANGELOG.md         historial de versiones (también en el chip del pie de página)
```

## Uber Eats

`uber.html` tiene todo lo necesario para dar de alta el menú: portada, una foto por bowl,
y nombre, descripción, precio y categoría con botón de copiar. Los formatos siguen la
[guía de fotos de Uber](https://help.uber.com/es/merchants-and-restaurants/article/merchant-submitted-menu-catalog-photo-guidelines?nodeId=6985355b-0426-4523-94f2-89bb9b0566e9):

- Producto: JPG en 5:4, un solo producto centrado, sin texto ni logos.
- Portada: JPEG de 2880 × 2304 px, varios productos, fondo simple, sin texto.

**Las fotos actuales están generadas con IA.** Sirven como guía. Para Uber conviene
reemplazarlas por fotos reales del bowl en el contenedor de entrega, porque Uber pide que la
foto represente con precisión lo que recibe el cliente. Para cambiarlas basta con subir las
nuevas con el mismo nombre en `img/uber/` y `img/fotos/`.

## Marca

Solo dos colores:

| Color | HEX |
|---|---|
| Frambuesa | `#7A1F37` |
| Vainilla | `#EDE3B2` |

Logos originales en [andvelasco/vayabaya/logos](https://github.com/andvelasco/vayabaya/tree/main/logos).

## Técnico

- Sitio estático en GitHub Pages, rama `main`, sin paso de build.
- Datos en vivo: `https://proyectobowl-backend.onrender.com/api/data` (Node en Render, plan
  free; puede tardar unos segundos en despertar). CORS permite `hackerjj.github.io` y
  `vayabaya.foo.ng`.
- Para probar en local: `python3 -m http.server 8080` dentro de esta carpeta y abrir
  `http://localhost:8080/`. El backend acepta ese origen.
- Cada cambio sube la versión del chip del pie de página y agrega una entrada en
  `CHANGELOG.md`, con fecha y hora de CDMX.

# PROMPT 01 — DESIGN SYSTEM PREMIUM Y COMPONENTES REUTILIZABLES

Actúa como un director de arte digital y frontend engineer senior especializado en e-commerce de lujo.

Trabaja sobre la arquitectura existente del proyecto ESSENCE & TIME. No reconstruyas el proyecto desde cero ni cambies las tecnologías definidas.

Tu objetivo es implementar un sistema visual completo y reutilizable antes de desarrollar las páginas individuales.

## A. IDENTIDAD VISUAL

Crea una identidad premium, cálida, editorial y sofisticada.

Utiliza la paleta definida en el prompt maestro.

Implementa variables CSS para:

- Colores.
- Tipografías.
- Escala de espaciado.
- Anchos máximos.
- Radios.
- Bordes.
- Sombras.
- Transiciones.
- Capas y z-index.
- Breakpoints complementarios.
- Duración y curvas de animación.

No disperses valores arbitrarios por los archivos CSS.

## B. TIPOGRAFÍA Y COMPOSICIÓN

Diseña una escala tipográfica que combine elegancia editorial con legibilidad comercial.

Los titulares deben tener personalidad. Los precios, botones, filtros y formularios deben ser fáciles de leer.

Utiliza clamp() para adaptar tamaños sin generar saltos visuales.

Define clases reutilizables para títulos de sección, subtítulos, textos secundarios, etiquetas, precios, titulares de campaña y descripciones.

## C. COMPONENTES

Implementa los siguientes componentes:

1. Barra informativa.
2. Header principal.
3. Navegación desktop.
4. Menú móvil.
5. Mega menú.
6. Buscador.
7. Sugerencias de búsqueda.
8. Icono de favoritos con contador.
9. Icono de carrito con contador.
10. Minicarrito.
11. Breadcrumbs.
12. Título de página.
13. Tarjeta de producto.
14. Etiquetas de producto.
15. Precio y precio anterior.
16. Botón principal.
17. Botón secundario.
18. Botón de icono.
19. Selector de ordenamiento.
20. Filtros.
21. Paginación.
22. Carrusel de productos.
23. Bloque editorial.
24. Banner promocional.
25. Formulario de suscripción.
26. Toast de notificación.
27. Modal accesible.
28. Acordeón.
29. Estado vacío.
30. Footer.

## D. TARJETA DE PRODUCTO

Diseña una tarjeta premium con:

- Fotografía protagonista.
- Proporción consistente.
- Fondo limpio.
- Etiqueta opcional de novedad o descuento.
- Botón de favoritos.
- Nombre del producto.
- Marca.
- Precio actual.
- Precio anterior cuando corresponda.
- Botón de compra rápida cuando sea apropiado.
- Estados de carga y disponibilidad.

El botón de favoritos no debe ocultar la fotografía.

En escritorio puedes implementar un cambio de imagen al pasar el cursor si existe una segunda fotografía válida. En móvil, la interacción debe ser accesible sin hover.

No añadas valoraciones ficticias.

## E. HEADER Y FOOTER

Implementa el header y footer con una estrategia compatible con HTML independiente.

Si decides cargar fragmentos compartidos mediante JavaScript, garantiza que:

- Todos los archivos se puedan ejecutar mediante un servidor local.
- Los recursos no dependan de rutas incorrectas.
- Los scripts se inicialicen una sola vez.
- Los elementos compartidos sean accesibles.
- El contenido principal no quede vacío si falla un componente esencial.

## F. ANIMACIONES

Configura GSAP en un módulo central.

Crea funciones reutilizables para revelar elementos, animar titulares, mostrar notificaciones y animar el minicarrito.

No apliques automáticamente animaciones a todos los elementos.

Respeta prefers-reduced-motion y evita efectos que perjudiquen el rendimiento.

## G. VALIDACIÓN

Antes de finalizar:

- Revisa consistencia visual.
- Revisa los estilos responsive.
- Comprueba estados hover y focus.
- Comprueba navegación por teclado.
- Elimina CSS duplicado.
- Comprueba que los componentes se puedan utilizar en varias páginas.
- Confirma que los scripts no produzcan errores.

Implementa los archivos, no te limites a dar recomendaciones. Después presenta un resumen de lo creado y cualquier decisión técnica importante.
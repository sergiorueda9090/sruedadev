# PROMPT 07 — FICHA DE PRODUCTO PREMIUM

Desarrolla la página de detalle de producto más importante del e-commerce.

Debe inspirarse en las mejores experiencias de compra de perfumería y relojería de lujo, sin copiar directamente la identidad de otras marcas.

La página debe funcionar para perfumes, lociones y relojes mediante datos dinámicos del catálogo centralizado.

## 1. ESTRUCTURA

Incluye:

- Header global.
- Breadcrumbs.
- Galería de imágenes.
- Información comercial.
- Selector de variantes cuando corresponda.
- Descripción.
- Características.
- Productos relacionados.
- Footer global.

## 2. GALERÍA

En escritorio, crea una composición de dos columnas: galería amplia a la izquierda y panel de compra a la derecha.

La galería debe incluir:

- Imagen principal de gran tamaño.
- Miniaturas.
- Cambio de imagen al seleccionar miniaturas.
- Modal para ampliar la imagen.
- Navegación por teclado.
- Controles accesibles.

En móvil, la galería debe convertirse en un carrusel cómodo, con indicadores claros.

Utiliza imágenes reales y verificadas del catálogo. No inventes URLs de imágenes.

## 3. INFORMACIÓN DEL PRODUCTO

Muestra:

- Marca.
- Nombre.
- Referencia o SKU cuando exista.
- Precio en COP.
- Precio anterior solo cuando exista un descuento válido.
- Disponibilidad.
- Descripción corta.
- Opciones o variantes.
- Cantidad.
- Botón “Añadir al carrito”.
- Botón de favoritos.
- Información configurable sobre envío y devoluciones.

No inventes valoraciones. Si existen valoraciones de demostración, deben estar identificadas como tales.

## 4. ESPECIFICACIONES DE PERFUMES

Cuando los datos existan, presenta:

- Volumen en ml.
- Concentración.
- Familia olfativa.
- Notas de salida.
- Notas de corazón.
- Notas de fondo.
- Género comercial.

Organiza la información mediante bloques editoriales o acordeones.

No rellenes campos desconocidos con datos inventados.

## 5. ESPECIFICACIONES DE LOCIONES

Cuando corresponda, muestra:

- Tipo de producto.
- Volumen.
- Marca.
- Modo de uso proporcionado por la fuente del producto.
- Características relevantes.

No realices afirmaciones médicas o dermatológicas no respaldadas.

## 6. ESPECIFICACIONES DE RELOJES

Cuando existan datos, presenta:

- Material de caja.
- Material de correa.
- Diámetro de caja.
- Tipo de mecanismo.
- Color de esfera.
- Resistencia al agua.
- Garantía comercial configurada.

No inventes especificaciones ni certificaciones.

## 7. ACCIÓN DE COMPRA

Al añadir un producto:

- Validar la cantidad.
- Validar la variante seleccionada.
- Verificar disponibilidad simulada.
- Actualizar el carrito.
- Persistir los datos en localStorage.
- Actualizar el contador global.
- Mostrar una notificación accesible.
- Ofrecer continuar comprando o ir al carrito.

No añadas automáticamente el producto dos veces.

## 8. PRODUCTOS RELACIONADOS

Muestra entre cuatro y seis productos relacionados según categoría, marca o etiquetas.

Los productos deben provenir del catálogo real de demostración.

## 9. URL Y ERRORES

Permite identificar el producto mediante un slug o ID válido.

Si el producto no existe, muestra una página de producto no encontrado con enlaces al catálogo.

## 10. CRITERIOS DE CALIDAD

La ficha debe transmitir confianza, permitir inspeccionar el producto y facilitar la compra.

No debe haber botones decorativos que no hagan nada.

Implementa el archivo, prueba diferentes tipos de productos y corrige cualquier error de selección, precio, imagen o carrito.
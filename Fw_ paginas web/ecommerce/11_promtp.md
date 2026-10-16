# PROMPT 10 — CARRITO DE COMPRA

Construye un carrito funcional y visualmente sofisticado.

## 1. DISEÑO

Titular: “Tu selección”.

En escritorio, utiliza dos columnas:

- Lista de productos.
- Resumen del pedido.

En móvil, muestra primero los productos y después un resumen compacto, con un CTA claramente visible.

## 2. PRODUCTOS

Cada línea debe mostrar:

- Miniatura.
- Marca.
- Nombre.
- Variante seleccionada cuando exista.
- Precio unitario.
- Selector de cantidad.
- Subtotal de la línea.
- Acción de eliminar.

## 3. RESUMEN

Calcula:

- Subtotal.
- Descuento válido.
- Costo de envío según configuración.
- Total final.

Todos los cálculos deben basarse en los datos del catálogo y en las reglas de demostración.

Nunca permitas cantidades negativas, precios negativos o descuentos arbitrarios.

## 4. CUPONES

Implementa un sistema de cupones de demostración con códigos definidos en la configuración.

Muestra mensajes claros para códigos válidos, inválidos o expirados.

No simules conexión con plataformas externas.

## 5. ESTADOS

Diseña:

- Carrito vacío.
- Carrito con productos.
- Producto no disponible.
- Error al actualizar cantidades.
- Cupón aplicado.
- Confirmación al eliminar un producto.

## 6. ACCIONES

Incluye:

- Seguir comprando.
- Actualizar cantidad.
- Eliminar producto.
- Aplicar cupón.
- Continuar al checkout.

El carrito debe persistir entre páginas mediante localStorage.

Comprueba que los totales sean consistentes en todos los escenarios.
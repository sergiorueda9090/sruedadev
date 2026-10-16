# PROMPT 11 — CHECKOUT DE DEMOSTRACIÓN

Construye un checkout profesional para la tienda ESSENCE & TIME.

IMPORTANTE: esta versión es únicamente frontend. No proceses pagos reales, no recolectes datos bancarios y no afirmes que una compra se ha realizado realmente.

## 1. DISEÑO

Utiliza una composición sencilla, limpia y enfocada en completar el pedido.

Reduce distracciones. Mantén la identidad visual de la tienda.

En escritorio, presenta formulario y resumen en columnas. En móvil, organiza el contenido verticalmente.

## 2. FORMULARIO

Incluye campos para:

- Nombre.
- Apellidos.
- Correo electrónico.
- Teléfono.
- Departamento.
- Ciudad.
- Dirección.
- Información adicional opcional.

Utiliza etiquetas visibles, validación y mensajes de error claros.

No pidas documentos personales innecesarios.

## 3. ENTREGA

Permite seleccionar entre las opciones de entrega de demostración que estén configuradas.

No inventes tiempos de entrega ni tarifas comerciales.

## 4. RESUMEN

Muestra los productos, cantidades, subtotal, descuentos, envío y total.

Evita discrepancias con el carrito.

## 5. MÉTODO DE PAGO

Puedes mostrar opciones visuales de demostración, claramente marcadas como no conectadas.

No solicites números de tarjetas, CVV ni credenciales bancarias.

## 6. CONFIRMACIÓN

Al validar el formulario, genera un número de pedido de demostración y navega a la página de confirmación.

El pedido debe identificarse claramente como una simulación local, sin enviar información a terceros ni afirmar que se ha procesado un pago real.

## 7. PRIVACIDAD Y SEGURIDAD

No almacenes innecesariamente los datos personales del formulario en localStorage.

No incluyas datos sensibles en la URL.

No envíes información personal a servicios externos.

Implementa validación frontend y documenta que una versión comercial requiere backend, validación en servidor, gestión de pedidos y una integración de pago segura.

Prueba los campos vacíos, correos inválidos, carrito vacío y envío del formulario.
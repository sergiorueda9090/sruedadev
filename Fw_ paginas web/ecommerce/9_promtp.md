# PROMPT 08 — BUSCADOR Y RESULTADOS

Implementa una página de resultados de búsqueda conectada con el catálogo centralizado.

## REQUISITOS

1. Leer el término de búsqueda desde un parámetro URL, por ejemplo ?q=perfume.
2. Mostrar el término buscado.
3. Buscar por nombre, marca, categoría y atributos relevantes.
4. Normalizar mayúsculas y minúsculas.
5. Gestionar correctamente acentos.
6. Mostrar la cantidad de resultados.
7. Permitir ordenar por precio y nombre.
8. Permitir aplicar filtros compatibles.
9. Ofrecer sugerencias cuando existan productos similares.
10. Mostrar búsquedas sin resultados de manera útil.

Crea un estado vacío elegante con un mensaje como:

“No encontramos coincidencias. Prueba con otra marca o categoría.”

Incluye enlaces a perfumes, lociones y relojes.

En el header, añade sugerencias accesibles mientras el usuario escribe, con navegación por teclado y cierre mediante Escape.

Evita consultas innecesarias y no introduzcas una biblioteca adicional si JavaScript nativo es suficiente.

Implementa y prueba búsquedas con tildes, términos parciales, marcas y resultados inexistentes.
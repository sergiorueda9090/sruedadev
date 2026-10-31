// Recorta bootstrap.min.css 5.3.3 a las clases que usa el sitio.
// Regenerar tras usar clases nuevas de Bootstrap (requiere Node):
//   npx purgecss@6 --config tools/purgecss.config.cjs --output tools/purged/
// y renombrar la salida a bootstrap-5.3.3.purged.min.css. El original se descarga de
// https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css a tools/bootstrap-5.3.3.min.css.
module.exports = {
  content: ['index.html', 'privacidad.html', 'condiciones.html', '404.html', 'assets/js/*.js'],
  css: ['tools/bootstrap-5.3.3.min.css'],
  // Clases que añade el JavaScript de Bootstrap (collapse/acordeón) o main.js en tiempo de ejecución.
  safelist: { standard: [/^collaps/, /^show$/, /^accordion/, /^col-/, /^row/, /^g-/, /^is-invalid/, /^visually-hidden/, /^navbar/, /^nav-/], greedy: [/^form-/] },
  variables: true,
  keyframes: true
};

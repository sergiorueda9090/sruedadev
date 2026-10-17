/*
 * Nodo Ingeniería Integral: comportamiento propio del sitio.
 * Depende de js/config.js (window.SITE), images/credits.js y ../shared/js/core.js (window.CES).
 */
(function () {
  'use strict';

  const { CES } = window;
  const SITE = window.SITE || {};
  if (!CES) return;

  /* ---------- 1. Textos alternativos desde credits.js ---------- */

  /** Completa los alt vacíos a partir del slot de cada imagen (images/<slot>-800.webp). */
  function fillAltTexts() {
    CES.$$('img[src^="images/"]').forEach((img) => {
      const match = img.getAttribute('src').match(/images\/(.+)-(?:800|1600)\.webp$/);
      if (match && !img.getAttribute('alt')) img.alt = CES.altFor(match[1], '');
    });
    CES.$$('[data-lightbox-item]').forEach((item) => {
      const img = CES.$('img', item);
      if (img && !item.dataset.alt) item.dataset.alt = img.alt;
    });
  }

  /* ---------- 2. Matriz disciplinas × etapas ---------- */

  function initMatrix() {
    const matrix = CES.$('[data-matrix]');
    if (!matrix) return;
    const rows = CES.$$('tbody tr[data-row]', matrix);
    const stages = CES.$$('.matrix__stage', matrix);
    const cells = CES.$$('[data-col]', matrix).filter((node) => node.tagName === 'TD');
    const hint = CES.$('.matrix__stage-hint', matrix);
    const stageTexts = CES.$$('[data-stage-text]', matrix);

    const highlightRow = (rowKey) => {
      rows.forEach((row) => row.classList.toggle('is-active', row.dataset.row === rowKey));
    };

    const selectStage = (colKey) => {
      stages.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.col === colKey)));
      cells.forEach((cell) => cell.classList.toggle('is-col-active', cell.dataset.col === colKey));
      stages.forEach((button) => button.closest('th').classList.toggle('is-col-active', button.dataset.col === colKey));
      stageTexts.forEach((node) => { node.hidden = node.dataset.stageText !== colKey; });
      if (hint) hint.hidden = Boolean(colKey);
      matrix.classList.toggle('has-stage', Boolean(colKey));
    };

    CES.initTabs(CES.$('[role="tablist"]', matrix), (tab) => highlightRow(tab.dataset.row));

    stages.forEach((button) => {
      button.addEventListener('click', () => {
        const active = button.getAttribute('aria-pressed') === 'true';
        selectStage(active ? '' : button.dataset.col);
      });
    });

    // Clic en el nombre de una fila de la tabla = elegir esa disciplina.
    rows.forEach((row) => {
      const header = CES.$('th', row);
      if (!header) return;
      header.addEventListener('click', () => {
        const tab = CES.$(`[role="tab"][data-row="${row.dataset.row}"]`, matrix);
        if (tab) tab.click();
      });
    });
  }

  /* ---------- 3. Formulario B2B ---------- */

  function whatsappText(data) {
    const lines = [
      `Hola, soy ${data.nombre || ''}${data.cargo ? `, ${data.cargo}` : ''} de ${data.empresa || ''}.`,
      'Quiero solicitar una reunión técnica con Nodo Ingeniería Integral.',
      `Sector: ${data.sector || ''}`,
      `Disciplinas: ${data.disciplinas || ''}`,
      `Etapa: ${data.etapa || ''}`,
      `Ubicación: ${data.ubicacion || ''}`,
      data.plazo ? `Plazo estimado de inicio: ${data.plazo}` : '',
      `Descripción: ${data.descripcion || ''}`,
      `Correo: ${data.email || ''}${data.telefono ? ` Teléfono: ${data.telefono}` : ''}`
    ];
    return lines.filter(Boolean).join('\n');
  }

  /* ---------- 4. Arranque ---------- */

  CES.init(SITE);
  fillAltTexts();
  initMatrix();
  CES.initForm(CES.$('#form-contacto'), SITE, {
    whatsappText,
    subject: 'Solicitud de reunión técnica desde el sitio web',
    successText: 'Recibimos su solicitud. Un especialista le escribirá al correo que indicó.'
  });
  CES.initLightbox(CES.$('[data-gallery]'));
  CES.initAOS();
})();

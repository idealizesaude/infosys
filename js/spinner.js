// js/spinner.js

/**
 * Exibe o overlay de carregamento, garantindo override com !important
 */
export function showSpinner() {
  document.querySelectorAll('#spinner-overlay').forEach(ov =>
    ov.style.setProperty('display', 'flex', 'important')
  );
}

/**
 * Oculta o overlay de carregamento, garantindo override com !important
 */
export function hideSpinner() {
  document.querySelectorAll('#spinner-overlay').forEach(ov =>
    ov.style.setProperty('display', 'none', 'important')
  );
}
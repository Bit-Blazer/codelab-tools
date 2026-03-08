/**
 * Codelab Catalog Component
 * Custom catalog browser for codelabs
 */

goog.module('googlecodelabs.CodelabCatalogDef');
const CodelabCatalog = goog.require('googlecodelabs.CodelabCatalog');

try {
  window.customElements.define(CodelabCatalog.getTagName(), CodelabCatalog);
} catch (e) {
  console.warn('googlecodelabs.CodelabCatalog', e);
}

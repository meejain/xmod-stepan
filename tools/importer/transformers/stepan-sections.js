/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Stepan section breaks and section-metadata.
 * Adds <hr> between sections and section-metadata blocks for styled sections.
 *
 * IMPORTANT: Runs in beforeTransform so that original DOM selectors still exist.
 * Parsers run after this and replace block elements, but the <hr> and
 * section-metadata tables inserted here survive because they are siblings,
 * not the elements being replaced.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element.getRootNode() };
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    // Process sections in reverse order so insertions don't shift later selectors
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const selector = Array.isArray(section.selector) ? section.selector : [section.selector];

      // Find the first matching element for this section
      let sectionEl = null;
      for (const sel of selector) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }

      if (!sectionEl) continue;

      // Add section-metadata block if section has a style
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(metaBlock);
      }

      // Add <hr> before each section (except the first) when there is content before it
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}

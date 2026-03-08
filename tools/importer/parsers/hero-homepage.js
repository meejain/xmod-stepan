/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-homepage. Base: hero. Source: https://www.stepan.com/
 * Selector: .homepagehero .page-hero
 * Structure: Row 1 = background image, Row 2 = heading + description + CTA (single cell)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Row 1: Background image (direct child of .page-hero element)
  const bgImage = element.querySelector(':scope > img');
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: Content - heading, description, CTA combined in single cell
  const contentDiv = document.createElement('div');
  const heading = element.querySelector('.cmp-text h1, h1');
  if (heading) contentDiv.append(heading);

  // Description paragraph (second .cmp-text block)
  const textBlocks = element.querySelectorAll('.cmp-text');
  if (textBlocks.length > 1) {
    const desc = textBlocks[1].querySelector('p');
    if (desc) contentDiv.append(desc);
  }

  // CTA link
  const cta = element.querySelector('.linkcalltoaction a, a.btn');
  if (cta) contentDiv.append(cta);

  if (contentDiv.childElementCount > 0) {
    cells.push([contentDiv]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-homepage', cells });
  element.replaceWith(block);
}

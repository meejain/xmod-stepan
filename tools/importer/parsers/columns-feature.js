/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-feature. Base: columns. Source: https://www.stepan.com/
 * Selectors: .responsivegrid.our-membership.our-membership-image-left,
 *            .responsivegrid.our-membership.our-membership-image-right
 * Structure: 1 row, 2 columns - image on one side, text+CTA on other
 */
export default function parse(element, { document }) {
  const cells = [];
  const isImageLeft = element.classList.contains('our-membership-image-left');

  // Extract image
  const imageCol = document.createElement('div');
  const img = element.querySelector('.image img, .cmp-image img, img');
  if (img) imageCol.append(img);

  // Extract text content
  const textCol = document.createElement('div');
  const heading = element.querySelector('.title h1, .title h2, h1, h2');
  if (heading) textCol.append(heading);
  const desc = element.querySelector('.cmp-text p, .text p');
  if (desc) textCol.append(desc);
  const cta = element.querySelector('.linkcalltoaction a, a.btn');
  if (cta) textCol.append(cta);

  // Arrange columns based on image position
  if (isImageLeft) {
    cells.push([imageCol, textCol]);
  } else {
    cells.push([textCol, imageCol]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}

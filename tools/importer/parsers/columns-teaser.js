/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-teaser. Base: columns. Source: https://www.stepan.com/
 * Selectors: .dualteaser (about section), .columnrow.vertical-align:has(.subtitle) (sales rep)
 * Structure: 1 row, 2 columns - varies by instance
 */
export default function parse(element, { document }) {
  const cells = [];

  // Detect which instance this is
  const isDualTeaser = element.classList.contains('dualteaser');

  if (isDualTeaser) {
    // About / Dual Teaser: left = text+CTA, right = document teasers
    const leftCol = document.createElement('div');
    const heading = element.querySelector('h2');
    if (heading) leftCol.append(heading);
    const desc = element.querySelector('p:not(.dualteaser__teased-title)');
    if (desc) leftCol.append(desc);
    const cta = element.querySelector('a.linkcalltoaction, a.btn-secondary');
    if (cta) leftCol.append(cta);

    const rightCol = document.createElement('div');
    // Find teaser items by their title elements
    const teaserTitles = element.querySelectorAll('.dualteaser__teased-title');
    teaserTitles.forEach((title) => {
      // Navigate up to the parent link wrapping this teaser
      const link = title.closest('a');
      if (link) {
        const img = link.querySelector('img');
        if (img) {
          const teaserLink = document.createElement('a');
          teaserLink.href = link.href;
          teaserLink.append(img);
          rightCol.append(teaserLink);
        }
        const titleP = document.createElement('p');
        titleP.textContent = title.textContent.trim();
        rightCol.append(titleP);
      }
    });

    cells.push([leftCol, rightCol]);
  } else {
    // Sales Rep: left = heading + text + CTAs, right = image
    const leftCol = document.createElement('div');
    const heading = element.querySelector('.subtitle h2, h2');
    if (heading) leftCol.append(heading);
    const text = element.querySelector('.text .cmp-text p, .cmp-text p');
    if (text) leftCol.append(text);
    const ctaLinks = element.querySelectorAll('.linkcalltoaction a, a.btn');
    ctaLinks.forEach((cta) => leftCol.append(cta));

    const rightCol = document.createElement('div');
    const img = element.querySelector('.cmp-image__image, .image img, .cmp-image img');
    if (img) rightCol.append(img);

    cells.push([leftCol, rightCol]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-teaser', cells });
  element.replaceWith(block);
}

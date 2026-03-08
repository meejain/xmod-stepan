/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-stats. Base: columns. Source: https://www.stepan.com/
 * Selector: .columnrow.vertical-align:has(.statisticlist)
 * Structure: 1 row, 2 columns - left = heading+description, right = statistics
 */
export default function parse(element, { document }) {
  const cells = [];
  const cols = element.querySelectorAll(':scope > .row > .col, :scope .row > .col');

  // Left column: heading + description
  const leftCol = document.createElement('div');
  const firstCol = cols[0];
  if (firstCol) {
    const heading = firstCol.querySelector('h2');
    if (heading) leftCol.append(heading);
    const desc = firstCol.querySelector('.cmp-text p, .text p, p');
    if (desc) leftCol.append(desc);
  }

  // Right column: statistics list
  const rightCol = document.createElement('div');
  const secondCol = cols[1] || element;
  const statItems = secondCol.querySelectorAll('.statisticlist_list-item');
  statItems.forEach((item) => {
    const link = item.querySelector('a');
    const titleEl = item.querySelector('.statisticlist_list-item_title');
    const descEl = item.querySelector('.statisticlist_list-item_desc');
    if (titleEl && descEl) {
      const hasPlus = titleEl.classList.contains('has_plus');
      const number = titleEl.textContent.trim();
      const label = descEl.textContent.trim();
      const statText = hasPlus ? `${number}+` : number;

      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = statText;
      p.append(strong);
      p.append(` ${label}`);

      if (link) {
        const a = document.createElement('a');
        a.href = link.href;
        a.append(p);
        rightCol.append(a);
      } else {
        rightCol.append(p);
      }
    }
  });

  cells.push([leftCol, rightCol]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-stats', cells });
  element.replaceWith(block);
}

const STAT_ICONS = [
  '/icons/stat-products.svg',
  '/icons/stat-formulations.svg',
  '/icons/stat-markets.svg',
  '/icons/stat-global.svg',
];

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-stats-${cols.length}-cols`);

  // Add red underline bar to the left column heading
  const leftCol = cols[0];
  if (leftCol) {
    leftCol.classList.add('columns-stats-info');
  }

  // Add SVG icons to each stat card in the right column
  const rightCol = cols[1];
  if (rightCol) {
    const statCards = rightCol.querySelectorAll(':scope > p');
    statCards.forEach((card, index) => {
      if (index < STAT_ICONS.length) {
        const icon = document.createElement('img');
        icon.src = STAT_ICONS[index];
        icon.alt = '';
        icon.classList.add('columns-stats-icon');
        icon.loading = 'lazy';
        icon.width = 58;
        icon.height = 55;

        // Insert icon at the beginning of the link or the card
        const link = card.querySelector('a');
        if (link) {
          link.prepend(icon);
        } else {
          card.prepend(icon);
        }
      }
    });
  }
}

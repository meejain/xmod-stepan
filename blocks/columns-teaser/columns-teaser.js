export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-teaser-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-teaser-img-col');
        }
      }
    });
  });

  // Detect and restructure report card pattern in right column:
  // <p><a><img></a></p><p>label</p> pairs → card elements
  const rightCol = block.querySelector(':scope > div > div:last-child');
  if (!rightCol) return;

  const linkedImages = rightCol.querySelectorAll(':scope > p > a > img');
  if (linkedImages.length >= 2) {
    block.classList.add('has-report-cards');
    const paragraphs = [...rightCol.children];
    const cards = [];

    for (let i = 0; i < paragraphs.length; i += 1) {
      const p = paragraphs[i];
      const link = p.querySelector('a > img')?.parentElement;
      if (link) {
        const card = document.createElement('div');
        card.className = 'report-card';

        // Move the image into the card
        const img = link.querySelector('img');
        card.appendChild(img);

        // Add gradient overlay for title readability
        const gradient = document.createElement('div');
        gradient.className = 'report-card-gradient';
        card.appendChild(gradient);

        // Check if next paragraph is a text label (no link/image inside)
        const next = paragraphs[i + 1];
        if (next && !next.querySelector('a') && !next.querySelector('img')) {
          const title = document.createElement('span');
          title.className = 'report-card-title';
          title.textContent = next.textContent;
          card.appendChild(title);
          i += 1; // skip the label paragraph
        }

        // Wrap the card in the original link
        const cardLink = document.createElement('a');
        cardLink.href = link.href;
        cardLink.className = 'report-card-link';
        cardLink.appendChild(card);
        cards.push(cardLink);
      }
    }

    // Replace right column content with restructured cards
    rightCol.innerHTML = '';
    cards.forEach((card) => rightCol.appendChild(card));
  }
}

import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && (div.querySelector('picture') || div.querySelector('img'))) {
        div.className = 'cards-news-card-image';
      } else {
        div.className = 'cards-news-card-body';
      }
    });

    // Add arrow indicator at bottom-right of card (matching original structure)
    const arrow = document.createElement('div');
    arrow.className = 'cards-news-arrow';
    arrow.innerHTML = '<i class="cards-news-right-arrow"></i><div class="cards-news-triangle"></div>';
    li.append(arrow);

    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);

  // Carousel navigation
  const nav = document.createElement('div');
  nav.className = 'cards-news-nav';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'cards-news-btn cards-news-btn-prev';
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.innerHTML = '<span class="cards-news-chevron-left"></span>';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'cards-news-btn cards-news-btn-next';
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.innerHTML = '<span class="cards-news-chevron-right"></span>';

  const seeAll = document.createElement('a');
  seeAll.className = 'cards-news-see-all';
  seeAll.href = '/content/stepan-dot-com/en/news-events/news---events.html';
  seeAll.textContent = 'SEE ALL NEWS & EVENTS';

  nav.append(prevBtn);
  nav.append(nextBtn);
  nav.append(seeAll);
  block.append(nav);

  // Page-based carousel scroll (scrolls by full visible width)
  const updateButtons = () => {
    prevBtn.disabled = ul.scrollLeft <= 0;
    nextBtn.disabled = ul.scrollLeft >= ul.scrollWidth - ul.offsetWidth - 1;
  };

  const scrollCarousel = (direction) => {
    const pageWidth = ul.offsetWidth;
    const maxScroll = ul.scrollWidth - ul.offsetWidth;
    const target = direction === 'next'
      ? Math.min(maxScroll, ul.scrollLeft + pageWidth)
      : Math.max(0, ul.scrollLeft - pageWidth);

    // Temporarily disable scroll-snap to prevent it from fighting scrollTo
    ul.style.scrollSnapType = 'none';
    ul.scrollTo({ left: target, behavior: 'smooth' });

    // Re-enable scroll-snap after scroll completes
    setTimeout(() => {
      ul.style.scrollSnapType = '';
      updateButtons();
    }, 500);
  };

  prevBtn.addEventListener('click', () => scrollCarousel('prev'));
  nextBtn.addEventListener('click', () => scrollCarousel('next'));

  ul.addEventListener('scroll', () => {
    updateButtons();
  });

  // Initial state
  setTimeout(updateButtons, 100);
}

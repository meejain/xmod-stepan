import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Restructure the links section into 3 columns grouped by h5 headings.
 * EDS flattens the authored divs into a single default-content-wrapper
 * with h5, ul, h5, ul, h5, ul. We need to re-group them into column divs
 * to match the original 3-column grid: Quick Links | Connect With Us | Member of
 */
function buildLinksColumns(section) {
  const wrapper = section.querySelector('.default-content-wrapper');
  if (!wrapper) return;

  const columns = [];
  let currentCol = null;

  [...wrapper.children].forEach((el) => {
    if (el.tagName === 'H5') {
      currentCol = document.createElement('div');
      currentCol.append(el);
      columns.push(currentCol);
    } else if (currentCol) {
      currentCol.append(el);
    }
  });

  // Replace the default-content-wrapper content with grouped columns
  wrapper.replaceChildren(...columns);
  wrapper.classList.remove('default-content-wrapper');
  wrapper.classList.add('footer-links-grid');
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  let fragment = await loadFragment(footerPath);
  if (!fragment && !footerMeta) {
    fragment = await loadFragment('/content/footer');
  }

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  if (fragment) {
    while (fragment.firstElementChild) footer.append(fragment.firstElementChild);
  }

  // Restructure links section (section 2) into 3 columns
  const sections = footer.querySelectorAll('.section');
  if (sections[1]) {
    buildLinksColumns(sections[1]);
  }

  block.append(footer);
}

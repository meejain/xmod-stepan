/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-news. Base: cards. Source: https://www.stepan.com/
 * Selector: .carousel.news
 * Structure: Each row = [image, date + title + description + link]
 * Only first carousel panel (3 most recent news items)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Get news items from the first carousel panel only
  const firstPanel = element.querySelector('.cmp-carousel__item--active, .cmp-carousel__item:first-child');
  const container = firstPanel || element;
  const newsItems = container.querySelectorAll('.teaser-list_item');

  newsItems.forEach((item) => {
    // Image cell
    const img = item.querySelector('.teaser-list_item_image img, img');

    // Text content cell
    const textCol = document.createElement('div');

    const date = item.querySelector('.teaser-list_item-date');
    if (date) {
      const datePara = document.createElement('p');
      datePara.textContent = date.textContent.trim();
      textCol.append(datePara);
    }

    const titleLink = item.querySelector('.teaser-list_item-title a, h2 a');
    if (titleLink) {
      const h3 = document.createElement('h3');
      const a = document.createElement('a');
      a.href = titleLink.href;
      a.textContent = titleLink.textContent.trim();
      h3.append(a);
      textCol.append(h3);
    }

    const desc = item.querySelector('.teaser-list_item-desc');
    if (desc) {
      const descPara = document.createElement('p');
      descPara.textContent = desc.textContent.trim();
      textCol.append(descPara);
    }

    const readMore = item.querySelector('a.teaser-list_item-link');
    if (readMore) {
      const linkPara = document.createElement('p');
      const a = document.createElement('a');
      a.href = readMore.href;
      a.textContent = 'Read more';
      linkPara.append(a);
      textCol.append(linkPara);
    }

    if (img || textCol.childElementCount > 0) {
      cells.push([img || '', textCol]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-news', cells });
  element.replaceWith(block);
}

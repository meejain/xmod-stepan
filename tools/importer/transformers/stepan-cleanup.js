/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Stepan site cleanup.
 * Selectors from captured DOM of https://www.stepan.com/
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie consent (OneTrust) - found in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      '.optanon-alert-box-wrapper',
      '[class*="onetrust"]',
    ]);

    // Remove carousel navigation controls (Previous/Next buttons, indicators)
    WebImporter.DOMUtils.remove(element, [
      '.cmp-carousel__actions',
      '.cmp-carousel__indicators',
      '.carousel-handlers',
    ]);

    // Convert hero CSS background-image to <img> tag so parser can capture it
    // (transformBackgroundImages may not handle shorthand 'background:' property reliably)
    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element.getRootNode() };
    const pageHero = element.querySelector('.page-hero');
    if (pageHero) {
      const bgStyle = pageHero.style.backgroundImage || '';
      const bgShorthand = pageHero.style.background || '';
      const bgUrl = (bgStyle || bgShorthand).match(/url\(["']?([^"')]+)["']?\)/);
      if (bgUrl && bgUrl[1]) {
        const img = document.createElement('img');
        img.src = bgUrl[1];
        pageHero.prepend(img);
        pageHero.style.backgroundImage = '';
        pageHero.style.background = '';
      }
    }

    // Move newsletter signup section out of footer before footer removal
    // The .containerSubscribe is inside footer.containerPagefooter inside div.pagefooter
    // Must move before .pagefooter so it survives both footer and .pagefooter removal
    const newsletter = element.querySelector('.containerSubscribe');
    const pagefooter = element.querySelector('.pagefooter');
    if (newsletter && pagefooter && pagefooter.contains(newsletter)) {
      pagefooter.parentNode.insertBefore(newsletter, pagefooter);
    }
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove header - found as .pageheader in captured DOM
    WebImporter.DOMUtils.remove(element, [
      'header.pageheader',
      '.pageheader',
    ]);

    // Remove footer - found as .pagefooter / .containerPagefooter in captured DOM
    WebImporter.DOMUtils.remove(element, [
      'footer.containerPagefooter',
      '.pagefooter',
    ]);

    // Remove nav elements
    WebImporter.DOMUtils.remove(element, [
      '.nav-hamburger-menu',
      '.site-nav',
      '.nav-menu',
    ]);

    // Remove non-authorable elements
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
      'noscript',
    ]);

    // Remove empty text/content divs
    element.querySelectorAll('.text').forEach((el) => {
      if (!el.textContent.trim() && !el.querySelector('img')) {
        el.remove();
      }
    });

    // Remove empty contentbreak divs
    element.querySelectorAll('.contentbreak').forEach((el) => {
      if (!el.textContent.trim() && !el.querySelector('img') && !el.querySelector('table')) {
        el.remove();
      }
    });
  }
}

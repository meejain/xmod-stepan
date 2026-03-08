import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    if (!nav) return;

    // Close utility dropdowns
    nav.querySelectorAll('.nav-dropdown-toggle[aria-expanded="true"]').forEach((t) => {
      t.setAttribute('aria-expanded', 'false');
    });

    // Close nav section dropdowns
    const expanded = nav.querySelector('.nav-sections li[aria-expanded="true"]');
    if (expanded && isDesktop.matches) {
      expanded.setAttribute('aria-expanded', 'false');
      expanded.querySelector(':scope > a')?.focus();
    } else if (!isDesktop.matches && nav.getAttribute('aria-expanded') === 'true') {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, false);
    }
  }
}

function toggleMenu(nav, forceExpanded = null) {
  const expanded = forceExpanded !== null
    ? !forceExpanded
    : nav.getAttribute('aria-expanded') === 'true';

  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');

  const button = nav.querySelector('.nav-hamburger button');
  if (button) {
    button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  }

  // Collapse all section dropdowns
  nav.querySelectorAll('.nav-sections li[aria-expanded]').forEach((li) => {
    li.setAttribute('aria-expanded', 'false');
  });

  if (!expanded) {
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

function buildUtilityBar(toolsSection) {
  const utilityBar = document.createElement('div');
  utilityBar.className = 'nav-utility';

  // Left: utility links (Contact Us, Careers, Login)
  const utilLinks = document.createElement('div');
  utilLinks.className = 'nav-utility-links';

  if (toolsSection) {
    toolsSection.querySelectorAll('a').forEach((a) => {
      const link = a.cloneNode(true);
      link.className = 'nav-utility-link';
      // Remove any button classes added by EDS decoration
      link.classList.remove('button', 'primary', 'secondary');
      utilLinks.append(link);
    });
  }

  // Right: search + language + region
  const utilActions = document.createElement('div');
  utilActions.className = 'nav-utility-actions';

  // Search
  const searchItem = document.createElement('div');
  searchItem.className = 'nav-search';
  searchItem.innerHTML = `<form class="nav-search-form" action="/content/stepan-dot-com/en/search.html" method="get">
      <span class="nav-search-icon"></span>
      <input type="text" name="q" placeholder="Search" class="nav-search-input" autocomplete="off">
      <button type="submit" class="nav-search-btn" aria-label="Search"></button>
    </form>`;
  utilActions.append(searchItem);

  // Language dropdown
  const langItem = document.createElement('div');
  langItem.className = 'nav-dropdown-item';
  langItem.innerHTML = `<button class="nav-dropdown-toggle" aria-expanded="false">
      <span class="nav-dropdown-icon nav-dropdown-icon-globe"></span>
      <span class="nav-dropdown-label">Language</span>
      <span class="nav-dropdown-chevron"></span>
    </button>
    <ul class="nav-dropdown-menu">
      <li><a href="/">English (US)</a></li>
      <li><a href="https://pt.stepan.com/">Português (BR)</a></li>
      <li><a href="https://es.stepan.com/">Español</a></li>
    </ul>`;
  utilActions.append(langItem);

  // Region dropdown
  const regionItem = document.createElement('div');
  regionItem.className = 'nav-dropdown-item';
  regionItem.innerHTML = `<button class="nav-dropdown-toggle" aria-expanded="false">
      <span class="nav-dropdown-icon nav-dropdown-icon-pin"></span>
      <span class="nav-dropdown-label">Region</span>
      <span class="nav-dropdown-chevron"></span>
    </button>
    <ul class="nav-dropdown-menu">
      <li><a href="#">Global</a></li>
      <li><a href="#">North America</a></li>
      <li><a href="#">Latin America</a></li>
      <li><a href="#">EMEA</a></li>
      <li><a href="#">Asia Pacific</a></li>
      <li><a href="#">Mercosur</a></li>
    </ul>`;
  utilActions.append(regionItem);

  utilityBar.append(utilLinks);
  utilityBar.append(utilActions);

  // Dropdown toggle handlers
  utilityBar.querySelectorAll('.nav-dropdown-toggle').forEach((toggle) => {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const wasExpanded = toggle.getAttribute('aria-expanded') === 'true';
      // Close all dropdowns first
      utilityBar.querySelectorAll('.nav-dropdown-toggle').forEach((t) => {
        t.setAttribute('aria-expanded', 'false');
      });
      if (!wasExpanded) {
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', () => {
    utilityBar.querySelectorAll('.nav-dropdown-toggle').forEach((t) => {
      t.setAttribute('aria-expanded', 'false');
    });
  });

  // Prevent dropdown menu clicks from closing
  utilityBar.querySelectorAll('.nav-dropdown-menu').forEach((menu) => {
    menu.addEventListener('click', (e) => e.stopPropagation());
  });

  return utilityBar;
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/content/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-expanded', 'false');

  if (fragment) {
    // Extract sections from fragment (spread to avoid infinite loop)
    const sections = [...fragment.children];

    const [brandSection, sectionsSection, toolsSection] = sections;

    // Assign classes
    if (brandSection) brandSection.className = 'nav-brand';
    if (sectionsSection) sectionsSection.className = 'nav-sections';

    // Clean up brand link (remove button decoration)
    if (brandSection) {
      const brandLink = brandSection.querySelector('.button');
      if (brandLink) {
        brandLink.className = '';
        const container = brandLink.closest('.button-container');
        if (container) container.className = '';
      }
    }

    // Build utility bar from tools section
    const utilityBar = buildUtilityBar(toolsSection);

    // Build main nav row
    const mainNavRow = document.createElement('div');
    mainNavRow.className = 'nav-main';

    if (brandSection) mainNavRow.append(brandSection);

    if (sectionsSection) {
      // Unwrap <p> elements from nav list items
      // EDS wraps link text in <p> tags, producing li > p > a instead of li > a
      // which breaks CSS selectors and JS queries that expect direct children
      sectionsSection.querySelectorAll('li > p').forEach((p) => {
        while (p.firstChild) {
          p.parentElement.insertBefore(p.firstChild, p);
        }
        p.remove();
      });

      // Setup dropdown support for nav items
      const navList = sectionsSection.querySelector(':scope ul');
      if (navList) {
        [...navList.children].forEach((li) => {
          if (li.querySelector('ul')) {
            li.classList.add('nav-drop');
            li.setAttribute('aria-expanded', 'false');

            // Desktop: hover to open
            li.addEventListener('mouseenter', () => {
              if (isDesktop.matches) li.setAttribute('aria-expanded', 'true');
            });
            li.addEventListener('mouseleave', () => {
              if (isDesktop.matches) li.setAttribute('aria-expanded', 'false');
            });

            // Mobile: click to toggle
            const topLink = li.querySelector(':scope > a');
            if (topLink) {
              topLink.addEventListener('click', (e) => {
                if (!isDesktop.matches) {
                  e.preventDefault();
                  const exp = li.getAttribute('aria-expanded') === 'true';
                  // Close siblings
                  [...li.parentElement.children].forEach((sib) => {
                    sib.setAttribute('aria-expanded', 'false');
                  });
                  li.setAttribute('aria-expanded', exp ? 'false' : 'true');
                }
              });
            }
          }
        });
      }
      mainNavRow.append(sectionsSection);
    }

    // Hamburger
    const hamburger = document.createElement('div');
    hamburger.className = 'nav-hamburger';
    hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
    hamburger.addEventListener('click', () => toggleMenu(nav));

    // Assemble nav
    nav.append(utilityBar);
    nav.append(mainNavRow);
    nav.append(hamburger);

    // Responsive toggle
    isDesktop.addEventListener('change', () => toggleMenu(nav, isDesktop.matches));
    toggleMenu(nav, isDesktop.matches);
  }

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}

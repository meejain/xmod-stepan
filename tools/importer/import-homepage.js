/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroHomepageParser from './parsers/hero-homepage.js';
import columnsTeaserParser from './parsers/columns-teaser.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import columnsStatsParser from './parsers/columns-stats.js';
import cardsNewsParser from './parsers/cards-news.js';

// TRANSFORMER IMPORTS
import stepanCleanupTransformer from './transformers/stepan-cleanup.js';
import stepanSectionsTransformer from './transformers/stepan-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-homepage': heroHomepageParser,
  'columns-teaser': columnsTeaserParser,
  'columns-feature': columnsFeatureParser,
  'columns-stats': columnsStatsParser,
  'cards-news': cardsNewsParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Stepan Company homepage with hero, product categories, news, and company information',
  urls: [
    'https://www.stepan.com/',
  ],
  blocks: [
    {
      name: 'hero-homepage',
      instances: ['.homepagehero .page-hero'],
    },
    {
      name: 'columns-teaser',
      instances: ['.dualteaser', '.columnrow.vertical-align:has(.subtitle)'],
    },
    {
      name: 'columns-feature',
      instances: ['.responsivegrid.our-membership.our-membership-image-left', '.responsivegrid.our-membership.our-membership-image-right'],
    },
    {
      name: 'columns-stats',
      instances: ['.columnrow.vertical-align:has(.statisticlist)'],
    },
    {
      name: 'cards-news',
      instances: ['.carousel.news'],
    },
  ],
  sections: [
    {
      id: 'section-1-hero',
      name: 'Hero Banner',
      selector: '.homepagehero.pagehero',
      style: null,
      blocks: ['hero-homepage'],
      defaultContent: [],
    },
    {
      id: 'section-2-about',
      name: 'About / Dual Teaser',
      selector: '.contentbreak.pagesection.no-background > .content-break > .container > .aem-Grid > .contentbreak:first-child',
      style: null,
      blocks: ['columns-teaser'],
      defaultContent: [],
    },
    {
      id: 'section-3-innovation',
      name: 'Innovation',
      selector: '.responsivegrid.our-membership.our-membership-image-left',
      style: 'dark-blue',
      blocks: ['columns-feature'],
      defaultContent: [],
    },
    {
      id: 'section-4-sustainability',
      name: 'Sustainability',
      selector: '.responsivegrid.our-membership.our-membership-image-right',
      style: null,
      blocks: ['columns-feature'],
      defaultContent: [],
    },
    {
      id: 'section-5-stats',
      name: 'R&D Statistics',
      selector: '.columnrow.vertical-align:has(.statisticlist)',
      style: null,
      blocks: ['columns-stats'],
      defaultContent: [],
    },
    {
      id: 'section-6-news',
      name: 'News',
      selector: '.contentbreak.pagesection:has(.carousel.news)',
      style: null,
      blocks: ['cards-news'],
      defaultContent: ['h2#heading-1957008094', '.cmp-carousel__action--linkButton'],
    },
    {
      id: 'section-7-sales-rep',
      name: 'Find a Sales Representative',
      selector: '.columnrow.vertical-align:has(.subtitle)',
      style: null,
      blocks: ['columns-teaser'],
      defaultContent: [],
    },
    {
      id: 'section-8-newsletter',
      name: 'Newsletter Signup',
      selector: '.containerSubscribe',
      style: 'dark-blue',
      blocks: [],
      defaultContent: ['.titleSubscribe', '.labelSubscribe', '.subscribeNow'],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  stepanCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [stepanSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers
    executeTransformers('beforeTransform', main, payload);

    // 2. Convert CSS background-images to <img> tags BEFORE parsers run
    //    (parsers replace elements, so bg-images must be extracted first)
    WebImporter.rules.transformBackgroundImages(main, document);

    // 3. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 6. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};

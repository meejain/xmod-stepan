var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-homepage.js
  function parse(element, { document }) {
    const cells = [];
    const bgImage = element.querySelector(":scope > img");
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentDiv = document.createElement("div");
    const heading = element.querySelector(".cmp-text h1, h1");
    if (heading) contentDiv.append(heading);
    const textBlocks = element.querySelectorAll(".cmp-text");
    if (textBlocks.length > 1) {
      const desc = textBlocks[1].querySelector("p");
      if (desc) contentDiv.append(desc);
    }
    const cta = element.querySelector(".linkcalltoaction a, a.btn");
    if (cta) contentDiv.append(cta);
    if (contentDiv.childElementCount > 0) {
      cells.push([contentDiv]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-homepage", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-teaser.js
  function parse2(element, { document }) {
    const cells = [];
    const isDualTeaser = element.classList.contains("dualteaser");
    if (isDualTeaser) {
      const leftCol = document.createElement("div");
      const heading = element.querySelector("h2");
      if (heading) leftCol.append(heading);
      const desc = element.querySelector("p:not(.dualteaser__teased-title)");
      if (desc) leftCol.append(desc);
      const cta = element.querySelector("a.linkcalltoaction, a.btn-secondary");
      if (cta) leftCol.append(cta);
      const rightCol = document.createElement("div");
      const teaserTitles = element.querySelectorAll(".dualteaser__teased-title");
      teaserTitles.forEach((title) => {
        const link = title.closest("a");
        if (link) {
          const img = link.querySelector("img");
          if (img) {
            const teaserLink = document.createElement("a");
            teaserLink.href = link.href;
            teaserLink.append(img);
            rightCol.append(teaserLink);
          }
          const titleP = document.createElement("p");
          titleP.textContent = title.textContent.trim();
          rightCol.append(titleP);
        }
      });
      cells.push([leftCol, rightCol]);
    } else {
      const leftCol = document.createElement("div");
      const heading = element.querySelector(".subtitle h2, h2");
      if (heading) leftCol.append(heading);
      const text = element.querySelector(".text .cmp-text p, .cmp-text p");
      if (text) leftCol.append(text);
      const ctaLinks = element.querySelectorAll(".linkcalltoaction a, a.btn");
      ctaLinks.forEach((cta) => leftCol.append(cta));
      const rightCol = document.createElement("div");
      const img = element.querySelector(".cmp-image__image, .image img, .cmp-image img");
      if (img) rightCol.append(img);
      cells.push([leftCol, rightCol]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-teaser", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feature.js
  function parse3(element, { document }) {
    const cells = [];
    const isImageLeft = element.classList.contains("our-membership-image-left");
    const imageCol = document.createElement("div");
    const img = element.querySelector(".image img, .cmp-image img, img");
    if (img) imageCol.append(img);
    const textCol = document.createElement("div");
    const heading = element.querySelector(".title h1, .title h2, h1, h2");
    if (heading) textCol.append(heading);
    const desc = element.querySelector(".cmp-text p, .text p");
    if (desc) textCol.append(desc);
    const cta = element.querySelector(".linkcalltoaction a, a.btn");
    if (cta) textCol.append(cta);
    if (isImageLeft) {
      cells.push([imageCol, textCol]);
    } else {
      cells.push([textCol, imageCol]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-stats.js
  function parse4(element, { document }) {
    const cells = [];
    const cols = element.querySelectorAll(":scope > .row > .col, :scope .row > .col");
    const leftCol = document.createElement("div");
    const firstCol = cols[0];
    if (firstCol) {
      const heading = firstCol.querySelector("h2");
      if (heading) leftCol.append(heading);
      const desc = firstCol.querySelector(".cmp-text p, .text p, p");
      if (desc) leftCol.append(desc);
    }
    const rightCol = document.createElement("div");
    const secondCol = cols[1] || element;
    const statItems = secondCol.querySelectorAll(".statisticlist_list-item");
    statItems.forEach((item) => {
      const link = item.querySelector("a");
      const titleEl = item.querySelector(".statisticlist_list-item_title");
      const descEl = item.querySelector(".statisticlist_list-item_desc");
      if (titleEl && descEl) {
        const hasPlus = titleEl.classList.contains("has_plus");
        const number = titleEl.textContent.trim();
        const label = descEl.textContent.trim();
        const statText = hasPlus ? `${number}+` : number;
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = statText;
        p.append(strong);
        p.append(` ${label}`);
        if (link) {
          const a = document.createElement("a");
          a.href = link.href;
          a.append(p);
          rightCol.append(a);
        } else {
          rightCol.append(p);
        }
      }
    });
    cells.push([leftCol, rightCol]);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-stats", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-news.js
  function parse5(element, { document }) {
    const cells = [];
    const firstPanel = element.querySelector(".cmp-carousel__item--active, .cmp-carousel__item:first-child");
    const container = firstPanel || element;
    const newsItems = container.querySelectorAll(".teaser-list_item");
    newsItems.forEach((item) => {
      const img = item.querySelector(".teaser-list_item_image img, img");
      const textCol = document.createElement("div");
      const date = item.querySelector(".teaser-list_item-date");
      if (date) {
        const datePara = document.createElement("p");
        datePara.textContent = date.textContent.trim();
        textCol.append(datePara);
      }
      const titleLink = item.querySelector(".teaser-list_item-title a, h2 a");
      if (titleLink) {
        const h3 = document.createElement("h3");
        const a = document.createElement("a");
        a.href = titleLink.href;
        a.textContent = titleLink.textContent.trim();
        h3.append(a);
        textCol.append(h3);
      }
      const desc = item.querySelector(".teaser-list_item-desc");
      if (desc) {
        const descPara = document.createElement("p");
        descPara.textContent = desc.textContent.trim();
        textCol.append(descPara);
      }
      const readMore = item.querySelector("a.teaser-list_item-link");
      if (readMore) {
        const linkPara = document.createElement("p");
        const a = document.createElement("a");
        a.href = readMore.href;
        a.textContent = "Read more";
        linkPara.append(a);
        textCol.append(linkPara);
      }
      if (img || textCol.childElementCount > 0) {
        cells.push([img || "", textCol]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-news", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/stepan-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#onetrust-banner-sdk",
        ".optanon-alert-box-wrapper",
        '[class*="onetrust"]'
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".cmp-carousel__actions",
        ".cmp-carousel__indicators",
        ".carousel-handlers"
      ]);
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element.getRootNode() };
      const pageHero = element.querySelector(".page-hero");
      if (pageHero) {
        const bgStyle = pageHero.style.backgroundImage || "";
        const bgShorthand = pageHero.style.background || "";
        const bgUrl = (bgStyle || bgShorthand).match(/url\(["']?([^"')]+)["']?\)/);
        if (bgUrl && bgUrl[1]) {
          const img = document.createElement("img");
          img.src = bgUrl[1];
          pageHero.prepend(img);
          pageHero.style.backgroundImage = "";
          pageHero.style.background = "";
        }
      }
      const newsletter = element.querySelector(".containerSubscribe");
      const pagefooter = element.querySelector(".pagefooter");
      if (newsletter && pagefooter && pagefooter.contains(newsletter)) {
        pagefooter.parentNode.insertBefore(newsletter, pagefooter);
      }
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header.pageheader",
        ".pageheader"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "footer.containerPagefooter",
        ".pagefooter"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".nav-hamburger-menu",
        ".site-nav",
        ".nav-menu"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        "link",
        "noscript"
      ]);
      element.querySelectorAll(".text").forEach((el) => {
        if (!el.textContent.trim() && !el.querySelector("img")) {
          el.remove();
        }
      });
      element.querySelectorAll(".contentbreak").forEach((el) => {
        if (!el.textContent.trim() && !el.querySelector("img") && !el.querySelector("table")) {
          el.remove();
        }
      });
    }
  }

  // tools/importer/transformers/stepan-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.beforeTransform) {
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element.getRootNode() };
      const sections = payload && payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selector = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selector) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metaBlock);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-homepage": parse,
    "columns-teaser": parse2,
    "columns-feature": parse3,
    "columns-stats": parse4,
    "cards-news": parse5
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Stepan Company homepage with hero, product categories, news, and company information",
    urls: [
      "https://www.stepan.com/"
    ],
    blocks: [
      {
        name: "hero-homepage",
        instances: [".homepagehero .page-hero"]
      },
      {
        name: "columns-teaser",
        instances: [".dualteaser", ".columnrow.vertical-align:has(.subtitle)"]
      },
      {
        name: "columns-feature",
        instances: [".responsivegrid.our-membership.our-membership-image-left", ".responsivegrid.our-membership.our-membership-image-right"]
      },
      {
        name: "columns-stats",
        instances: [".columnrow.vertical-align:has(.statisticlist)"]
      },
      {
        name: "cards-news",
        instances: [".carousel.news"]
      }
    ],
    sections: [
      {
        id: "section-1-hero",
        name: "Hero Banner",
        selector: ".homepagehero.pagehero",
        style: null,
        blocks: ["hero-homepage"],
        defaultContent: []
      },
      {
        id: "section-2-about",
        name: "About / Dual Teaser",
        selector: ".contentbreak.pagesection.no-background > .content-break > .container > .aem-Grid > .contentbreak:first-child",
        style: null,
        blocks: ["columns-teaser"],
        defaultContent: []
      },
      {
        id: "section-3-innovation",
        name: "Innovation",
        selector: ".responsivegrid.our-membership.our-membership-image-left",
        style: "dark-blue",
        blocks: ["columns-feature"],
        defaultContent: []
      },
      {
        id: "section-4-sustainability",
        name: "Sustainability",
        selector: ".responsivegrid.our-membership.our-membership-image-right",
        style: null,
        blocks: ["columns-feature"],
        defaultContent: []
      },
      {
        id: "section-5-stats",
        name: "R&D Statistics",
        selector: ".columnrow.vertical-align:has(.statisticlist)",
        style: null,
        blocks: ["columns-stats"],
        defaultContent: []
      },
      {
        id: "section-6-news",
        name: "News",
        selector: ".contentbreak.pagesection:has(.carousel.news)",
        style: null,
        blocks: ["cards-news"],
        defaultContent: ["h2#heading-1957008094", ".cmp-carousel__action--linkButton"]
      },
      {
        id: "section-7-sales-rep",
        name: "Find a Sales Representative",
        selector: ".columnrow.vertical-align:has(.subtitle)",
        style: null,
        blocks: ["columns-teaser"],
        defaultContent: []
      },
      {
        id: "section-8-newsletter",
        name: "Newsletter Signup",
        selector: ".containerSubscribe",
        style: "dark-blue",
        blocks: [],
        defaultContent: [".titleSubscribe", ".labelSubscribe", ".subscribeNow"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      WebImporter.rules.transformBackgroundImages(main, document);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();

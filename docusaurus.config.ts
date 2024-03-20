import {themes as prismThemes} from 'prism-react-renderer';
import { ethereal } from './src/themes/code/ethereal.ts';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import * as appRootPath from 'app-root-path'
const dotenv = require('dotenv').config({
  path: appRootPath.path + '/.env.local'
})
import * as cfg from './website.config.ts'

// Docusaurus Configuration
const config: Config = {
  title: cfg.site.title,
  tagline: cfg.site.tagline,
  favicon: cfg.site.icon,
  url: cfg.site.url,                      // Set the production url of your site here
  baseUrl: cfg.site.baseURL,              // The /<baseUrl>/ pathname under which your site is served. For GitHub pages it is often '/<projectName>/'
  organizationName: cfg.github.username,  // GitHub pages organization. Usually your GitHub org/user name. Not needed when not using GitHub pages.
  projectName: cfg.github.docsName,       // GitHub pages project. Usually your repo name. Not needed when not using GitHub pages.

  // Site-Building strictness behavior
  onDuplicateRoutes: 'throw',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  onBrokenAnchors: 'throw',

  // Even if you don't use internationalization, you can use this field to set useful metadata like html lang.
  // For example, if your site is Chinese, you may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'/*, 'zh-cn'*/],
  },

  presets: [
    [
      'classic',
      {
        docs: {  // Configuration for @docusaurus/plugin-content-docs (false to disable)
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.ts'),
          exclude: ['**/_*.{js,jsx,ts,tsx,md,mdx}', '**/_partials/**'],
          editUrl: cfg.github.editURL, // Remove this to remove the "edit this page" links.
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        },
        pages: {  // Configuration for @docusaurus/plugin-content-pages (false to disable)
          exclude: [
            '**/_*.{js,jsx,ts,tsx,md,mdx}',  // Do not route files starting with `_`
            '**/_**/**',                     // Do not route folders starting with `_`
          ],
        },
      }
    ]
  ],

  themeConfig: {
    image: cfg.meta.image,
    colorMode: {
      defaultMode: 'dark',              // Default to darkmode, as it fits the engine brand identity better
      disableSwitch: true,              // TODO: Reenable light mode. Disabled until its designed is properly developed
      respectPrefersColorScheme: false, // Make it so that we decide the theme, not the browser
    },
    docs: {
      sidebar: {
        autoCollapseCategories: true,
        hideable: true
      }
    },
    blog: null, // Explicitly disable the default blog plugin
    algolia: {
      appId: "N5OIDFHT9B",
      apiKey: "e27783cb4ed9bfc6a011eb7026868c20",
      indexName: cfg.org.username,
      contextualSearch: true,
    },
    navbar: {
      title: cfg.site.title,
      logo: cfg.org.logo,
      items: [
        { type: 'search', position: cfg.navbar.search.position, className: cfg.navbar.search.css },
        // TODO: Uncomment when the learning sites are presentable
        //{ label: 'Creators', position: cfg.navbar.menu.position, to: 'creator' },
        //{ label: 'Developers', position: cfg.navbar.menu.position, type: 'dropdown',
        //  items: [
        //    { label: cfg.VisualscriptName, to: 'developer/visualscript' },
        //    { label: 'Typescript', to: 'developer/typescript'  },
        //  ]
        //},
        //{ label: 'Examples', position: cfg.navbar.menu.position, to: 'examples', },  // TODO: Uncomment when the examples pages is ready
        { label: 'Install', position: cfg.navbar.menu.position, href: '/manual/install' },
        { label: 'Manual', position: cfg.navbar.menu.position, to: 'manual', },
        //{ label: cfg.typedoc.label, position: cfg.navbar.menu.position, href: cfg.typedoc.url },
        { "aria-label": "GitHub", position: cfg.navbar.menu.position, className: "header-github-link", href: cfg.github.projectURL, },
        //{ label: cfg.org.title, position: cfg.navbar.menu.position,  href: cfg.org.url.orgsite },
        //{ type: 'localeDropdown', position: 'right' },
      ]
    },
    footer: {
      logo: { ...cfg.org.logo, width: cfg.footer.iconSize, height: cfg.footer.iconSize },
      links: [...cfg.footer.links],
      copyright: cfg.footer.copyright,
    },
    tableOfContents: {
      minHeadingLevel: 2, // default 2
      maxHeadingLevel: 5, // default 3
    },
  prism: {
      theme: prismThemes.github,
      darkTheme: ethereal.dark,
      additionalLanguages: ['diff','yaml','toml','bash','powershell','c','cpp','python'],
    },
  } satisfies Preset.ThemeConfig,
  plugins: [
    // TailwindCSS processor plugin
    async function tailwindProcessor(context, options) {
      return {
        name: "docusaurus-tailwindcss",
        configurePostCss(postcssOptions) {
          // Appends TailwindCSS and AutoPrefixer.
          postcssOptions.plugins.push(require("tailwindcss"));
          postcssOptions.plugins.push(require("autoprefixer"));
          return postcssOptions;
        },
      };
    },
  ],
  headTags: [
    // Add Hanken Grotesk font globally to the site
    { tagName: 'link', attributes: { rel:"preconnect", href: "https://fonts.googleapis.com" } },
    { tagName: 'link', attributes: { rel:"preconnect", href: "https://fonts.gstatic.com", crossorigin: 'true' } },
    { tagName: 'link', attributes: { rel:"stylesheet", href: "https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,100..900;1,100..900&display=swap" } },
  ],
};

export default config;

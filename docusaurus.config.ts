import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import * as appRootPath from 'app-root-path'
const dotenv = require('dotenv').config({
  path: appRootPath.path + '/.env.local'
})

// General Configuration
const orgTitle         = 'Ethereal Engine'
const orgName          = 'etherealengine'
const projectName      = 'etherealengine-docs'
const editURL          = `https://github.com/EtherealEngine/${projectName}/blob/master/`
const siteURL          = 'https://etherealengine.github.io'
const siteTitle        = `${orgTitle} Documentation`
const siteTagline      = `${orgTitle} is an open source solution for hosting, creating and developing immersive social spaces.`
const siteIcon         = 'img/favicon.ico'
const visualScriptName = 'VisualScript'

// Docusaurus Configuration
const config: Config = {
  title: siteTitle,
  tagline: siteTagline,
  favicon: siteIcon,
  url: siteURL,  // Set the production url of your site here
  baseUrl: `/${projectName}/`, // The /<baseUrl>/ pathname under which your site is served. For GitHub pages it is often '/<projectName>/'
  organizationName: orgName,   // GitHub pages organization. Usually your GitHub org/user name. Not needed when not using GitHub pages.
  projectName: projectName,    // GitHub pages project. Usually your repo name. Not needed when not using GitHub pages.

  // Broken Links behavior
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'/*, 'zh-cn'*/],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.ts'),
          exclude: ['**/_*.{js,jsx,ts,tsx,md,mdx}', '**/_partials/**'],
          editUrl: editURL, // Remove this to remove the "edit this page" links.
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      }
    ]
  ],

  themeConfig: {
    colorMode: { defaultMode: 'dark' },
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
      indexName: "etherealengine",
      contextualSearch: true,
    },
    navbar: {
      title: 'Ethereal Engine',
      logo: {
        alt: 'Ethereal Engine Logo',
        src: 'img/logo.svg'
      },
      items: [
        // TODO: Uncomment when the learning sites are presentable
        //{ label: 'Creators', position: 'left', to: 'creator' },
        //{ label: 'Developers', position: 'left', type: 'dropdown',
        //  items: [
        //    { label: visualScriptName, to: 'developer/visualscript' },
        //    { label: 'Typescript', to: 'developer/typescript'  },
        //  ]
        //},
        //{ label: 'Examples', position: 'left', to: 'examples', },  // TODO: Uncomment when the examples pages is ready
        { label: 'Manual', position: 'left', to: 'manual', },
        //{ label: 'API', position: 'left', href: 'https://etherealengine.github.io/etherealengine-docs/typedoc' },
        { label: 'Ethereal Engine', position: 'right',  href: 'https://etherealengine.org/' },
        { type: 'localeDropdown', position: 'right' },
      ]
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: 'Social',
          items: [
            { label: 'Twitter', href: 'https://twitter.com/xr_engine' },
            { label: 'Facebook', href: 'https://www.facebook.com/xrengine/' },
            { label: 'Discord', href: 'https://discord.gg/xrf' }
          ]
        },
        {
          title: 'Resources',
          items: [
            { label: 'Github', href: 'https://github.com/etherealengine/etherealengine' },
            { label: 'Npm', href: 'https://www.npmjs.com/search?q=%40etherealengine' }
          ]
        },
        {
          title: 'More',
          items: [
            { label: 'Ethereal Engine', href: 'https://www.etherealengine.org/' },
            { label: 'Open Collective', href: 'https://opencollective.com/etherealengine' }
          ]
        }
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Ethereal Engine.`,
    },
  prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['diff','yaml','toml','bash','powershell','c','cpp','python'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

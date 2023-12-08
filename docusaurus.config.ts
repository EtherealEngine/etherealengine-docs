import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import * as appRootPath from 'app-root-path'
const dotenv = require('dotenv').config({
  path: appRootPath.path + '/.env.local'
})

const config: Config = {
  title: 'etherealengine',
  tagline:     'An open source solution for hosting, creating and developing immersive social spaces, built on top of WebXR, React & Feathers.',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://etherealengine.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/etherealengine-docs/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'etherealengine', // Usually your GitHub org/user name.
  projectName: 'etherealengine-docs', // Usually your repo name.


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
          sidebarPath: require.resolve('./sidebars.ts'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          exclude: ['**/_*.{js,jsx,ts,tsx,md,mdx}'],
          editUrl: 'https://github.com/EtherealEngine/etherealengine-docs/blob/master/'
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      }
    ]
  ],

  themeConfig: {
    docs: {
      sidebar: { autoCollapseCategories: true }
    },
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
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left'
        },
        {
          href: 'https://etherealengine.github.io/etherealengine-docs/typedoc',
          label: 'API',
          position: 'left'
        },
        {
          href: 'https://etherealengine.org/',
          label: 'Ethereal Engine',
          position: 'right'
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
      ]
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: 'Social',
          items: [
            {
              label: 'Twitter',
              href: 'https://twitter.com/xr_engine'
            },
            {
              label: 'Facebook',
              href: 'https://www.facebook.com/xrengine/'
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/xrf'
            }
          ]
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Github',
              href: 'https://github.com/etherealengine/etherealengine'
            },
            {
              label: 'Npm',
              href: 'https://www.npmjs.com/search?q=%40etherealengine'
            }
          ]
        },
        {
          title: 'More',
          items: [
            {
              label: 'Ethereal Engine',
              href: 'https://www.etherealengine.org/'
            },
            {
              label: 'Open Collective',
              href: 'https://opencollective.com/etherealengine'
            }
          ]
        }
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Ethereal Engine.`
    },
  prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

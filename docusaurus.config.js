// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const appRootPath = require('app-root-path')
const dotenv = require('dotenv')
dotenv.config({
  path: appRootPath.path + '/.env.local'
})
const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')

const commonExcludePaths = ['**/**.js', '**/{node_modules,dist,tests}/**']
console.log(process.env.ENGINE_PATH, 'packages/client')
/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'etherealengine',
  tagline:
    'An end-to-end solution for hosting humans and AI in a virtual space, built on top of react, three.js and express/feathers.',
  url: 'https://etherealengine.github.io',
  baseUrl: '/etherealengine-docs/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'etherealengine', // Usually your GitHub org/user name.
  projectName: 'etherealengine-docs', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'/*, 'zh-cn'*/]
  },

  plugins: [
    // [
    //   'docusaurus-plugin-typedoc',
    //   {
    //     id: 'client',
    //     entryPoints: [process.env.ENGINE_PATH + 'packages/client'],
    //     entryPointStrategy: 'expand',
    //     tsconfig: process.env.ENGINE_PATH + 'packages/client/tsconfig.json',
    //     exclude: [...commonExcludePaths, process.env.ENGINE_PATH + 'packages/client/{public,scripts}/**'],
    //     excludePrivate: true,
    //     excludeProtected: true,
    //     excludeInternal: true,
    //     out: 'API/client',
    //     readme: 'none',
    //     sidebar: {
    //       categoryLabel: 'client',
    //       position: 1
    //     }
    //   }
    // ],
    // [
    //   'docusaurus-plugin-typedoc',
    //   {
    //     id: 'client-core',
    //     entryPoints: [process.env.ENGINE_PATH + 'packages/client-core'],
    //     entryPointStrategy: 'expand',
    //     tsconfig: process.env.ENGINE_PATH + 'packages/client-core/tsconfig.json',
    //     exclude: [...commonExcludePaths, process.env.ENGINE_PATH + 'packages/client-core/scripts/**'],
    //     excludePrivate: true,
    //     excludeProtected: true,
    //     excludeInternal: true,
    //     out: 'API/client-core',
    //     readme: 'none',
    //     sidebar: {
    //       categoryLabel: 'client-core',
    //       position: 2
    //     }
    //   }
    // ],
    // [
    //   'docusaurus-plugin-typedoc',
    //   {
    //     id: 'common',
    //     entryPoints: [process.env.ENGINE_PATH + 'packages/common'],
    //     entryPointStrategy: 'expand',
    //     tsconfig: process.env.ENGINE_PATH + 'packages/common/tsconfig.json',
    //     exclude: [...commonExcludePaths],
    //     excludePrivate: true,
    //     excludeProtected: true,
    //     excludeInternal: true,
    //     out: 'API/common',
    //     readme: 'none',
    //     sidebar: {
    //       categoryLabel: 'common',
    //       position: 3
    //     }
    //   }
    // ],
    // [
    //   'docusaurus-plugin-typedoc',
    //   {
    //     id: 'engine',
    //     entryPoints: [process.env.ENGINE_PATH + 'packages/engine/src'],
    //     entryPointStrategy: 'expand',
    //     tsconfig: process.env.ENGINE_PATH + 'packages/engine/tsconfig.json',
    //     exclude: [...commonExcludePaths, process.env.ENGINE_PATH + 'packages/engine/scripts/**'],
    //     excludePrivate: true,
    //     excludeProtected: true,
    //     excludeInternal: true,
    //     out: 'API/engine',
    //     readme: 'none',
    //     sidebar: {
    //       categoryLabel: 'engine',
    //       position: 4
    //     }
    //   }
    // ],
    // [
    //   'docusaurus-plugin-typedoc',
    //   {
    //     id: 'instanceserver',
    //     entryPoints: [process.env.ENGINE_PATH + 'packages/instanceserver/src/'],
    //     entryPointStrategy: 'expand',
    //     tsconfig: process.env.ENGINE_PATH + 'packages/instanceserver/tsconfig.json',
    //     exclude: [...commonExcludePaths],
    //     excludePrivate: true,
    //     excludeProtected: true,
    //     excludeInternal: true,
    //     out: 'API/instanceserver',
    //     readme: 'none',
    //     sidebar: {
    //       categoryLabel: 'instanceserver',
    //       position: 5
    //     }
    //   }
    // ],
    // [
    //   'docusaurus-plugin-typedoc',
    //   {
    //     id: 'server',
    //     entryPoints: [process.env.ENGINE_PATH + 'packages/server'],
    //     entryPointStrategy: 'expand',
    //     tsconfig: process.env.ENGINE_PATH + 'packages/server/tsconfig.json',
    //     exclude: [...commonExcludePaths, '**/packages/server/{public,scripts,upload,upload_test}/**'],
    //     excludePrivate: true,
    //     excludeProtected: true,
    //     excludeInternal: true,
    //     out: 'API/server',
    //     readme: 'none',
    //     sidebar: {
    //       categoryLabel: 'server',
    //       position: 6
    //     }
    //   }
    // ],
    // [
    //   'docusaurus-plugin-typedoc',
    //   {
    //     id: 'server-core',
    //     entryPoints: [process.env.ENGINE_PATH + 'packages/server-core/src/'],
    //     entryPointStrategy: 'expand',
    //     tsconfig: process.env.ENGINE_PATH + 'packages/server-core/tsconfig.json',
    //     exclude: [...commonExcludePaths, process.env.ENGINE_PATH + 'packages/server-core/scripts/**'],
    //     excludePrivate: true,
    //     excludeProtected: true,
    //     excludeInternal: true,
    //     out: 'API/server-core',
    //     readme: 'none',
    //     sidebar: {
    //       categoryLabel: 'server-core',
    //       position: 7
    //     }
    //   }
    // ]
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          exclude: ['**/_*.{js,jsx,ts,tsx,md,mdx}'],
          editUrl: 'https://github.com/EtherealEngine/etherealengine-docs/blob/master/'
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      })
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
      ({
        algolia: {
          appId: "N5OIDFHT9B",
          apiKey: "06604779928fc73656c9ae03fae1f0b1",
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
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme
      }
    })
}

module.exports = config

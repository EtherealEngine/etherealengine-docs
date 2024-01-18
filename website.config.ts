/**
 * @fileoverview
 * Contains the configuration options for the entire website and all its plugins (tailwind, docusaurus, pages, etc)
 * Stores everything in one place for easier access from all of the different sections of the website.
 */

/**
 * @description General Variables
 */
const OrgName       = 'Ethereal Engine'
const ProjectName   = 'Ethereal Engine'
const OrgUsername   = 'etherealengine'
const GHProjectName = `etherealengine-docs`
const GHUsername    = 'EtherealEngine'
const GHurl         = `https://github.com/${GHUsername}/${GHProjectName}`
const SiteURL       = `https://${OrgUsername}.github.io`
const BaseURL       = `/${GHProjectName}/`
const FullURL       = SiteURL+BaseURL

/**
 * @description Organization Options
 */
export const org = {
  title         : OrgName,
  username      : OrgUsername,
  logo          : {
    alt         : `${OrgName} Logo`,
    src         : 'img/logo.svg',
  },
  url           : {
    orgsite     : `https://${OrgUsername}.org/`,
    comsite     : `https://${OrgUsername}.com/`,
  },
  project       : {
    name        : ProjectName,
    description : `${ProjectName} is an open source solution for hosting, creating and developing immersive social spaces.`,
  },
}

/**
 * @description General website options
 */
export const site = {
  url         : SiteURL,
  baseURL     : BaseURL,
  fullURL     : FullURL,
  title       : `${org.project.name} Docs`,
  tagline     : org.project.description,
  icon        : 'img/favicon.ico',
  description : `Learn how to use ${org.project.name}.`,
}

/**
 * @description HTML <meta> tags options
 */
export const meta = {
  title       : site.title,
  description : site.description,
  image       : undefined, // TODO: Meta Image for linking thumbnail/etc
  tags        : [],  // https://docusaurus.io/docs/api/themes/configuration#metadata
}

/**
 * @description GitHub repository options
 */
export const github = {
  username    : org.username,
  projectName : GHProjectName,
  url         : GHurl,
  editURL     : `${GHurl}/blob/master/`,
}

/**
 * @description Typedoc API specific options
 */
export const typedoc = {
  label : 'API',
  url   : site.fullURL+'typedoc',
}

/**
 * @description NavBar specific options
 */
export const navbar = {
  menu : {
    position : 'right',
  },
  search: {
    position : 'left',
    css      : '/',
  }
}

/**
 * @description Footer specific options
 */
export const footer = {
  iconSize  : 50,
  copyright : `Copyright © ${new Date().getFullYear()} ${org.title}.`,
  links     : [
    { title: 'Social',
      items: [
        { label: 'Twitter', href: 'https://twitter.com/xr_engine' },
        { label: 'Facebook', href: 'https://www.facebook.com/xrengine/' },
        { label: 'Discord', href: 'https://discord.gg/xrf' }
      ]
    },
    { title: 'Resources',
      items: [
        { label: 'Github', href: 'https://github.com/etherealengine/etherealengine' },
        { label: 'Npm', href: 'https://www.npmjs.com/search?q=%40etherealengine' }
      ]
    },
    { title: 'More',
      items: [
        { label: org.title, href: org.url.orgsite },
        { label: 'Open Collective', href: 'https://opencollective.com/etherealengine' }
      ]
    }
  ]
}

/**
 * @description Ethereal Engine specific options
 */
export const VisualscriptName :string= 'Behave Graph'


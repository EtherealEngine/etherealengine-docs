/**
 * @fileoverview
 * Contains the configuration options for the entire website and all its plugins (tailwind, docusaurus, pages, etc)
 * Stores everything in one place for easier access from all of the different sections of the website.
 */

/**
 * @description General Variables
 */
const OrgFullName     = 'Ethereal Engine'
const OrgName         = 'etherealengine'
const ProjectFullName = 'Ethereal Engine'
const ProjectName     = 'etherealengine'
const GHUsername      = 'EtherealEngine'
const GHDocsName      = `${ProjectName}-docs`
const GHDocsURL       = `https://github.com/${GHUsername}/${GHDocsName}`
const GithubURL       = `https://github.com/${GHUsername}/${ProjectName}`
const SiteURL         = `https://${OrgName}.github.io`
const BaseURL         = `/${GHDocsName}/`
const Links           = {
  twitter             : 'https://twitter.com/xr_engine',
  facebook            : 'https://www.facebook.com/xrengine/',
  discord             : 'https://discord.gg/xrf',
  npm                 : 'https://www.npmjs.com/search?q=%40etherealengine',
  openCollective      : 'https://opencollective.com/etherealengine',
  github              : GithubURL,
  orgSite             : `https://${OrgName}.org/`,
  comSite             : `https://${OrgName}.com/`,
}
export const ApiBaseURL = 'api'

/**
 * @description Organization Options
 */
export const org = {
  title         : OrgFullName,
  username      : OrgName,
  logo          : {
    alt         : `${OrgFullName} Logo`,
    src         : 'img/logo.svg',
  },
  url           : {
    orgsite     : Links.orgSite,
    comsite     : Links.comSite,
  },
  project       : {
    name        : ProjectFullName,
    description : `${ProjectFullName} is an open source solution for hosting, creating and developing immersive social spaces.`,
  },
}

/**
 * @description General website options
 */
export const site = {
  url         : SiteURL,
  baseURL     : BaseURL,
  fullURL     : SiteURL+BaseURL,
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
  image       : undefined, // TODO: Meta Image : for linking thumbnail/etc
  tags        : [],        // TODO: Meta tags  : https://docusaurus.io/docs/api/themes/configuration#metadata
}

/**
 * @description GitHub repository options
 */
export const github = {
  username   : org.username,
  docsName   : GHDocsName,
  docsURL    : GHDocsURL,
  editURL    : `${GHDocsURL}/blob/master/`,
  projectURL : GithubURL,
}

/**
 * @description Typedoc API specific options
 */
export const typedoc = {
  label : 'API',
  url   : site.fullURL+ApiBaseURL,
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
        { label: 'Twitter', href: Links.twitter },
        { label: 'Facebook', href: Links.facebook },
        { label: 'Discord', href: Links.discord }
      ]
    },
    { title: 'Resources',
      items: [
        { label: 'Github', href: Links.github },
        { label: 'Npm', href: Links.npm }
      ]
    },
    { title: 'More',
      items: [
        { label: org.title, href: Links.orgSite },
        { label: 'Open Collective', href: Links.openCollective }
      ]
    }
  ]
}

/**
 * @description Ethereal Engine specific options
 */
export const VisualscriptName :string= 'Behave Graph'


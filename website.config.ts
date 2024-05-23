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
 * @description Engine specific options
 */
export const VisualscriptName :string= 'VisualScript'


/**
 * @description Color Options: Global
 */
export const GlobalColors = {
  first  : "bg-blue-500",
  second : "bg-pink-500",
  third  : "bg-teal-500",
  fourth : "bg-neutral-800",
}


/**
 * @description Color Options: Personas
 */
export const Colors = {
  creator      : GlobalColors.first,
  visualscript : GlobalColors.second,
  typescript   : GlobalColors.third,
  manual       : GlobalColors.fourth,
}


/**
 * @description Landing Page options
 */
export const LandingPageData = {
  hero: {
    title: { l1: "Learn", l2: "Ethereal Engine" },
    image: "bg-[url('@site/static/images/landing/hero.jpg')]",
    CTAs : {
      creator: {
        render : false, // Whether the Persona data will be rendered on the Hero section or not
        color  : Colors.creator,
        title  : { top: "Become a", mid: "Creator", bot: { l1: "", l2: "" } },
        link   : "creator",
      },
      visualscript: {
        render : false, // Whether the Persona data will be rendered on the Hero section or not
        color  : Colors.visualscript,
        title  : { top: "Become a", mid: "Developer", bot: { l1: "with", l2: "Visualscript" } },
        link   : "developer/visualscript",
      },
      typescript: {
        render : true, // Whether the Persona data will be rendered on the Hero section or not
        color  : Colors.typescript,
        title  : { top: "Become a", mid: "Developer", bot: { l1: "with", l2: "Typescript" } },
        link   : "developer/typescript",
      },
      manual: {
        render : true, // Whether the Persona data will be rendered on the Hero section or not
        color  : Colors.manual,
        title  : { top: "Open the", mid: "Manual", bot: { l1: "", l2: "" } },
        link   : "manual",
      },
    },
  },
  personas: {
    title       : "Choose your Path",
    description : `
    The Ethereal Learning Journeys are guided learning experiences that will help you become an expert at creating Immersive Web Experiences using Ethereal Engine.
    At the end of your journey you will have gained all the skills that you need to create the project of your dreams.
    `,
    creator: {
      render      : false, // Whether the Persona data will be rendered on the personaCTAs section or not
      link        : "creator",
      rightSide   : false,
      color       : Colors.creator,
      image       : "bg-[url('@site/static/images/landing/creator1.jpg')]",
      label       : "Learning Path",
      title       : "Content Creator",
      description : `
      Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet.
      Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet.
      `,
    },
    visualscript: {
      render      : false, // Whether the Persona data will be rendered on the personaCTAs section or not
      link        : "developer/visualscript",
      rightSide   : true,
      color       : Colors.visualscript,
      image       : "bg-[url('@site/static/images/landing/visualscript1.jpg')]",
      label       : "Learning Path",
      title       : "Developer with Visualscript",
      description : `
      Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet.
      Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet.
      `,
    },
    typescript: {
      render      : true, // Whether the Persona data will be rendered on the personaCTAs section or not
      link        : "developer/typescript",
      rightSide   : false,
      color       : Colors.typescript,
      image       : "bg-[url('@site/static/images/landing/typescript1.jpg')]",
      label       : "Learning Path",
      title       : "Developer with Typescript",
      description : `
      Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet.
      Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet.
      `,
    },
    manual: {
      render      : true, // Whether the Persona data will be rendered on the personaCTAs section or not
      link        : "manual",
      rightSide   : true,
      color       : Colors.manual,
      image       : "bg-[url('@site/static/images/landing/manual1.jpg')]",
      label       : "Open the",
      title       : "Reference Manual",
      description : `
      Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet.
      Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet.
      `,
    },
  }
}


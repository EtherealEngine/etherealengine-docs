/**
 * @fileoverview
 * Contains the configuration options for the entire website and all its plugins (tailwind, docusaurus, pages, etc)
 * Stores everything in one place for easier access from all of the different sections of the website.
 */

/**
 * @description Organization Options
 */
export const org = {
  title : 'Ethereal Engine',
  name  : 'etherealengine'
}

/**
 * @description General website options
 */
export const site = {
  url     : `https://${org.name}.github.io`,
  title   : `${org.title} Documentation`,
  tagline : `${org.title} is an open source solution for hosting, creating and developing immersive social spaces.`,
  icon    : 'img/favicon.ico',
}

/**
 * @description HTML <meta> tags options
 */
export const meta = {
  description : "Description will go into a meta tag in <head />",
}

/**
 * @description GitHub repository options
 */
const ghProjectName = 'etherealengine-docs'
export const github = {
  projectName : ghProjectName,
  editURL     : `https://github.com/EtherealEngine/${ghProjectName}/blob/master/`,
}

/**
 * @description Ethereal Engine specific options
 */
export const visualScriptName :string= 'Behave Graph'

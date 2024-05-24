import Link from '@docusaurus/Link'
import useBaseUrl from '@docusaurus/useBaseUrl'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import clsx from 'clsx'
import React from 'react'

import styles from './index.module.css'

import * as cfg from '../../website.config.ts'
import Hero     from './_landing/section/hero.tsx'
import Personas from './_landing/section/personas.tsx'

export const LandingPageData = {
  hero: {
    title: { l1: "iR Engine", l2: "Documentation" },
    image: "bg-[url('@site/static/images/landing/hero.jpg')]",
    CTAs : {
      creator: {
        color: Colors.creator,
        title: { top: "Guides for", mid: "Content Creators", bot: { l1: "", l2: "" } },
        link: "creator",
      },
      visualscript: {
        color: Colors.visualscript,
        title: { top: "Guides for", mid: "VisualScript", bot: { l1: "", l2: "Developers" } },
        link: "developer/visualscript",
      },
      typescript: {
        color: Colors.typescript,
        title: { top: "Guides for", mid: "TypeScript", bot: { l1: "", l2: "Developers" } },
        link: "developer/typescript",
      },
      manual: {
        color: Colors.manual,
        title: { top: "Reference", mid: "Manual", bot: { l1: "for technical users", l2: "" } },
        link: "manual",
      },
    },
  },
  personas: {
    title       : "Choose your Path",
    // description : `
    // The Ethereal Learning Journeys are guided learning experiences that will help you become an expert at creating Immersive Web Experiences using Ethereal Engine.
    // At the end of your journey you will have gained all the skills that you need to create the project of your dreams.
    // `,
    creator: {
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

export default function Home() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout title={`${cfg.meta.title}`} description={cfg.meta.description}>
      <header>
        <Hero data={cfg.LandingPageData.hero} renderAll={true} />  {/* Overrides the render:true/false property for all Personas */}
      </header>
      <main>
        <Personas data={cfg.LandingPageData.personas} renderAll={true} />  {/* Overrides the render:true/false property for all Personas */}
      </main>
    </Layout>
  )
}


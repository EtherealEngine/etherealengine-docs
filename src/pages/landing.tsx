import Link from '@docusaurus/Link'
import useBaseUrl from '@docusaurus/useBaseUrl'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import clsx from 'clsx'
import React from 'react'

import styles from './index.module.css'

import * as cfg from '../../website.config.ts'
import { Colors } from './_colors.tsx'
import Hero     from './_landing/section/hero.tsx'
import Personas from './_landing/section/personas.tsx'

export const LandingPageData = {
  hero: {
    title: { l1: "Learn", l2: "Ethereal Engine" },
    image: "bg-[url('@site/static/images/landing/hero.jpg')]",
    CTAs : {
      creator: {
        color: Colors.creator,
        title: { top: "Become a", mid: "Creator", bot: { l1: "", l2: "" } },
        link: "creator",
      },
      visualscript: {
        color: Colors.visualscript,
        title: { top: "Become a", mid: "Developer", bot: { l1: "with", l2: "Visualscript" } },
        link: "developer/visualscript",
      },
      typescript: {
        color: Colors.typescript,
        title: { top: "Become a", mid: "Developer", bot: { l1: "with", l2: "Typescript" } },
        link: "developer/typescript",
      },
      manual: {
        color: Colors.manual,
        title: { top: "Open the", mid: "Manual", bot: { l1: "", l2: "" } },
        link: "manual",
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
        <Hero data={LandingPageData.hero} />
      </header>
      <main>
        <Personas data={LandingPageData.personas} />
      </main>
    </Layout>
  )
}

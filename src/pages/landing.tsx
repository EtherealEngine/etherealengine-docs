import Link from '@docusaurus/Link'
import useBaseUrl from '@docusaurus/useBaseUrl'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import clsx from 'clsx'
import React from 'react'

import styles from './index.module.css'

import * as cfg from '../../website.config.ts'
import Personas from './_landing/section/personas.tsx'
import Hero     from './_landing/section/hero.tsx'
import { GlobalColors } from './_colors.tsx'


const Colors = {
  creator      : GlobalColors.first,
  visualscript : GlobalColors.second,
  typescript   : GlobalColors.third,
  manual       : GlobalColors.fourth,
}
const LandingPageData = {
  hero: {
    title: { l1: "Learn", l2: "Ethereal Engine" },
    image: "bg-[url('@site/static/images/landing/hero.jpg')]",
    CTAs : {
      creator: {
        color: Colors.creator,
        title: { top: "Become a", mid: "Creator", bot: { l1: "", l2: "" } },
      },
      visualscript: {
        color: Colors.visualscript,
        title: { top: "Become a", mid: "Developer", bot: { l1: "with", l2: "Visualscript" } },
      },
      typescript: {
        color: Colors.typescript,
        title: { top: "Become a", mid: "Developer", bot: { l1: "with", l2: "Typescript" } },
      },
      manual: {
        color: Colors.manual,
        title: { top: "Open the", mid: "Manual", bot: { l1: "", l2: "" } },
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
    <Layout title={`${siteConfig.title}`} description={cfg.meta.description}>
      <Hero data={LandingPageData.hero} />
      <Personas data={LandingPageData.personas} />
      {/*
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link to={useBaseUrl('manual/')} className={clsx('button button--outline button--secondary button--lg', styles.getStarted)} >
              Access the Manual
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      */}
    </Layout>
  )
}

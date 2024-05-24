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


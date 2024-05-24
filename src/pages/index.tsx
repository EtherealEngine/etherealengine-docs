import React from 'react'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import { clsx as mergex } from 'clsx'

import * as cfg from '../../website.config.ts'
import { Colors } from './_colors.tsx'
import Hero from './_landing/section/hero.tsx'
import Personas from './_landing/section/personas.tsx'

export default function Home() {
  return (
    <Layout title={`${cfg.meta.title}`} description={cfg.meta.description}>
      <header>
        <Hero data={cfg.LandingPageData.hero} />
      </header>
      <main>
        <Personas data={cfg.LandingPageData.personas} />
      </main>
    </Layout>
  )
}


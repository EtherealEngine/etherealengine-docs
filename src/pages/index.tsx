import React from 'react'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import { clsx as mergex } from 'clsx'

import * as cfg from '../../website.config.ts'
import { Colors } from './_colors.tsx'
import { SimpleHero } from './_landing/section/hero.tsx'
import { SimplePersonas } from './_landing/section/personas.tsx'
import { LandingPageData } from './landing.tsx'

export default function Home() {
  const { siteConfig } = useDocusaurusContext()
  const path = siteConfig.baseUrl+'docs'
  // return <Redirect to={path} />;
  return (
    <Layout title={`${cfg.meta.title}`} description={cfg.meta.description}>
      <header>
        <SimpleHero data={LandingPageData.hero} />
      </header>
      <main>
        <SimplePersonas data={LandingPageData.personas} />
      </main>
    </Layout>
  )
}


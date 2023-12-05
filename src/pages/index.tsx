import Link from '@docusaurus/Link'
import useBaseUrl from '@docusaurus/useBaseUrl'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import clsx from 'clsx'
import React from 'react'

import styles from './index.module.css'
import { Redirect } from 'react-router-dom'

const features = [
  {
    title: 'Ethereal Engine Embraces The Web',
    imageUrl: 'img/undraw_docusaurus_mountain.svg',
    description: <>Reach everyone. No app stores. Open Source. <br/>Mobile - Desktop - Headsets</>
  },
  {
    title: 'Focus On What Matters',
    imageUrl: 'img/undraw_docusaurus_tree.svg',
    description: <>A comprehensive studio, pipeline tools, endless immersive features.</>
  },
  {
    title: 'Built On Well Known Web Frameworks',
    imageUrl: 'img/undraw_docusaurus_react.svg',
    description: <>Power your experiences immediately with React, Threejs, Feathers, Kubernetes, bitECS</>
  }
]

/**
 *
 * @param {any} imageUrl
 * @param {any} title
 * @param {any} description
 * @returns
 */
function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl)
  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

/**
 *
 * @returns
 */
export default function Home() {
  const { siteConfig } = useDocusaurusContext()
  const path = siteConfig.baseUrl+'docs'
  return <Redirect to={path} />;
  // return (
  //   <Layout title={`${siteConfig.title}`} description="Description will go into a meta tag in <head />">
  //     <header className={clsx('hero hero--primary', styles.heroBanner)}>
  //       <div className="container">
  //         <h1 className="hero__title">{siteConfig.title}</h1>
  //         <p className="hero__subtitle">{siteConfig.tagline}</p>
  //         <div className={styles.buttons}>
  //           <Link
  //             className={clsx('button button--outline button--secondary button--lg', styles.getStarted)}
  //             to={useBaseUrl('docs/')}
  //           >
  //             Get Started
  //           </Link>
  //         </div>
  //       </div>
  //     </header>
  //     <main>
  //       {features && features.length > 0 && (
  //         <section className={styles.features}>
  //           <div className="container">
  //             <div className="row">
  //               {features.map((props, idx) => (
  //                 <Feature key={idx} {...props} />
  //               ))}
  //             </div>
  //           </div>
  //         </section>
  //       )}
  //     </main>
  //   </Layout>
  // )
}

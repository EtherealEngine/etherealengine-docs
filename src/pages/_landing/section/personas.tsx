import React from 'react';
import { useHistory } from 'react-router-dom';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { clsx as mergex } from 'clsx'

//________________________________________________
// @section Components
//____________________________
function Persona (props) {
  const Data = props.data
  // Click Event
  const { siteConfig } = useDocusaurusContext()
  const history        = useHistory();
  const handleOnClick  = () => { history.push(siteConfig.baseUrl+Data.link);}
  // Card
  const Boxes = mergex(
    /* Base    */ mergex("order-first", Data.color),
    /* Phone   */ "flex flex-col",
    /* Desktop */ "lg:grid lg:grid-col-2 lg:w-full lg:grid-cols-2 lg:grid-flow-col lg:h-64",
    ) // << Card.Boxes
  const Hover = "hover:cursor-pointer hover:scale-105 transition-all"
  // Elements
  const PersonaCard = mergex(Hover, Boxes)
  const CardText    = mergex(
    /* Base    */ "flex flex-col",
    /* Phone   */ "px-8 py-6",
    /* Desktop */ "lg:px-12 lg:py-6",
    ) // << CardText
  const Label     = "font-normal underline"
  const Title     = "font-normal text-4xl"
  const Content   = "font-light pt-4"
  const CardImage = mergex(
    /* Base    */ mergex(Data.image, "bg-cover bg-center bg-no-repeat"),
    /* Phone   */ "h-40 order-first",
    /* Desktop */ mergex("lg:w-full lg:h-full", Data.rightSide ? "lg:order-first":"lg:order-last"),
    ) // << CardImage
  // Apply
  return <React.Fragment>
    <div className={PersonaCard} onClick={handleOnClick} >
      <div className={CardText}>
        <span className={Label}>{Data.label}</span>
        <span className={Title}>{Data.title}</span>
        <span className={Content}>{Data.description}</span>
      </div>
      <div className={CardImage}>
      </div>
    </div>
  </React.Fragment>
}
//____________________________
export default function Personas (props) {
  const Data              = props.data
  const PersonasContainer = "p-16 space-y-10 w-full"
  const PersonasTitle     = "font-normal justify-items-center text-center text-4xl"
  const PersonasDescr     = "font-normal justify-items-center text-left text-xl"
  return <React.Fragment>
    <section className={PersonasContainer}>
      <div className={PersonasTitle}>{Data.title}</div>
      <Persona data={Data.creator} />
      <Persona data={Data.visualscript} />
      <Persona data={Data.typescript} />
      <Persona data={Data.manual} />
      <div className={PersonasDescr}>{Data.description}</div>
    </section>
  </React.Fragment>
}

//____________________________
export function SimplePersonas (props) {
  const Data              = props.data
  const PersonasContainer = "p-16 space-y-10 w-full"
  const PersonasTitle     = "font-normal justify-items-center text-center text-4xl"
  const PersonasDescr     = "font-normal justify-items-center text-left text-xl"
  return <React.Fragment>
    <section className={PersonasContainer}>
      <div className={PersonasTitle}>{Data.title}</div>
      <Persona data={Data.manual} />
      <div className={PersonasDescr}>{Data.description}</div>
    </section>
  </React.Fragment>
}


import React from 'react';
import { clsx as mergex } from 'clsx'

//________________________________________________
// @section Components
//____________________________
function Persona (props) {
  const Data      = props.data
  const CardBoxes = mergex("grid grid-cols-2 grid-flow-col h-64 order-first", Data.color)
  const CardText  = "flex flex-col px-12 py-6"
  const CardImage = mergex("w-full h-full", Data.image, "bg-center bg-cover bg-no-repeat")
  const Label     = "font-normal underline"
  const Title     = "font-normal text-4xl"
  const Content   = "font-light pt-4"
  return <React.Fragment>
    <div className={CardBoxes}>
      <div className={CardText}>
        <span className={Label}>{Data.label}</span>
        <span className={Title}>{Data.title}</span>
        <span className={Content}>{Data.description}</span>
      </div>
      <div className={mergex(CardImage, Data.rightSide ? "order-first":"order-last")}>
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


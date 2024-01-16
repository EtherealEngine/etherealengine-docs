import React from 'react';
import { Colors } from '../colors.tsx'

function Title(props) {
  return <h1 className="mt-0 text-7xl font-bold">{props.l1}<br/>{props.l2}</h1>
}

function PersonaCTA(props) {
  const Align  = "flex flex-col justify-center p-5"
  const Width  = "w-1/4"
  const FColor = props.color == "bg-teal-400" ? "text-black " : "";
  const Top    = FColor + "font-light"
  const Mid    = FColor + "font-normal text-4xl"
  const Bot1   = FColor + "font-light text-1xl"
  const Bot2   = FColor + "font-normal text-2xl"
  return <React.Fragment>
    <div className={[Align, Width, props.color].join(" ")}>
      <div className={Top}>{props.tTop}<br/></div>
      <div className={Mid}>{props.tMid}<br/></div>
      <div><span className={Bot1}>{props.tBot1}</span> <span className={Bot2}>{props.tBot2}</span><br/></div>
    </div>
  </React.Fragment>
}

function PersonaCTAs() {
  return <React.Fragment>
    <div className="flex w-full h-40 space-x-20">
      <PersonaCTA color={Colors.first}  tTop="Become a" tMid="Creator" />
      <PersonaCTA color={Colors.second} tTop="Become a" tMid="Developer" tBot1="with" tBot2="Typescript" />
      <PersonaCTA color={Colors.third}  tTop="Become a" tMid="Developer" tBot1="with" tBot2="Visualscript" />
      <PersonaCTA color={Colors.fourth} tTop="Open the" tMid="Manual" />
    </div>
  </React.Fragment>
}
export default function Hero () {
  const Align     = "flex flex-col justify-between p-28 h-dvh"
  const HeroImage = "bg-[url('/images/landing/hero.jpg')] bg-center bg-cover bg-no-repeat bg-fixed"
  return <React.Fragment>
    {/* <DummyNavbar /> */}
    <section className={["HeroSection", Align, HeroImage].join(" ")}>
      <Title l1="Learn" l2="Ethereal Engine"/>
      <PersonaCTAs />
    </section>
  </React.Fragment>
}


import React from 'react';
import { useHistory } from 'react-router-dom';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import {clsx as mergex} from 'clsx'
import { Colors } from '../../colors.tsx'

function Title(props) {
  const Data = props.data
  return <h1 className="mt-0 text-7xl font-bold">{Data.l1}<br/>{Data.l2}</h1>
}

function PersonaCTA(props) {
  const history = useHistory();
  const Data   = props.data
  const { siteConfig } = useDocusaurusContext()
  const handleOnClick  = () => { history.push(siteConfig.baseUrl+Data.link);}
  const Align  = "flex flex-col justify-center p-5"
  const Width  = "w-1/4"
  const Hover  = "hover:bg-blue-600 hover:cursor-pointer"
  const FColor = Data.color == "bg-teal-400" ? "text-black " : "";
  const Top    = mergex(FColor, "font-light")
  const Mid    = mergex(FColor, "font-normal text-4xl")
  const Bot1   = mergex(FColor, "font-light text-1xl")
  const Bot2   = mergex(FColor, "font-normal text-2xl")
  return <React.Fragment>
    <div className={mergex(Align, Width, Data.color, Hover)} onClick={handleOnClick} >
      <div className={Top}>{Data.title.top}<br/></div>
      <div className={Mid}>{Data.title.mid}<br/></div>
      <div><span className={Bot1}>{Data.title.bot.l1}</span> <span className={Bot2}>{Data.title.bot.l2}</span><br/></div>
    </div>
  </React.Fragment>
}

function PersonaCTAs(props) {
  const Data = props.data
  return <React.Fragment>
    <div className="flex w-full h-40 space-x-20">
      <PersonaCTA data={Data.creator} />
      <PersonaCTA data={Data.visualscript} />
      <PersonaCTA data={Data.typescript} />
      <PersonaCTA data={Data.manual} />
    </div>
  </React.Fragment>
}
export default function Hero (props) {
  const Data        = props.data
  const HeroSection = ""
  const HeroAlign   = "flex flex-col justify-between p-28 h-dvh"
  const HeroImage   = `${Data.image} bg-center bg-cover bg-no-repeat bg-fixed`
  return <React.Fragment>
    <section className={mergex(HeroSection, HeroAlign, HeroImage)}>
      <Title data={Data.title} />
      <PersonaCTAs data={Data.CTAs} />
    </section>
  </React.Fragment>
}


//__________________________________________________________
// @section Simplified MVP version of the LandingPage
//______________________________________
function SimplePersonaCTAs(props) {
  const Data = props.data
  return <React.Fragment>
    <div className="flex w-full h-30 py-10">
      <PersonaCTA data={Data.manual} />
    </div>
  </React.Fragment>
}
//______________________________________
export function SimpleHero (props) {
  const Data        = props.data
  const HeroSection = ""
  const HeroAlign   = "flex flex-col justify-between p-28"
  const HeroImage   = `${Data.image} bg-center bg-cover bg-no-repeat bg-fixed`
  return <React.Fragment>
    <section className={mergex(HeroSection, HeroAlign, HeroImage)}>
      <Title data={Data.title} />
      <SimplePersonaCTAs data={Data.CTAs} />
    </section>
  </React.Fragment>
}


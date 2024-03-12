import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { clsx as mergex } from 'clsx'
import { Colors } from '../../colors.tsx'
import ExpandIcon from '@site/static/img/expand.svg'

function Title(props) {
  const Data = props.data
  const Style = mergex(
    /* Base    */ "mt-0 font-bold",
    /* Phone   */ "text-4xl",
    /* Desktop */ "lg:text-7xl",
  ) // Style
  return <h1 className={Style}>{Data.l1}<br />{Data.l2}</h1>
}

function PersonaCTA(props) {
  const Data = props.data
  const { siteConfig } = useDocusaurusContext()
  const history = useHistory();
  const handleOnClick = () => { history.push(siteConfig.baseUrl + Data.link); }
  const Align = mergex(
    /* Base    */ "flex flex-col justify-center p-5",
    /* Phone   */ "",
    /* Desktop */ "",
  ) // << Align
  const Width = mergex(
    /* Phone   */ "w-full",
    /* Desktop */ "lg:w-1/4 lg:h-full",
  ) // << Width
  const Hover = "hover:bg-blue-600 hover:cursor-pointer transition-all"
  const FColor = Data.color == "bg-teal-400" ? "text-black " : "";
  const Top = mergex(FColor, "font-light")
  const Mid = mergex(FColor, "font-normal text-4xl")
  const Bot1 = mergex(FColor, "font-light text-1xl")
  const Bot2 = mergex(FColor, "font-normal text-2xl")
  const PersonaCTA = mergex(Align, Width, Data.color, Hover)
  return <React.Fragment>
    <div className={PersonaCTA} onClick={handleOnClick} >
      <div className={Top}>{Data.title.top}<br /></div>
      <div className={Mid}>{Data.title.mid}<br /></div>
      <div><span className={Bot1}>{Data.title.bot.l1}</span> <span className={Bot2}>{Data.title.bot.l2}</span><br /></div>
    </div>
  </React.Fragment>
}

function PersonaCTAs(props) {
  const Data = props.data
  const PersonaCTAs = mergex(
    /* Base    */ "w-full",
    /* Phone   */ "flex flex-col space-y-5",
    /* Desktop */ "lg:flex-row lg:h-40 lg:space-y-0 lg:space-x-20",
  ) // << PersonaCTAs
  return <React.Fragment>
    <div className={PersonaCTAs}>
      <PersonaCTA data={Data.creator} />
      <PersonaCTA data={Data.visualscript} />
      <PersonaCTA data={Data.typescript} />
      <PersonaCTA data={Data.manual} />
    </div>
  </React.Fragment>
}
export default function Hero(props) {
  const Data = props.data
  const Style = mergex(
    /* Base    */ "flex flex-col justify-between",
    /* Phone   */ "p-16",
    /* Desktop */ "lg:p-28 lg:pb-44 lg:h-dvh",
  ) // << Align
  const StyleImage = `${Data.image} bg-center bg-cover bg-no-repeat bg-fixed`
  const HeroSection = mergex(Style, StyleImage)
  const StyleIcon = "absolute inset-x-1/2 bottom-0 animate-bounce"
  return <React.Fragment>
    <section className={HeroSection}>
      <Title data={Data.title} />
      <PersonaCTAs data={Data.CTAs} />
      <Link to="#choose-path"> <ExpandIcon className={StyleIcon} /> </Link>
    </section>
  </React.Fragment>
}


//__________________________________________________________
// @section Simplified MVP version of the LandingPage
//______________________________________
function SimplePersonaCTAs(props) {
  const Data = props.data
  const PersonaCTAs = mergex(
    /* Base    */ "w-full",
    /* Phone   */ "flex flex-col space-y-5",
    /* Desktop */ "lg:flex-row lg:h-40 lg:space-y-0 lg:space-x-20",
  ) // << PersonaCTAs
  return <React.Fragment>
    <div className={PersonaCTAs}>
      <PersonaCTA data={Data.typescript} />
      <PersonaCTA data={Data.manual} />
    </div>
  </React.Fragment>
}
//______________________________________
export function SimpleHero(props) {
  const Data = props.data
  const Style = mergex(
    /* Base    */ "flex flex-col justify-between",
    /* Phone   */ "p-16",
    /* Desktop */ "lg:p-28 lg:h-dvh",
  ) // << Align
  const StyleImage = `${Data.image} bg-center bg-cover bg-no-repeat bg-fixed`
  const HeroSection = mergex(Style, StyleImage)
  const StyleIcon = "absolute inset-x-1/2 bottom-0 animate-bounce"
  return <React.Fragment>
    <section className={HeroSection}>
      <Title data={Data.title} />
      <SimplePersonaCTAs data={Data.CTAs} />
      <Link to="#choose-path"> <ExpandIcon className={StyleIcon} /> </Link>
    </section>
  </React.Fragment >
}


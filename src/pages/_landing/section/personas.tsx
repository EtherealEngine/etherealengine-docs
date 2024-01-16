import React from 'react';
import { Colors } from '../colors.tsx'


//________________________________________________
// @section Text Copy
//____________________________
const Text = {
  label: {
    persona : "Learning Path",
    manual  : "Open the",
  },
  title: {
    section      : "Choose your Path",
    creator      : "Content Creator",
    visualscript : "Developer with Visualscript",
    typescript   : "Developer with Typescript",
    manual       : "Reference Manual",
  },
  description: {
    creator: `
    Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet.
    Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet.
    `,
    visualscript: `
    Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet.
    Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet.
    `,
    typescript: `
    Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet.
    Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet.
    `,
    manual: `
    Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet.
    Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet.
    `,
    section: `
    The Ethereal Learning Journeys are guided learning experiences that will help you become an expert at creating Immersive Web Experiences using Ethereal Engine.
    At the end of your journey you will have gained all the skills that you need to create the project of your dreams.
    `
  },
}


//________________________________________________
// @section Components
//____________________________
function Persona (props) {
  const CardBoxes = ["grid grid-cols-2 grid-flow-col h-64 order-first", props.color].join(" ")
  const CardText  = "flex flex-col px-12 py-6"
  const CardImage = "w-full h-full bg-[url('"+props.img+"')] bg-center bg-cover bg-no-repeat"
  const OverTitle = "font-normal underline"
  const Title     = "font-normal text-4xl"
  const Content   = "font-light pt-4"
  return <React.Fragment>
    <div className={CardBoxes}>
      <div className={CardText}>
        <span className={OverTitle}>{props.overTitle}</span>
        <span className={Title}>{props.title}</span>
        <span className={Content}>{props.description}</span>
      </div>
      <div className={[CardImage, props.rightSide ? "order-first":"order-last"] .join(" ")}>
      </div>
    </div>
  </React.Fragment>
}
//____________________________
export default function Personas () {
  const PersonasContainer = "p-16 space-y-10 w-full"
  const PersonasTitle     = "font-normal justify-items-center text-center text-4xl"
  const PersonasDescr     = "font-normal justify-items-center text-left text-xl"
  return <React.Fragment>
    <div className={PersonasContainer}>
      <div className={PersonasTitle}>{Text.title.section}</div>
      <Persona img="/images/landing/hero.jpg" overTitle={Text.label.persona} title={Text.title.creator} description={Text.description.creator} color={Colors.first} rightSide={false}/>
      <Persona img="/images/landing/creator1.jpg" overTitle={Text.label.persona} title={Text.title.visualscript} description={Text.description.visualscript} color={Colors.second} rightSide={true}/>
      <Persona img="/images/landing/hero.jpg" overTitle={Text.label.persona} title={Text.title.typescript} description={Text.description.typescript} color={Colors.third} rightSide={false} />
      <Persona img="/images/landing/hero.jpg" overTitle={Text.label.manual} title={Text.title.manual} description={Text.description.manual} color={Colors.fourth} rightSide={true}/>
      <div className={PersonasDescr}>{Text.description.section}</div>
    </div>
  </React.Fragment>
}


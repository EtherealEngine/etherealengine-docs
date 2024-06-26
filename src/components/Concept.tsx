import React from 'react';
import { clsx as mergex } from 'clsx'


/*
 * @internal
 * @description Describes the Kinds that Concepts can be tagged with
 */
enum ConceptKind {
  core     = "Core",
  advanced = "Advanced",
  mastery  = "Mastery",
}
/*
 * @internal
 * @description Describes the Categories that Concepts can be tagged with
 */
enum ConceptCategory {
  creator      = "Creator",
  visualscript = "Visualscript",
  typescript   = "Typescript",
  general      = "General",
}
/*
 * @internal
 * @description Describes the data stored and required for each concept
 */
type ConceptData = {
  title       : string
  kind        : ConceptKind
  category    : ConceptCategory
  description : string
}
/*
 * @internal
 * @description Dummy concept. Used for debugging / testing
 */
const Dummy :ConceptData= {
  title       : "Untitled Concept",
  kind        : ConceptKind.core,
  category    : ConceptCategory.general,
  description : " Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat. Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat. Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat. Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat. Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat. Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat. Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.",
}
/*
 * @internal
 * @description Alias for the type of Map that stores the Concepts registered by the documentation.
 */
type ConceptsMap = Map<string, ConceptData>;
/*
 * @internal
 * @description Stores the list of Concepts registered by the documentation.
 */
const ConceptList :ConceptsMap= new Map();
// Add a dummy concept for testing/debugging
ConceptList.set("Debug Concept", {
  title       : "Debug Concept",
  kind        : ConceptKind.core,
  category    : ConceptCategory.general,
  description : "Debug Concept. Some Dummy Description. Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat."
  })


/*
 * @description Adds a new Concept to the internal list of concepts
 * @note
 * Implicitly called whenever a new unmapped Concept is rendered for the first time.
 * This function will not be called if the `Concept.temporary` property is set to `true` when rendering the Concept for the first time.
 */
export function addConcept(
    title       : string,
    kind        : ConceptKind,
    category    : ConceptCategory,
    description : string
  ) :void {
  const data :ConceptData= {title: title, description: description, kind: kind, category: category}
  ConceptList.set(title, data)
}

/*
 * @internal
 * @description Returns the correct text for marking a Concept as essential or Non-Essential, based on the given {@param kind}
 */
function getEssentialText(kind :ConceptKind) {
  return kind == ConceptKind.core ? "Essential" : (kind == ConceptKind.advanced) ? "Non-Essential" : "";
}

/*
 * @internal
 * @description Renders the onHover Card of a Concept
 */
const ConceptInlineTooltip = (props) => {
  // Tooltip General Style
  const Align      = "absolute flex flex-col basis-1/3 px-4 py-2 left-1/2 -translate-x-1/2 -translate-y-full -m-8"
  const Visibility = "opacity-0 peer-hover:opacity-100" // Make it visible only when peer (aka the Inline Text) is hovered.
  const Transition = "transition-opacity"
  const Text       = "text-sm"
  const Shape      = "rounded-md max-w-prose"
  const BG         = "bg-blue-800"
  const Tooltip    = mergex(Align, Visibility, Transition, Text, Align, Shape, BG)
  // Top Section Style
  const Top        = "flex justify-between pb-2"
  const Title      = "font-bold"
  const Meta       = "flex-auto text-end"
  const Essential  = "flex-auto text-right italic text-xs align-bottom align-text-bottom"
  // Description style
  const Description = "text-justify"
  // Figure out if the concept is essential or not, and add the text to the Top Section
  const essentialText = getEssentialText(props.kind)
  // Render the Component
  return (<React.Fragment>
    <div className={Tooltip}>
      <div className={Top}>
        <span className={Title}>{props.title}</span>
        <span className={Essential}>{essentialText}</span>
        <span className={Meta}>Type: <strong>{props.category} {props.kind} Concept </strong></span><br />
      </div>
      <span className={Description}>{props.children} {/* Description */}</span>
    </div>
  </React.Fragment>);
}

/*
 * @internal
 * @description Renders a Concept as an inline Link+Card.
 */
const ConceptInline = (props) => {
  const Peer = "peer" // Mark the text as the Peer for the onHover to react to
  const Text = mergex(Peer, "text-blue-500 underline underline-offset-8")
  return (<React.Fragment>
    <span>
      <span className={Text}>{props.title}</span>
      <ConceptInlineTooltip
        title    = {props.title}
        kind     = {props.kind}
        category = {props.category}
        >
        {props.children} {/* Description */}
      </ConceptInlineTooltip>
    </span>
  </React.Fragment>);
}

/*
 * @internal
 * @description Renders a Concept as a Paragraph / Block of text.
 */
const ConceptBlock = (props) => {
  // Text Content
  const AfterTitle   = ":  "
  // CSS
  const Container    = ""
  const Title        = ""
  const Meta         = "right-80 text-align-right text-sm"
  const Essential    = "italic text-xs"
  // Figure out if the concept is essential or not, and add the text to the Top Section
  const essentialText = getEssentialText(props.kind)
  // Return the component HTML Fragment
  return (<React.Fragment>
    <section className={Container}>
      <strong className={Title}>{props.title}</strong>{AfterTitle}
      <i className={Essential}>&emsp;&emsp;{props.kind} {essentialText}</i>
      {props.children} {/* Description */}
    </section>
  </React.Fragment>)
}

/*
 * @internal
 * @description Picks which type of Component will be rendered, based on the passed properties/data
 */
const ConceptSelector = (props) => {
  return (props.block
    ? <ConceptBlock title={props.title} kind={props.kind} category={props.category}>{props.children}</ConceptBlock>
    : <ConceptInline title={props.title} kind={props.kind} category={props.category}>{props.children}</ConceptInline>
    )
}


/*
 * @internal
 * @description Renders a Concept based on the passed properties/data
 */
const UnknownConcept = (props) => {
  // Replace with Dummy text when omitted
  const Title       = props.title    ? props.title    : Dummy.title
  const Kind        = props.kind     ? props.kind     : Dummy.kind
  const Category    = props.category ? props.category : Dummy.category
  const Description = props.children ? props.children : Dummy.description
  // Store the concept into `ConceptList` when it hasn't been yet, and `temporary=` is not set to true
  if (!props.temporary && !ConceptList.has(Title)) addConcept(Title, Kind, Category, Description)
  // Return the component HTML Fragment
  return (<ConceptSelector
      title    = {Title}
      kind     = {Kind}
      category = {Category}
      block    = {props.block}>
    {Description}
    </ConceptSelector>)
}
/*
 * @internal
 * @description Renders a Concept based on the data stored into `ConceptList` for the given `title=` property
 */
const KnownConcept = (props) => {
  // Access the data from the ConceptList, based on the passed `title=` value
  //
  // Get the Data: Map[key] with !Element check
  // const data = ConceptList[props.title]  // <--- For some reason, this sometimes gives invalid data
  // if (!data) return // <--- This line stops the page from crashing, but also fails to render the component correctly
  //
  // Get the Data: foreach
  // @note For some reason, this is the only reliable option that never fails to access the data.
  let data :ConceptData
  ConceptList.forEach((value: ConceptData, key: string) => { if (key == props.title) data = value });
  return (<ConceptSelector
      title    = {data.title}
      kind     = {data.kind}
      category = {data.category}
      block    = {props.block}>
    {data.description}
    </ConceptSelector>)
}


/*
 * @description
 * Renders a Concept into the page
 * It can define just a title if the Concept has already been added to the list before.
 * The fields `kind`, `category` and `children` are required whenever a new Concept is being requested to be rendered before adding it manually beforehand.
 *
 * @param title The Concept's title. Will be used to search the internal list of already known concepts.
 * @param kind The Concept's kind. Accepts only valid {@link ConceptKind} fields.
 * @param category The Concept's category. Accepts only valid {@link ConceptCategory} fields.
 * @param children The body of the Concept's description.
 * @param block Will render the Concept as a block of text when true. Will render inline otherwise.
 * @param temporary Will skip adding the Concept to the internal Concepts list when true.
 */
export const Concept = (props) => {
  if (ConceptList.has(props.title)) {
    // Assert that component properties other than the title are undefined
    //@TODO:
    // Turn this into a compile-time assertion, if posssible    https://github.com/facebook/docusaurus/discussions/10046
    // Docusaurus gets confused and triggers this incorrectly when clicking on a title/table-of-contents hyperlink
    // if (props.kind) throw Error("Tried to define a `.kind=` property for a concept that already exists: "+props.title)
    // if (props.category) throw Error("Tried to define a `.category=` property for a concept that already exists: "+props.title)
    // if (props.children) throw Error("Tried to define a `.description=` property for a concept that already exists: "+props.title)
    // Render the Concept from the known ConceptList
    return (<KnownConcept title={props.title} block={props.block}/>);
  } else {
    // Render a Concept from the data passed to the component
    return (
      <UnknownConcept
        title     = {props.title}
        kind      = {props.kind}
        category  = {props.category}
        block     = {props.block}
        temporary = {props.temporary}
        >
        {props.children} {/* Description */}
      </UnknownConcept>
    );
  }
};


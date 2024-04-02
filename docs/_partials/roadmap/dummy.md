import { Concept } from '@site/src/components/Concept'

<Concept title="Dummy Concept Title" kind="Mastery" block={true}>This is a dummy text for a new mastery concept.</Concept>

<Concept
  title = "Another Dummy Title"
  kind  = "Core"
  block = {true}>
This is another dummy definition for a new core concept.
Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
</Concept>

This <Concept title="Another Dummy Title" /> is inline, using the component data defined above.
This is a <Concept title="Dummy Concept" /> rendered inline from the internal map of stored concepts.

<br></br>
The blocks of text below are auto-generated with the same components above:
<Concept title="Another Dummy Title" block={true} />
<Concept title="Dummy Concept" block={true} />


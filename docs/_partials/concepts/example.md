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
<!-- NOTE: The definition above could set (or omit) the block property to `false`, to render its definition as an Inline Concept -->

This <Concept title="Another Dummy Title" /> is inline, using the component data defined above.
This is a <Concept title="Dummy Concept" /> rendered inline from the internal map of stored concepts.

<br></br>
The blocks of text below are auto-generated with the same components above:
<Concept title="Another Dummy Title" block={true} />
<Concept title="Dummy Concept" block={true} />

<br></br>
<Concept
  title     = "A Temporary Concept"
  kind      = "Mastery"
  block     = {true}
  temporary = {true}>
This is a temporary Concept definition.
Its data will not be stored in the internal list of concepts.
This means that this concept cannot be rendered just by calling its title, like we did with the examples above.
Concept titles are used to search for the Concept inside the internal list of previously defined concepts, but temporary concepts do not exist in that list.
</Concept>

<!--
ERROR: The code for this concept will error if it is removed from this html.comment block
This is a <Concept title="A Temporary Concept" />, but it won't work because temporary concepts are not stored.
-->

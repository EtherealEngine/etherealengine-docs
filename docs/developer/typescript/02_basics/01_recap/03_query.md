---
sidebar_label: Query
---
import { TechnicalNote } from '@site/src/components/TechnicalNote';
import { UnstyledDetails } from '@site/src/components/UnstyledDetails';

# Define a Query
Queries are the simplest concept to explain out of everything we have dealt with so far.  
But we looked into them only briefly, so lets explore their technical properties anyway.  

iR Engine's `defineQuery` is a function that accepts an [`array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) of `Component` types, and will return a [JavaScript Generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators#generator_functions). This `Generator` can then be used in a [`for`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for) loop to iterate over **all** entities that contain **all** Components in the list that we provided _(ie: our array of Components)_.

:::note
The returned Query can be named anything we want, as its name is only relevant for our project.  
:::
```ts
const helloQuery = ECS.defineQuery([HelloComponent])

for (const entity of helloQuery()) {
  // Do something for all entities that contain a HelloComponent
}
```

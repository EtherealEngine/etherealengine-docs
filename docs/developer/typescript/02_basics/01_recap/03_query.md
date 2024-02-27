---
sidebar_label: Query
---
import { TechnicalNote } from '@site/src/components/TechnicalNote';
import { UnstyledDetails } from '@site/src/components/UnstyledDetails';

# Define a Query
Ethereal Engine's `defineQuery` is a function that accepts an `array` of `Component` types, and will return a JavaScript `Generator`.  
This [JavaScript Generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators#generator_functions) can be used in a `for` loop to iterate over `all` entities that contain `all` Components in our list.

The Query can be named anything we want, as it is only relevant for our project.  
```ts
const helloQuery = ECS.defineQuery([HelloComponent])

for (const entity of helloQuery()) {
  // Do something with the entity
}
```

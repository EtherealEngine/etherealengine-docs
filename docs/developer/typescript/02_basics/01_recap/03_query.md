---
sidebar_label: Query
---
import { TechnicalNote } from '@site/src/components/TechnicalNote';
import { UnstyledDetails } from '@site/src/components/UnstyledDetails';

# Define a Query
```ts
const helloQuery = ECS.defineQuery([HelloComponent])

for (const entity of helloQuery()) {
  // Do something with the entity
}
```
### Name
Arbitrary name/symbol/identifier
### Arguments
Array of Component types
### Return type
Returns a [Generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators#generator_functions).
### Usage
Inside a for loop.

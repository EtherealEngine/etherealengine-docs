---
sidebar_label: Custom Component
---
import { TechnicalNote } from '@site/src/components/TechnicalNote';
import { UnstyledDetails } from '@site/src/components/UnstyledDetails';

# Defining a Custom Component
...
```ts
// Define our component
const HelloComponent = ECS.defineComponent({
  name: 'ee.tutorial.HelloComponent',
  jsonID: 'ee.tutorial.HelloComponent',
  onInit: () => { return { initialized: false } }
})
```


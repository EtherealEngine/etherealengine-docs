---
sidebar_label: State
---

import { TechnicalNote } from '@site/src/components/TechnicalNote';

# Managing State
There are multiple ways to keep track of state
- Manually maintaining the value of a variable
- A state variable with `Hyperflux`
- A reactor mount with `useEffect`

## Local Variable
You might remember the `initialized` variable we created in an earlier section of the [Hello World](../hello/system) tutorial.  
That variable was what is called "Local State".  

As you saw, we are fully responsible of book-keeping the values contained in the variables we create in this way.  

## Hyperflux
Ethereal Engine provides a group of functions to manage state asynchronously.  
## `useEffect`

<TechnicalNote title="Full Solution">
</TechnicalNote>

```ts
/**
 * Global state that tracks locally spawned or destroyed artifacts by using action receptors
 */

const BasicState = defineState({
  name: 'ee.basic.BasicState',

  initial: {} as Record<EntityUUID, {}>,

  receptors: {
    onSpawnAction: BasicActions.spawnAction.receive((action) => {
      const state = getMutableState(BasicState)
      state[action.entityUUID].merge({})
    }),
    onDestroyObject: WorldNetworkAction.destroyObject.receive((action) => {
      const state = getMutableState(BasicState)
      state[action.entityUUID].set(none)
    })
  }
})

```

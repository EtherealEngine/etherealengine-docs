---
sidebar_label: Execution Order
---

import DocCardList from '@theme/DocCardList'
import { TechnicalNote } from '@site/src/components/TechnicalNote';

# Systems Execution Guide
## Update Loop
Ethereal Engine uses a very similar model to [Unity's update loop](https://docs.unity3d.com/Manual/ExecutionOrder.html), by the use of a [fixed timestep](https://www.gafferongames.com/post/fix_your_timestep/) update loop.

The engine defines a `frame update` process that is called once per frame.  
Inside this frame-update process there is a `fixed update` process that operates with an `accumulator` pattern.  
This accumulator ensures that time will always step at a stable number of updates per second, independent of the processing power of the hardware running the engine.

_Note: Because the fixed update process is independent of frame updates, each individual frame update may execute 0-to-many fixed updates during its lifetime._

Ethereal Engine implements this feature through system **pipelines**, which are collections of systems that will be executed in a specific order.


## Execution Order
<DocCardList />

<TechnicalNote title="Definitions">

```ts
export const InputSystemGroup = defineSystem({
  uuid: 'ee.engine.input-group',
  insert: {}
})

/** Run inside of fixed pipeline */
export const SimulationSystemGroup = defineSystem({
  uuid: 'ee.engine.simulation-group',
  timeStep: 1 / 60,
  insert: {}
})

export const AnimationSystemGroup = defineSystem({
  uuid: 'ee.engine.animation-group',
  insert: {}
})

export const PresentationSystemGroup = defineSystem({
  uuid: 'ee.engine.presentation-group',
  insert: {}
})

export const DefaultSystemPipeline = [
  InputSystemGroup,
  SimulationSystemGroup,
  AnimationSystemGroup,
  PresentationSystemGroup
]
```
</TechnicalNote>

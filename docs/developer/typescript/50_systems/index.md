---
sidebar_label: Systems Execution
---

import DocCardList from '@theme/DocCardList'
import { TechnicalNote } from '@site/src/components/TechnicalNote';

# Systems Execution Guide

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

---
sidebar_label: Hello Ethereal
---
# Hello World from Ethereal Engine
The quickstart tutorial helped us create a project and run the engine for the first time.  
It automated a lot for us, so lets review what we have done so far.

## Conceptual overview
This is what we have done with the example's project:
- We created an entity called `hello-world`
- We gave the entity a primitive geometry component _(a sphere)_
- We defined the position of the sphere in the scene

## Technical overview
This is what we have done with the example's source code:
- We used the `ECS` pattern
- We created an `Entity`
- We added a few `Component`s to our Entity
- We imported some Ethereal Engine's typescript modules in our file
- We added our code to the engine with the `worldInjection` function.

Our example from the quickstart tutorial is as minimal as it can possibly be.  
But there is a lot happening already, as you can see, even in such a minimal example.  
Lets take some time to understand how everything works.

```ts title="ee-tutorial-hello/src/Hello.ts" showLineNumbers
import { ECS } from '@etherealengine/ecs'
import { NameComponent } from '@etherealengine/spatial/src/common/NameComponent'
import { VisibleComponent } from '@etherealengine/spatial/src/renderer/components/VisibleComponent'
import { TransformComponent } from '@etherealengine/spatial/src/transform/components/TransformComponent'
import { PrimitiveGeometryComponent } from '@etherealengine/engine/src/scene/components/PrimitiveGeometryComponent'
import { Vector3 } from 'three'

export default async function worldInjection() {
  const entity = ECS.createEntity()
  ECS.setComponent(entity, NameComponent, 'hello-world')
  ECS.setComponent(entity, VisibleComponent)
  ECS.setComponent(entity, TransformComponent, { position: new Vector3(0, 1, 0) })
  ECS.setComponent(entity, PrimitiveGeometryComponent, { geometryType: 1 })
}
```

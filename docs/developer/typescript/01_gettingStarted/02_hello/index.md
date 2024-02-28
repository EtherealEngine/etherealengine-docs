---
sidebar_label: Hello Ethereal
---
# Hello World from Ethereal Engine
The quickstart tutorial helped us create a project and run the engine for the first time.  

This is our starting point.  
The Quickstart has automated a lot for us, so lets review what we have.

## Conceptual overview
Conceptually, this is what the example project does:
- It creates an entity called `hello-world`
- It gives the entity a primitive geometry component _(a Sphere)_
- It defines the position of the sphere in the scene

## Technical overview
In technical terms, this is what the example's source code does:
- It uses the `ECS` pattern
- It creates an `Entity`
- It adds few `Component`s to the Entity
- It imports some Ethereal Engine's typescript modules in its code 
- It adds its code to the engine through the `xrengine.config.ts` file

```ts title="ee-tutorial-hello/src/Hello.ts" showLineNumbers
import { ECS } from '@etherealengine/ecs'
import { NameComponent } from '@etherealengine/spatial/src/common/NameComponent'
import { VisibleComponent } from '@etherealengine/spatial/src/renderer/components/VisibleComponent'
import { TransformComponent } from '@etherealengine/spatial/src/transform/components/TransformComponent'
import { PrimitiveGeometryComponent } from '@etherealengine/engine/src/scene/components/PrimitiveGeometryComponent'
import { Vector3 } from 'three'

const entity = ECS.createEntity()
ECS.setComponent(entity, NameComponent, 'hello-world')
ECS.setComponent(entity, VisibleComponent)
ECS.setComponent(entity, TransformComponent, { position: new Vector3(0, 1, 0) })
ECS.setComponent(entity, PrimitiveGeometryComponent, { geometryType: 1 })
```

## The Path Forward
Our example from the quickstart tutorial is as minimal as it can possibly be.  
But there is a lot happening already, as you can see, even in such a minimal example!  
So, the first step we will take is to spend some time understanding how everything in the example works.

Next we will get our hands into the code, and learn how to program with Ethereal Engine.

Then, at the end of this guide, we will have a very minimal project that we can load with the Engine.  
But, more importantly, we will have enough knowledge to be able to continue our learning through the `Ethereal Engine: Basics` guide.  

Lets not delay any longer, and get started with our journey!


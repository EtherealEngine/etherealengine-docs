---
sidebar_label: Hello iR Engine
---
# Hello World from iR Engine
The quickstart tutorial helped us create a project and run the engine for the first time.  

This is our starting point.  
The Quickstart has automated a lot for us, so lets review what we have.

:::note
Don't dwell too much on this page.  
This is a quick preview, so please skim read and don't go into too much detail.  
The purpose of the next few pages of this tutorial is to teach you how these concepts work.  
:::

## Hello World Code
This is how the code for our project looks like at the moment.  
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

## Conceptual overview
Conceptually, this is what the example project does:
- It creates an entity called `hello-world`
- It gives the entity a primitive geometry component _(a Sphere)_
- It defines the position of the sphere in the scene

## Technical overview
In technical terms, this is what the example's source code does:
- It imports some iR Engine's typescript modules in its code 
- It uses the `ECS` pattern
- It creates an `Entity`
- It adds a few `Components` to the Entity
- It adds its code to the engine through the `xrengine.config.ts` file

## The Path Forward
Our example from the quickstart tutorial is as minimal as it can possibly be.  
But there is a lot happening already, as you can see, even in such a minimal example!  
So, the first step we will take is to spend some time understanding how everything in the example works.

Next we will get our hands into the code, and learn how to program with iR Engine.

Then, at the end of this guide, we will have a very minimal project that we can load with the Engine.  
But, more importantly, we will have enough knowledge to be able to continue our learning through the `iR Engine: Basics` guide.  

Lets not delay any longer, and get started with our journey!


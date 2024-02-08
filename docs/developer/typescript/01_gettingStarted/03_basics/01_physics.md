---
sidebar_label: Physics
---
import { TechnicalNote } from '@site/src/components/TechnicalNote';

# Adding Physics
So far we have learned how to create an `Entity`, and how to tell the engine what we want that entity to be.  
In simple terms, we have told the engine how to **create** our sphere.  

## Our problem
We added some components to our sphere, so that the engine can draw the sphere into the screen and we can see it.  
But right now it is only an "empty shell" that sits there doing nothing, which is a bit boring.  
We cannot even use it as a platform to walk on!  
Lets fix that.

## Our solution
We are going to add a Collider and a RigidBody to our sphere object.  

Physics properties are tricky to test, as they are not readily visible. So lets get a point of reference of how our project currently behaves.  
In order to test our changes in a simple way, we will run our project from the studio and walk around the scene with an Avatar.  

These are the steps needed to accomplish that:
- Open the scene we created before, or click on `Create Scene` if don't have it
- Press the `Play` button in the studio
- Move your Avatar around the scene by either:
  - Pressing `WASD` in your keyboard
  - Clicking anywhere on the ground with your mouse

You may notice that, if you try to hit the sphere with your avatar... you will instead walk right through it!
This happens because our Sphere doesn't have any Physics properties yet, so it can be "seen" but not "collided against".

## Physics Properties
In order to correct our problem, we are now going to:
- Add a `RigidBodyComponent` of type `dynamic` to our entity
- Add a `ColliderComponent` with the shape of a `sphere`

Here are your hints for this tutorial:
```ts
// Both the RigidBody and Collider components are part of the `Spatial/physics` engine module
'@etherealengine/spatial/src/physics/components/.....'
// We can specify the dynamic type with:
{ type: 'dynamic' }
// We can specify the shape with:
{ shape: 'sphere' }
```

You will know that your code is correct if:
- You try to go through the ball with the Avatar, but the engine stops you.
<!-- TODO: Write proper instructions for this -->

<TechnicalNote title="Solution">

```ts
// Import both components from the Spatial/physics module
import { RigidBodyComponent } from '@etherealengine/spatial/src/physics/components/RigidBodyComponent'
import { ColliderComponent } from '@etherealengine/spatial/src/physics/components/ColliderComponent'
```
```ts
// Set both components to our entity
ECS.setComponent(entity, RigidBodyComponent, { type: 'dynamic' })
ECS.setComponent(entity, ColliderComponent, { shape: 'sphere' })
```

<TechnicalNote title="Full Solution">

```ts
import { ECS } from '@etherealengine/ecs'
import { NameComponent } from '@etherealengine/spatial/src/common/NameComponent'
import { VisibleComponent } from '@etherealengine/spatial/src/renderer/components/VisibleComponent'
import { TransformComponent } from '@etherealengine/spatial/src/transform/components/TransformComponent'
import { PrimitiveGeometryComponent } from '@etherealengine/engine/src/scene/components/PrimitiveGeometryComponent'
import { Vector3 } from 'three'
import { GeometryTypeEnum } from '@etherealengine/engine/src/scene/constants/GeometryTypeEnum'
import { PhysicsSystem } from '@etherealengine/spatial/src/physics/PhysicsModule'

// highlight-start
import { RigidBodyComponent } from '@etherealengine/spatial/src/physics/components/RigidBodyComponent'
import { ColliderComponent } from '@etherealengine/spatial/src/physics/components/ColliderComponent'
// highlight-end


let initialized = false
const hello = () => {
  if (initialized) return
  initialized = true

  const entity = ECS.createEntity()
  ECS.setComponent(entity, NameComponent, 'hello-world')
  ECS.setComponent(entity, VisibleComponent)
  ECS.setComponent(entity, TransformComponent, { position: new Vector3(0, 1, 0) })
  ECS.setComponent(entity, PrimitiveGeometryComponent, { geometryType: GeometryTypeEnum.SphereGeometry })

  // highlight-start
  ECS.setComponent(entity, RigidBodyComponent, { type: 'dynamic' })
  ECS.setComponent(entity, ColliderComponent, { shape: 'sphere' })
  // highlight-end
}

export const HelloWorldSystem = ECS.defineSystem({
  uuid: 'helloworld.system',
  execute: hello,
  insert: { after: PhysicsSystem }
})

export default async function worldInjection() {}
```
</TechnicalNote>
<!-- Full Solution End -->
</TechnicalNote>
<!-- Solution End -->


import { TechnicalNote } from '@site/src/components/TechnicalNote';

# Components
Ok, lets admit the truth.  
We have cheated with something else.  

You might have noticed already, but we are creating a Sphere for **every scene**.  
Open any other project with the engine, and you will see that our ball is also there!  
That's not good. Whoops.  


## Our Problem
We have setup our Sphere code to be simple and minimal.  
This is what we have done so far:  
- We created a file called `src/Hello.ts` that contains our code
- We connected our code to the engine with the project's configuration file
- We defined a system at module scope using `defineSystem`
- We never defined our Sphere as a Component  _(whoops)_
- We never added our Sphere Component to a specific Scene  
  _(well, we didn't have a Sphere Component, so we couldn't)_

These two last steps are the key of our problem.  
The reason is because the engine will execute projects globally, but we are not restricting our code to be run only when requested.  

So our example, up until now, has been acting as if it was an extension to the Studio editor!  

<TechnicalNote>
A more technical description of our problem is that our example is not using the engine API properly.   
Execution of projects is global and meant to be data oriented.  
But the data we’re relying on in our example is created within the project, instead of being triggered by actions from our users.  
</TechnicalNote>

## Our Solution
The proper way to add our simple Sphere would be to lock our logic behind a custom Scene Component.  
That way, when a component is added to an entity, the system can be activated through a query.  


## Creating a Custom Component
<!--
TODO:
- [ ] Fixing the ball being in every scene (anti-pattern)
  - [ ] Custom Scene   ( provided in the repo )
  - [ ] Specify in the scene that the ball should spawn
  - [ ] Custom component  
        Create Scene Component specific to the hello world tut  
        Tie it by filename  
-->

```ts
// Define our component
export const HelloComponent = ECS.defineComponent({
  name: 'ee.tutorial.HelloComponent',
  jsonID: 'ee.tutorial.HelloComponent',
  onInit() { return { initialized: false } }
})
```
```ts
// Define our query
const helloQuery = ECS.defineQuery([HelloComponent])
```
```ts
// Set our initialized state to true
ECS.getMutableComponent(entity, HelloComponent).initialized.set(true)
```

```ts
import { ECS } from '@etherealengine/ecs'
import { NameComponent } from '@etherealengine/spatial/src/common/NameComponent'
import { VisibleComponent } from '@etherealengine/spatial/src/renderer/components/VisibleComponent'
import { TransformComponent } from '@etherealengine/spatial/src/transform/components/TransformComponent'
import { PrimitiveGeometryComponent } from '@etherealengine/engine/src/scene/components/PrimitiveGeometryComponent'
import { Vector3 } from 'three'
import { GeometryTypeEnum } from '@etherealengine/engine/src/scene/constants/GeometryTypeEnum'
import { PhysicsSystem } from '@etherealengine/spatial'

// Define our component
export const HelloComponent = ECS.defineComponent({
  name: 'ee.tutorial.HelloComponent',
  jsonID: 'ee.tutorial.HelloComponent',
  onInit() { return { initialized: false } }
})

// Define our query
const helloQuery = ECS.defineQuery([HelloComponent])

const hello = () => {
  for (const entity of helloQuery()) {
    const { initialized } = ECS.getComponent(entity, HelloComponent)
    if (initialized) continue

    ECS.getMutableComponent(entity, HelloComponent).initialized.set(true)

    ECS.setComponent(entity, NameComponent, 'hello-entity')
    ECS.setComponent(entity, VisibleComponent)
    ECS.setComponent(entity, TransformComponent, { position: new Vector3(0, 1, 0) })
    ECS.setComponent(entity, PrimitiveGeometryComponent, { geometryType: GeometryTypeEnum.SphereGeometry })
  }
}

// Define our system
export const HelloSystem = ECS.defineSystem({
  uuid: 'ee.tutorial.HelloSystem',
  execute: hello,
  insert: { after: PhysicsSystem }
})
```


import { TechnicalNote } from '@site/src/components/TechnicalNote';
import { UnstyledDetails } from '@site/src/components/UnstyledDetails';

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

These two last steps are the key to our problem.  
This happens because the engine will execute projects globally, but we are not restricting our code to be run only when requested.  

So our example, up until now, has been acting as if it was an extension to the Studio editor!  

<TechnicalNote>
A more technical description of our problem is that our example is not using the engine API properly.   
Execution of projects is global and meant to be data oriented.  
But the data we’re relying on in our example is created within the project, instead of being triggered by actions from our users.  
</TechnicalNote>

## Our Solution
The proper way to add our simple Sphere would be to lock our logic behind a custom Scene Component.  
That way, when a component is added to an entity, the system can be activated through a query.  

Solving this correctly will require us to use all of these new concepts:
- Defining a Custom Component
- Defining a Query for our Component
- Manage our `initialized` variable from inside our Component


## Creating a Custom Component {#create}
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
  onInit: () => { return { initialized: false } }
})
```
```ts
// Define the query that will find our Scene's Entity
const helloQuery = ECS.defineQuery([HelloComponent])
```
```ts
// Set our initialized state to true
ECS.getMutableComponent(entity, HelloComponent).initialized.set(true)
```


```ts title="ee-tutorial-hello/src/Hello.ts" showLineNumbers
import { ECS } from '@etherealengine/ecs'
import { NameComponent } from '@etherealengine/spatial/src/common/NameComponent'
import { VisibleComponent } from '@etherealengine/spatial/src/renderer/components/VisibleComponent'
import { TransformComponent } from '@etherealengine/spatial/src/transform/components/TransformComponent'
import { PrimitiveGeometryComponent } from '@etherealengine/engine/src/scene/components/PrimitiveGeometryComponent'
import { Vector3 } from 'three'
import { GeometryTypeEnum } from '@etherealengine/engine/src/scene/constants/GeometryTypeEnum'
import { PhysicsSystem } from '@etherealengine/spatial'

// Define our component
//highlight-start
export const HelloComponent = ECS.defineComponent({
  name: 'ee.tutorial.HelloComponent',
  jsonID: 'ee.tutorial.HelloComponent',
  onInit: () => { return { initialized: false } }
})
//highlight-end

// Define the query that will find our Scene's Entity
//highlight-start
const helloQuery = ECS.defineQuery([HelloComponent])
//highlight-end

const hello = () => {
  //highlight-start
  for (const entity of helloQuery()) {
    const { initialized } = ECS.getComponent(entity, HelloComponent)
    if (initialized) continue
    //highlight-end

    //highlight-start
    ECS.getMutableComponent(entity, HelloComponent).initialized.set(true)
    //highlight-end

    ECS.setComponent(entity, NameComponent, 'ee.tutorial.hello-entity')
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
<TechnicalNote title="Solution">
<UnstyledDetails title="Full Solution">
</UnstyledDetails>
</TechnicalNote>

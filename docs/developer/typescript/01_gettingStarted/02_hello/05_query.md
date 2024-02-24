import { TechnicalNote } from '@site/src/components/TechnicalNote';
import { UnstyledDetails } from '@site/src/components/UnstyledDetails';

# Queries
Queries are a tool provided by the `Entity Component System` pattern used by Ethereal Engine.  

In simple terms, a Query is a function that will request all entities that match a certain condition.  
More specifically, it will return **all** entities that contain **all** Components in the list that we specify.  

## Creating a Query
We are going to **define a Query**. I think you can figure out the name of the function already :)  
This is how the function works:
- We give the function an [array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) of Components
- The function will give us back a Query function
- We can call the given function to retrieve all entities that contain the components that we specified.

:::note[notes]
1. We need to send an array anyway, even if it only contains a single Component.  
2. The Query will match only those entities that contain **all** components in our list.  
3. We don't need to export the Query function, as it will only be called by our own code.
:::

Here are your hints for this assignment:  
```ts
// Define the query that will find our Scene's Entity
const ... = ...([ ... ])
```

<TechnicalNote title="Solution">

```ts
// Define the query that will find our Scene's Entity
const helloQuery = ECS.defineQuery([HelloComponent])
```
</TechnicalNote>
Same as before, if you run the project as it is now you won't see any changes just yet.  
We have defined the Query that will search for our Scene's entity, but we haven't called it yet.

## Using our Query
A Query, when called, will return a array.  
This array will contain the list of all entities that match the list of Components that we specified.  
Just like any other array, we can iterate through it with a `for` loop.  

This means that we can access as many entities as we want from a single unified place!  
Really powerful.  

I gave you one solution for free earlier, but I'm leaving this assignment a bit ambiguous on purpose.  
See if you can figure out which part of your code goes where before looking at the solution.  
```ts
// Our for loop will look something like this
for (const entity of ...) {
  // Our code goes here ...
}
```

Here are some hints, in case you get stuck:  

<TechnicalNote title="Hints">
<UnstyledDetails title="1. Initialized Variable">
We cannot store our variable in module scope anymore.  
The state management code **must** be inside our `execute` function.
</UnstyledDetails>
<UnstyledDetails title="2. Entity Loop">
We need to execute some code for an entity, just like we did before. That hasn't changed.  
But we need to change **where** our code will be run.
</UnstyledDetails>
</TechnicalNote>

<TechnicalNote title="Solution">

```ts
const hello = () => {
  //highlight-start
  for (const entity of helloQuery()) {
    //highlight-end

    //highlight-start
    // Check if we have already initialized our Sphere
    let { initialized } = ECS.getMutableComponent(entity, HelloComponent)
    if (initialized.value) continue
    initialized.set(true)  // Set our initialized state to true
    //highlight-end

    ECS.setComponent(entity, NameComponent, 'ee.tutorial.hello-entity')
    ECS.setComponent(entity, VisibleComponent)
    ECS.setComponent(entity, TransformComponent, { position: new Vector3(0, 1, 0) })
    ECS.setComponent(entity, PrimitiveGeometryComponent, { geometryType: GeometryTypeEnum.SphereGeometry })
  }
}
```
</TechnicalNote>

## Conclusion
As you can see, we only added around 10 lines of code in these last two pages...   
But we introduced so many new concepts!  
That's the most exciting part about the ECS pattern. You can do **so** much with so little code.

You will know that you completed the last two pages correctly if:
- The behavior has not changed for your project. You can still see the sphere in the Scene.  
- You open another project _(eg: the `default-project` provided by the engine)_...  
  and the Sphere is gone!

Lets put everything together.  

<TechnicalNote title="Full Solution">

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
  jsonID: 'EE_tutorial_hello',
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
    // Check if we have already initialized our Sphere
    let { initialized } = ECS.getMutableComponent(entity, HelloComponent)
    if (initialized.value) continue
    initialized.set(true)  // Set our initialized state to true
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
Note how the style for names in this solution has been changed.  
We will learn about them next.  
</TechnicalNote>



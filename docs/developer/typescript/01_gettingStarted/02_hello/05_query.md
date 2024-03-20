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
const queryName = NAMESPACE.funtionName([ CustomComponentName ])
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
A Query, when called, will return a [JavaScript Generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators#generator_functions).  
This Generator can be used to access the list of all entities that match the list of Components that we specified.  

This means that we can access as many entities as we want from a single unified place!  
Really powerful.  

I gave you one solution for free earlier, but I'm leaving this assignment a bit ambiguous on purpose.  
I will give you three options. Pick the one that fits your learning style best:
1. Challenge:  
  See if you can figure out which part of your code goes where before looking at the solution or the hints. It will be very difficult.  
2. Intermediate difficulty:  
  Open each hint one by one, and take some time to reason about what the hint is trying to say before opening the next one.  
  You might land on the solution earlier than you think.  
3. Otherwise:  
  Read the hints, try to understand them a bit, and then compare what you thought with the full solution.  

Here are your hints:
```ts
// Our for loop will look something like this
for (const entity of /* queryName() */) {
  // Our code goes here ...
}
```

<TechnicalNote title="Hints">
This step is really difficult without hints. Don't worry if you cannot figure it out on your own.  
There is a lot to process, so what matters most is that you think it through.  

<UnstyledDetails title="1. JavaScript Generator">
Generators are called as if they were functions with no arguments, and they will [`yield`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield) the next entry of the list on every iteration.  

So, our `for` loop should say:
```ts
for (const entity in helloQuery()) {
  // do something for every entity
}
```
</UnstyledDetails>
<UnstyledDetails title="2. For Loop">
We cannot store our `initialized` variable in module scope anymore.  
And the code right above cannot be at the top level of your file either.  
It **must** be inside a function.  
</UnstyledDetails>
<UnstyledDetails title="3. Continue">
Remember the hint from earlier about the `continue` keyword?  
If not, [go back](./component#state-management) and read it again. You really need it now.
</UnstyledDetails>
<UnstyledDetails title="4. State Management">
Now is the moment when you need to add the code that I gave you "for free" earlier.  
Notice how the hint code above is giving you a `for` loop, and the State Management code has a `continue` keyword. They go together.
</UnstyledDetails>
<UnstyledDetails title="5. Initialized Variable">
The `initialized` variable from before cannot exist anymore.  
The state management code replaces it.
</UnstyledDetails>
<UnstyledDetails title="6. System Execute">
The state management code **must** be placed inside our `execute` function.  
</UnstyledDetails>
<UnstyledDetails title="7. Entity Creation and Loop">
We need to execute some code for an entity, just like we did before.  
That hasn't changed.  

But you cannot use `createEntity` anymore.  
The entity is `requested` by the Query, not created.  

> The `hello-final` scene already contains the entity.  
> Scroll down to the `Loading the Component` section right below if you are confused as to why this is the case.  

</UnstyledDetails>
<UnstyledDetails title="8. Source Code Order">
1. Import the engine modules
2. Define a Component
3. Define a Query that will request entities that contain that Component
4. Create a function that runs our code
5. Loop through all entities, and do something for each  
   _(We only have one, but we loop anyway)_
6. Make sure that we only execute our code once for each entity
7. Define a System
8. Set our function as the System's `execute` function 

You already have the code for #1, #2, #3, #6 and #7 from before.  
We are creating #5 with this step.  
We are also modifying #4:
- The initialized variable is replaced with the State Management code I gave you
- The State Management code **must** placed inside the new #5 loop
</UnstyledDetails>
</TechnicalNote>

<TechnicalNote title="Solution">

```ts
function hello() {
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
<UnstyledDetails title="Full Solution">

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
Notice how I have changed the code to use an arrow function.  
They can be used interchangeably, so feel free to use either of them.  

Also, notice how the style of the names in this solution has been changed.  
We will learn about them next.  
</UnstyledDetails>

</TechnicalNote>

## Loading the Component
Now, here is a question:
> How do we connect our custom scene Component to the scene?  

The answer is that there is one last piece of the project that we haven't talked about just yet.  
You might have even seen it in the Studio already if you explored a bit!  

We don't know how to add a Component to an entity through the Studio yet, or how to make our Component show up on the `Add Component` Studio UI.  
And we have gone through two entire pages with a LOT of theory but not a whole lot of practice.  
So I already solved this problem for you.  

When you open the `ee-tutorial-hello` project... there is a scene called `hello-final` in there.  
That's what we are looking for :)

Thanks to how the `hello-final` scene is setup, our Component will work in that Scene... but it will not work anywhere else! Really neat.  

<TechnicalNote>
What I did, exactly, was:
- I added an entity to the scene
- I added the component we are Quering for to the entity
- I saved the scene into the project  

This means that, when you installed the project with the Quickstart guide, you also downloaded the final scene that we need.  
</TechnicalNote>

## Confirm the Code
You will know that you have completed the [Components](./component) and [Queries](./query) tasks correctly if:
- The behavior has not changed for the `hello-final` scene. You can still see the sphere in the Scene.  
- You open another scene _(eg: `default-project/appartment` provided by the engine)_...  
  and the Sphere is gone!

## Conclusion
As you can see, we only added around 10 lines of code in these last two pages...  
But we introduced so many new concepts!  
That's the most exciting part about the ECS pattern. You can do **so** much with so little code.

I hope you didn't struggle too much with the last task. I know it was a difficult one.  
But I promise that, now that you have this knowledge, the road ahead will only get easier and easier.  

Lets see what we will learn next!  


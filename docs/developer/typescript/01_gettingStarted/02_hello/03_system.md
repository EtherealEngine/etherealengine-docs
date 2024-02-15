import { TechnicalNote } from '@site/src/components/TechnicalNote';
import { UnstyledDetails } from '@site/src/components/UnstyledDetails';

# Systems
If you have a keen eye you may have noticed something really important.  
We are using the `Entity Component System` pattern, and so far:
- We created an `Entity`
```ts
const entity = ECS.createEntity()
```
- We added `Components` to our Entity...  
```ts
ECS.setComponent(entity, NameComponent, 'hello-world')
ECS.setComponent(entity, VisibleComponent)
ECS.setComponent(entity, TransformComponent, { position: new Vector3(0, 1, 0) })
ECS.setComponent(entity, PrimitiveGeometryComponent, { geometryType: 1 })
```
- And then we asked Ethereal Engine to run our code with the `worldInjection` function...

## Wait, where is the System?
But we never defined a `System`!

In the quickstart tutorial we used a simplified code example for brevity and ease of understanding.  
But we also broke Ethereal Engine's best practices in order to achieve that simplicity.  
So, lets fix that.

<TechnicalNote>
The root of the problem is that we have [created and modified](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) our data inside module scope.  
This is an anti-pattern. [Data Mutation](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) operations should always occur in a [Controlled Context](/manual/modules/engine/ecs), and the module's top level scope is not such.
</TechnicalNote>

## Our first System
As we mentioned in the [ECS Pattern](./ecs) section earlier, `Systems` are used to define the logic and behavior of our application.  
But, in order to make the example easier to understand, we cheated a little bit and broke the engine's best practices.    

The correct way to create the Sphere of our minimal example would be to:
- Create a function that will create our Sphere.
- Define a `System` that will `execute` our function.
- Insert the System into the engine so that it is run right after the engine's `PhysicsSystem`.

### Our function
So far we have been defining the code that creates our Sphere inside the `worldInjection` function.  
This means that we relied on the function being called when the project configuration is loaded.  
But the correct way to do this is to define our code inside a separate function, and give that function to the `execute` parameter of a System created with `defineSystem`.  

Lets start by creating a new Typescript function, and moving our ECS code into that function.  
```ts
// Create a function
const /* name */ = () => { /* code */ }
```
We will also need to make sure that our code is only run once.  
Try to figure out a way to make your function code execute only once before looking at the solution.  
_hint: You won't need any special engine modules for this. Just regular Typescript will work._

<TechnicalNote title="Solution">

```ts
//highlight-start
let initialized = false   // Track whether our code was already initialized or not
//highlight-end

//highlight-start
const hello = () => {      // Define an arrow function that will run our code
  if (initialized) return  // Exit early if the code was already run before
  initialized = true       // Mark initialized to true, so the code is never run again later
//highlight-end

  // Create the Sphere object.
//highlight-start
  // Same code as before, but now it runs inside our function
//highlight-end
  const entity = ECS.createEntity()
  ECS.setComponent(entity, NameComponent, 'hello-world')
  ECS.setComponent(entity, VisibleComponent)
  ECS.setComponent(entity, TransformComponent, { position: new Vector3(0, 1, 0) })
  ECS.setComponent(entity, PrimitiveGeometryComponent, { geometryType: GeometryTypeEnum.SphereGeometry })
}
```
<TechnicalNote>
There are other ways to keep track of state than manually maintaining our `initialized` variable.  
- A state variable with `Hyperflux`
- A reactor mount with `useEffect`

But our `initialized` variable will keep things simple and minimal for the purpose of this tutorial.  
We will learn how properly manage state later on.  

</TechnicalNote>
<!-- State TechnicalNote End -->
</TechnicalNote>
<!-- Solution End -->

:::note
We are using a Typescript arrow function in this example.  
You could also use a regular Typescript function definition if you prefer.  
Both styles work perfectly well.  
:::


### The `defineSystem` function
In order to define a new system, we need to use the `defineSystem` function from the `ECS` namespace.  

This is what we need to know to use this function:
- `defineSystem` will return the type that represents our `System`
- We need to `export` that type so that the engine can access it
- We need to pass our function into the `execute` argument
- We don't need to add any new imports. The `defineSystem` function is available through the `ECS` namespace
- We will use the `insert` argument to tell the engine when we want our code to run

I already filled in some parts of the code. Try to fill in the rest by yourself before looking at the solution.  
```ts
/* ... */ = ECS.defineSystem({
  uuid: /* ... */,                 // The unique id of our System. Could be a string or a number.
  execute: /* ... */,              // The function that will run our code
  insert: { after: PhysicsSystem } // Tell the engine to run the system after the PhysicsSystem
})
```
:::note
The engine will take care of executing our code when it is correct to do so, based on the value we passed into the `insert` argument.  
:::

<TechnicalNote title="Solution">

```ts title="ee-tutorial-hello/src/Hello.ts"
//highlight-start
export const HelloWorldSystem = ECS.defineSystem({
  uuid: 'helloworld.system',
  execute: hello,
//highlight-end
  insert: { after: PhysicsSystem }
})
```
</TechnicalNote>

## Conclusion
This is how our final code will look like after we have completed these tasks.  

<TechnicalNote title="Full Solution">

```ts title="ee-tutorial-hello/src/Hello.ts" showLineNumbers
import { ECS } from '@etherealengine/ecs'
import { PhysicsSystem } from '@etherealengine/spatial/src/physics/PhysicsModule'
import { NameComponent } from '@etherealengine/spatial/src/common/NameComponent'
import { VisibleComponent } from '@etherealengine/spatial/src/renderer/components/VisibleComponent'
import { TransformComponent } from '@etherealengine/spatial/src/transform/components/TransformComponent'
import { PrimitiveGeometryComponent } from '@etherealengine/engine/src/scene/components/PrimitiveGeometryComponent'
import { Vector3 } from 'three'
import { GeometryTypeEnum } from '@etherealengine/engine/src/scene/constants/GeometryTypeEnum'


//highlight-start
let initialized = false    // Track whether our code was already run or not
//highlight-end

//highlight-start
// Our new function
const hello = () => {
  if (initialized) return
  initialized = true
  //highlight-end

  //highlight-start
  // Create the Sphere object inside our function.
  //highlight-end
  const entity = ECS.createEntity()
  ECS.setComponent(entity, NameComponent, 'hello-world')
  ECS.setComponent(entity, VisibleComponent)
  ECS.setComponent(entity, TransformComponent, { position: new Vector3(0, 1, 0) })
  ECS.setComponent(entity, PrimitiveGeometryComponent, { geometryType: GeometryTypeEnum.SphereGeometry })
}

//highlight-start
// Define our System
export const HelloWorldSystem = ECS.defineSystem({
  uuid: 'helloworld.system',
  execute: hello,
  insert: { after: PhysicsSystem }
})
//highlight-end
```
</TechnicalNote>

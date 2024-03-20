import { TechnicalNote } from '@site/src/components/TechnicalNote';
import { UnstyledDetails } from '@site/src/components/UnstyledDetails';

# Styling
We took a lot of shortcuts in previous sections of the tutorial.  
This made learning much simpler to get started with, but we also left out a few concepts that will make our codebase much easier to navigate as soon as our project starts growing.  

## ID Naming Convention
Lets start with the simplest style change.  
You may have noticed that we changed the `uuid` and `NameComponent` in the HelloWorld's final solution.  
The engine doesn't have a standard for these names yet, but this is a good naming convention that you can follow:
- Separate words with `.`
- Start with the namespace/organization/author of your project
- Follow by the project name of the thing that you are naming
- Follow by the name of the thing
- Separate multi-word names with `-`
```md
# Example
Namespace  : ee
Project    : tutorial
Thing      : HelloSystem

Result     : ee.tutorial.HelloSystem
Multi-word : ee.multi-word-example.HelloSystem
```
:::note[assignment zero]
This is not really an assignment, as we already did this before.  
But see if you have any names leftover in your code that are not using this standard, and change them so that they do.  
:::

## `jsonID` Naming Requirements
You may have also noticed that the `jsonID` field does not respect the naming convention we just explained above.  
Internally, the field `jsonID` will be used to define the name of a [glTF](https://www.khronos.org/gltf) extension.  
As such, the engine has a different standard for them:
- Separate words and multi-words with `_`
- Start with the namespace/organization/author of your project in UPPERCASE
- Follow by the project name of the thing that you are naming
- Follow by the name of the thing
```md
# Example
Namespace  : EE
Project    : tutorial
Thing      : hello

Result     : EE_tutorial_hello
Multi-word : EE_multi_word_example_hello
```

## Arrow Functions
We talked about Javascript [`Arrow Functions`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) during one of the earlier sections of the HelloWorld tutorial. They are used a lot throughout the engine's codebase.  

They are specially helpful when defining Systems and Components.  
This is how a `defineSystem` call would look like using each type of function:
```ts title="Regular Function   : Simpler, but less common in Ethereal Engine"
// Our function
function sayhello() { console.log("Hello World") }

// Our System
const HelloSystem = ECS.defineSystem({
  uuid: 'ee.tutorial.HelloSystem',
  execute: sayhello,
  insert: { after: PhysicsSystem }
})
```
```ts title="Arrow Function   : How defining a multi-field object usually looks like"
// Our function can be declared inside our system. Doesn't need a name
const HelloSystem = ECS.defineSystem({
  uuid: 'ee.tutorial.HelloSystem',
  execute: () => {
    console.log("Hello World")
  },
  insert: { after: PhysicsSystem }
})
```

As you can see, this gives us a very small gain for this tiny example.  
But, when the codebase grows, this style can make a big difference in the readability of our code.  

Arrow functions are also used extensively all throughout the engine's codebase.   
So, even if you don't prefer them, at least you need to know about how they work so that you are not confused the first time you find code using this style.  

:::important[first assignment]
Change the style of the BasicsTutorial code:  
. Remove any named functions that are assigned to an object  
. Use arrow functions directly as object fields  

There are not that many to change. We only had one named function! :)
:::

<TechnicalNote title="Solution">

```ts
// Define our system
export const HelloSystem = ECS.defineSystem({
  uuid: 'ee.tutorial.HelloSystem',
  //highlight-start
  execute: () => {
  //highlight-end
    for (const entity of helloQuery()) {
      let { initialized } = ECS.getMutableComponent(entity, HelloComponent)
      if (initialized.value) continue
      initialized.set(true)

      ECS.setComponent(entity, NameComponent, 'ee.tutorial.hello-entity')
      ECS.setComponent(entity, VisibleComponent)
      ECS.setComponent(entity, TransformComponent, { position: new Vector3(0, 1, 0) })
      ECS.setComponent(entity, PrimitiveGeometryComponent, { geometryType: GeometryTypeEnum.SphereGeometry })
    }
  //highlight-start
  },
  //highlight-end
  insert: { after: PhysicsSystem }
})
```
<UnstyledDetails title="Full Solution">

```ts title="ee-tutorial-basics/src/step1.ts" showLineNumbers
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
  jsonID: 'EE_tutorial_hello',
  onInit: () => { return { initialized: false } }
})

// Define the query that will find our Scene's Entity
const helloQuery = ECS.defineQuery([HelloComponent])

// Define our system
export const HelloSystem = ECS.defineSystem({
  uuid: 'ee.tutorial.HelloSystem',
  //highlight-start
  execute: () => {
    //highlight-end
    for (const entity of helloQuery()) {
      // Check if we have already initialized our Sphere
      let { initialized } = ECS.getMutableComponent(entity, HelloComponent)
      if (initialized.value) continue
      initialized.set(true)  // Set our initialized state to true

      ECS.setComponent(entity, NameComponent, 'ee.tutorial.hello-entity')
      ECS.setComponent(entity, VisibleComponent)
      ECS.setComponent(entity, TransformComponent, { position: new Vector3(0, 1, 0) })
      ECS.setComponent(entity, PrimitiveGeometryComponent, { geometryType: GeometryTypeEnum.SphereGeometry })
    }
  //highlight-start
  },
  //highlight-end
  insert: { after: PhysicsSystem }
})
```
</UnstyledDetails>
<!-- Full Solution End -->
</TechnicalNote>
<!-- Solution End -->


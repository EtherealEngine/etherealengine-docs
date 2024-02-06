---
sidebar_label: The Engine
---
import { TechnicalNote } from '@site/src/components/TechnicalNote';
import { UnstyledDetails } from '@site/src/components/UnstyledDetails';

# Programming with Ethereal Engine
We need to do two very important things in order to use Ethereal Engine for our project:
- We need to import Ethereal Engine's modules
- We need to export our code so the engine can load our project

## World Injection
The `worldInjection` function is run for all projects when they are first loaded.  
It allows projects to run custom logic that will be run across all scenes and routes on any instance of Ethereal Engine.  

```ts title="ee-tutorial-hello/src/Hello.ts"
export default async function worldInjection() {
  // ... our code ...
}
```
We don't need to know much more about this function for now. We will explore it further in the upcoming tutorials.  

<TechnicalNote>
All projects must contain a configuration file named `xrengine.config.ts`.  
One of its options is the `worldInjection` function, which will be called directly when the engine loads the project.  
There are [multiple other options](https://github.com/EtherealEngine/etherealengine/blob/dev/packages/projects/ProjectConfigInterface.ts#L29) that can be configured from that file, but the worldInjection function is the most relevant to this guide.  

This is how our `xrengine.config.ts` file looks like at the moment:
```ts title="ee-tutorial-hello/xrengine.config.ts" showLineNumbers
import type { ProjectConfigInterface } from '@etherealengine/projects/ProjectConfigInterface'

const config: ProjectConfigInterface = {
  onEvent: undefined,
  thumbnail: '/static/etherealengine_thumbnail.jpg',
  routes: {},
  services: undefined,
  databaseSeed: undefined,
  // highlight-start
  worldInjection: () => import('./src/Hello')
  // highlight-end
}

export default config
```
We will explore how this file works in more detail in the upcoming tutorials.

</TechnicalNote>

## Module Imports
In this minimal tutorial we are adding a sphere primitive to the scene.  
As this sphere will be a `Spatial` object, we will import a few components from the Spatial engine module:

```ts title="ee-tutorial-hello/src/Hello.ts"
import { NameComponent } from '@etherealengine/spatial/src/common/NameComponent'
import { VisibleComponent } from '@etherealengine/spatial/src/renderer/components/VisibleComponent'
import { TransformComponent } from '@etherealengine/spatial/src/transform/components/TransformComponent'
import { PrimitiveGeometryComponent } from '@etherealengine/engine/src/scene/components/PrimitiveGeometryComponent'
```
We will be adding these Components to our Entity, and Components are part of the ECS pattern.  
As such, we will need to use the Ethereal Engine ECS management functions.   
The engine provides a convenient way to import all ECS related functions at once through `ECS` [namespace](https://www.typescriptlang.org/docs/handbook/namespaces.html).
```ts title="ee-tutorial-hello/src/Hello.ts"
import { ECS } from '@etherealengine/ecs'
```

## Modifying our Source Code
We have learned how our minimal example works, but so far we haven't needed to modify any of its source code.  
This will be our first modification to the code of the project.  

:::important
This guide uses [`Project-based Learning`](https://en.wikipedia.org/wiki/Project-based_learning) as its core teaching philosophy.  
From now on, you will be actively modifying the source code of the `ee-tutorial-hello` in every step of the way.  
:::

Lets start with a simple change.  
We will modify our Sphere `PrimitiveGeometryComponent` to load our geometry with a name, instead of the hardcoded number `1` that we used before.  

In order to do this, we need to:
- Import the `GeometryTypeEnum` from the `scene/constants/` sub-module inside the `engine` module.
- Replace the `1` with a call to the `SphereGeometry` name that is stored inside it `GeometryTypeEnum`.  

Try to make the change by yourself before looking at the solution.  
I don't expect you to know where that enum is stored, so here are some hints to make it easier:  
```ts
// The full path to the GeometryTypeEnum is:
'@etherealengine/engine/src/scene/constants/GeometryTypeEnum'

// Getting the ID number of a Sphere by its enum name will look like:
GeometryTypeEnum.SphereGeometry

// To be certain that your changes are working, set the geometry to be a cylinder instead:
GeometryTypeEnum.CylinderGeometry
```

<TechnicalNote title="Solution">

The imports section of our code will now be:
```ts title="ee-tutorial-hello/src/Hello.ts"
// ... our other imports
import { PrimitiveGeometryComponent } from '@etherealengine/engine/src/scene/components/PrimitiveGeometryComponent'
import { Vector3 } from 'three'
// highlight-start
import { GeometryTypeEnum } from '@etherealengine/engine/src/scene/constants/GeometryTypeEnum'
// highlight-end
```
The `PrimitiveGeometryComponent` call will now be:
```ts title="ee-tutorial-hello/src/Hello.ts"
const entity = ECS.createEntity()
// ... our other calls to setComponent
// highlight-start
ECS.setComponent(entity, PrimitiveGeometryComponent, { geometryType: GeometryTypeEnum.SphereGeometry })
// highlight-end
```

<UnstyledDetails title="Full Solution">

```ts title="ee-tutorial-hello/src/Hello.ts" showLineNumbers
import { ECS } from '@etherealengine/ecs'
import { NameComponent } from '@etherealengine/spatial/src/common/NameComponent'
import { VisibleComponent } from '@etherealengine/spatial/src/renderer/components/VisibleComponent'
import { TransformComponent } from '@etherealengine/spatial/src/transform/components/TransformComponent'
import { PrimitiveGeometryComponent } from '@etherealengine/engine/src/scene/components/PrimitiveGeometryComponent'
// highlight-start
import { GeometryTypeEnum } from '@etherealengine/engine/src/scene/constants/GeometryTypeEnum'
// highlight-end

export default async function worldInjection() {
  const entity = ECS.createEntity()
  ECS.setComponent(entity, NameComponent, 'hello-world')
  ECS.setComponent(entity, VisibleComponent)
  ECS.setComponent(entity, TransformComponent, { position: new Vector3(0, 1, 0) })
  // highlight-start
  ECS.setComponent(entity, PrimitiveGeometryComponent, { geometryType: GeometryTypeEnum.SphereGeometry })
  // highlight-end
}
```
</UnstyledDetails>
<!-- Full Solution End -->
</TechnicalNote>
<!-- Solution End -->


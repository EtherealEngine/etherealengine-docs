---
sidebar_label: The Engine
---
import { TechnicalNote } from '@site/src/components/TechnicalNote';
import { UnstyledDetails } from '@site/src/components/UnstyledDetails';

# Working with Ethereal Engine
You will need three very important steps for creating a project with Ethereal Engine:
1. Installing Ethereal Engine
2. Installing (or creating) a project
3. Modify and run the source code of your project

We already solved #1 and #2 in the [Quickstart](../quickstart) guide.  
Lets explore how #2 works and how we can start programming with the engine.  

## Installing and running projects
Ethereal Engine can be **extended** with projects.
They are equivalent to the concept of "projects" in other engines, except they are modular like npm packages _(they are npm packages too)_.

The engine scans for projects mounted in the `/packages/projects/projects` sub-folder.  
This means that, like we did earlier in the [Quickstart](../quickstart) guide, we can install and run new projects by executing the following commands inside our Ethereal Engine installation folder:
```bash
git clone https://github.com/EtherealEngine/ee-tutorial-hello packages/projects/packages/ee-tutorial-hello
npm install
npm run dev
```
These steps will:
- Download a copy of the project's git repository, so the engine can load it  
- Install all `npm` packages required by the project  
- Run a local development version of the engine

:::note
This is also the process recommended for installation of your own projects.  
The difference will be that, instead of starting your project from the minimal HelloWorld example like we are doing now, you will start from a pre-made template.  
:::

:::important
Each project's source code is executed globally.  
This will become very important later on in this guide.  
:::


## Programming with Ethereal Engine
There are two very important steps to take in order to connect our project to the engine:
- We need to import Ethereal Engine's modules
- We need to export our code so the engine can load our project

### Project Configuration File
Every project has an `xrengine.config.ts` file that defines how it will behave in the engine.  
There are multiple options available, but the important thing to remember is that our `src/Hello.ts` code will connected to the engine from here.
<TechnicalNote title="Config File">
```ts title="ee-tutorial-hello/xrengine.config.ts"
import type { ProjectConfigInterface } from '@etherealengine/projects/ProjectConfigInterface'

const config: ProjectConfigInterface = {
  onEvent: undefined,
  thumbnail: '/static/etherealengine_thumbnail.jpg',
  routes: {},
  services: undefined,
  databaseSeed: undefined,
  // highlight-start
  worldInjection: () => import('./src/Hello')  // Import our Hello World code
  // highlight-end
}

export default config
```
</TechnicalNote>

We don't need to know much more about this file for now. We will explore it further in the `Beyond the Basics` guide.

### Module Imports
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
The engine provides a convenient way to import all ECS related functions at once through the `ECS` [namespace](https://www.typescriptlang.org/docs/handbook/namespaces.html).
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

const entity = ECS.createEntity()
ECS.setComponent(entity, NameComponent, 'hello-world')
ECS.setComponent(entity, VisibleComponent)
ECS.setComponent(entity, TransformComponent, { position: new Vector3(0, 1, 0) })
// highlight-start
ECS.setComponent(entity, PrimitiveGeometryComponent, { geometryType: GeometryTypeEnum.SphereGeometry })
// highlight-end
```
</UnstyledDetails>
<!-- Full Solution End -->
</TechnicalNote>
<!-- Solution End -->


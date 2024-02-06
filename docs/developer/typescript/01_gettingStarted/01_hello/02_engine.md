---
sidebar_label: The Engine
---
import { TechnicalNote } from '@site/src/components/TechnicalNote';

# Programming with Ethereal Engine
We need to do two very important things in order to use Ethereal Engine for our project:
- We need to import Ethereal Engine's modules
- We need to export our code so the engine can load our project

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


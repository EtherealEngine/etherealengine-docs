# Creating a project
This is the source code for 'basic' - a simple project in our repository - you can find the original source at https://github.com/EtherealEngine/ee-tutorial-basic . To install it see the previous section.

From a typescript programming perspective projects typically have these pieces:

1) worldInjection, which registers the project as a whole with Ethereal Engine

2) Systems, that drive behavior over time

3) Entities. We use an ECS system where entities are a way that we represent game state.

4) Components. Entities are decorated with components that produce behaviors on entities.

Here you can see we start a system and create a 'hello-world' entity and then give it a primitive geometry (a sphere) and then adjust the position of that sphere in the scene.

```
import { defineSystem } from '@etherealengine/engine/src/ecs/functions/SystemFunctions'
import { PhysicsSystem } from '@etherealengine/engine/src/physics/PhysicsModule'
import { getComponent, setComponent } from '@etherealengine/engine/src/ecs/functions/ComponentFunctions'
import { TransformComponent } from '@etherealengine/engine/src/transform/components/TransformComponent'
import { PrimitiveGeometryComponent } from '@etherealengine/engine/src/scene/components/PrimitiveGeometryComponent'
import { createSceneEntity } from '@etherealengine/engine/src/ecs/functions/createSceneEntity'

let initialized = false
const execute = () => {
  if(initialized) return
  initialized = true
  const entity = createSceneEntity('hello-world',null)
  setComponent(entity, PrimitiveGeometryComponent, { geometryType: 1 })
  getComponent(entity,TransformComponent).position.set(0,2,0)
}

export const HelloWorldSystem = defineSystem({
  uuid: 'hellworld.system',
  execute,
  insert: { after: PhysicsSystem }
})

export default async function worldInjection() {}
```

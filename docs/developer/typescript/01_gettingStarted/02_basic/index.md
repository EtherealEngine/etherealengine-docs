# Creating a project
In this section we will create a simple project called `basic`.
:::note
You can find the original source at https://github.com/EtherealEngine/ee-tutorial-basic.  
See the previous section for installation instructions.
:::

Ethereal Engine typescript projects usually have these pieces:
1. **Entities**: We use an ECS system where entities are a way that we represent game state.
2. **Components**: Entities are decorated with components that produce behaviors on entities.
3. **Systems**: Drive behavior over time
4. **WorldInjection**: Registers the project with Ethereal Engine

This simple example will:
- Start a system
- Create a `hello-world` entity
- Give the entity a primitive geometry component (a sphere)
- Adjust the position of that sphere in the scene.
```ts
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

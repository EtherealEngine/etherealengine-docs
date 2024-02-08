---
sidebar_label: Physics
---
# Adding Physics


<TechnicalNote title="Full Solution">

```ts
import { ECS } from '@etherealengine/ecs'
import { NameComponent } from '@etherealengine/spatial/src/common/NameComponent'
import { VisibleComponent } from '@etherealengine/spatial/src/renderer/components/VisibleComponent'
import { TransformComponent } from '@etherealengine/spatial/src/transform/components/TransformComponent'
import { PrimitiveGeometryComponent } from '@etherealengine/engine/src/scene/components/PrimitiveGeometryComponent'
import { Vector3 } from 'three'
import { GeometryTypeEnum } from '@etherealengine/engine/src/scene/constants/GeometryTypeEnum'
import { PhysicsSystem } from '@etherealengine/spatial/src/physics/PhysicsModule'

// highlight-start
import { RigidBodyComponent } from '@etherealengine/spatial/src/physics/components/RigidBodyComponent'
import { ColliderComponent } from '@etherealengine/spatial/src/physics/components/ColliderComponent'
// highlight-end


let initialized = false
const hello = () => {
  if (initialized) return
  initialized = true

  const entity = ECS.createEntity()
  ECS.setComponent(entity, NameComponent, 'hello-world')
  ECS.setComponent(entity, VisibleComponent)
  ECS.setComponent(entity, TransformComponent, { position: new Vector3(0, 1, 0) })
  ECS.setComponent(entity, PrimitiveGeometryComponent, { geometryType: GeometryTypeEnum.SphereGeometry })

  // highlight-start
  ECS.setComponent(entity, RigidBodyComponent, { type: 'dynamic' })
  ECS.setComponent(entity, ColliderComponent, { shape: 'sphere' })
  // highlight-end
}

export const HelloWorldSystem = ECS.defineSystem({
  uuid: 'helloworld.system',
  execute: hello,
  insert: { after: PhysicsSystem }
})

export default async function worldInjection() {}
```
</TechnicalNote>


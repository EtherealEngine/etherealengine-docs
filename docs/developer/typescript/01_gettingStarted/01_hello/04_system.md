import { TechnicalNote } from '@site/src/components/TechnicalNote';

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
The root of the problem is that we have created and modified our data inside the `worldInjection` function.  
Mutation of data should always occur in a [Controlled Context](/manual/modules/engine/ecs), and the `worldInjection` function is not such.

This is an even worse bad practices example, as it uses module scope to define and modify our entity.
```ts title="really/bad/practice.ts" showLineNumbers
import { ECS } from '@etherealengine/ecs'
import { NameComponent } from '@etherealengine/spatial/src/common/NameComponent'
import { VisibleComponent } from '@etherealengine/spatial/src/renderer/components/VisibleComponent'
import { TransformComponent } from '@etherealengine/spatial/src/transform/components/TransformComponent'
import { PrimitiveGeometryComponent } from '@etherealengine/engine/src/scene/components/PrimitiveGeometryComponent'

// highlight-start
// WARNING: Never do this
// Module scope should only ever be used for declarations.
const entity = ECS.createEntity()
ECS.setComponent(entity, NameComponent, 'hello-world')
ECS.setComponent(entity, VisibleComponent)
ECS.setComponent(entity, TransformComponent, { position: new Vector3(0, 1, 0) })
ECS.setComponent(entity, PrimitiveGeometryComponent, { geometryType: 1 })
// highlight-end

export default async function worldInjection() {}
```
</TechnicalNote>

## Our first System
and then add the system in step1 first thing

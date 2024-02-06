import { TechnicalNote } from '@site/src/components/TechnicalNote';

# The ECS Pattern
The [Entity Component System](https://en.wikipedia.org/wiki/Entity_component_system) is a pattern used to organize our code when writing software.  
In this pattern:
- Logic is represented as `System`s, and they define the behavior of the application.
- Data is represented as `Component`s that have no behavior or identifiers attached to them.
- Components are attached to Entities.
- An `Entity` is an identifier.  
  Each entity is essentially a "name" that groups components into a single "thing" (an object).

<TechnicalNote title="Technical Summary">
The ECS pattern represents [Objects](https://en.wikipedia.org/wiki/Object_(computer_science)) by attaching Components (data) to an Entity (identifiers) without behavior.  
The behavior of the application is then controlled by having separate Systems (logic) that process that data.  
Systems don't need to know where that data is coming from. They only know what data is stored in the Components that they can operate on.
</TechnicalNote>


## Creating an Entity
Creating an Entity is as simple as calling the `createEntity()` function from Ethereal Engine's `ECS`.  
This function will return a identifier that can be used to group Components into a unique and distinct Object.
```ts
const entity = ECS.createEntity()
```

## Adding Components
Components represent data that has no behavior or identification.  
The way to attach Components to Entities is by calling the `setComponent` function from Ethereal Engine's `ECS`.

<TechnicalNote>
The `setComponent` function will not return anything, but it will:
- Add the given Component to the Entity.
- Store the Component's data in the internal records of the ECS, so it can used by the engine or accessed through the API (eg: with `getComponent` and similar functions).
</TechnicalNote>

Ethereal Engine requires a specific set of Components in order to create an object that can be presented on the screen:
- **VisibleComponent**
- **TransformComponent**
- **PrimitiveGeometryComponent** or **MeshComponent**
- _(optional)_ **NameComponent**: Not required, but good practice.


### `NameComponent`
`NameComponent`s give a human-readable identifier to an Entity.  
They are not mandatory, but it is good practice to add them to all your entities.  
```ts
ECS.setComponent(entity, NameComponent, 'hello-world')
```
<TechnicalNote title="Clarification">
We said that an entity is just a "name" for a "thing", but we are also giving that "name" a `NameComponent`.  
Every Entity represents its "name" as an [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier), which does not need to be human-readable.  
And `NameComponent`s give a human-readable identifier to an Entity, no matter what its internal UUID name is.  
</TechnicalNote>


### `VisibleComponent`
Gives the Entity the ability to be visible on the screen.  
Entities without this Component will be ignored by the renderer.
```ts
ECS.setComponent(entity, VisibleComponent)
```

### `TransformComponent`
In simple terms, `TransformComponent`s give an Entity the ability to have a [position in the world](https://en.wikipedia.org/wiki/Transformation_matrix).  
There would be no way to position the Entity in 3D space without attaching this Component to the Entity.  
```ts
ECS.setComponent(entity, TransformComponent, { position: new Vector3(0, 1, 0) })
```
> In more technical terms, `TransformComponent`s give the Entity the ability to be affected by [linear transformations](https://en.wikipedia.org/wiki/Linear_transformation).  

### `PrimitiveGeometryComponent`
This Component gives Entities a primitive "visual body".  
Entities without it would not have any [3D geometry](https://en.wikipedia.org/wiki/Polygon_mesh), so the renderer would not be able to draw them on the screen.  
```ts
ECS.setComponent(entity, PrimitiveGeometryComponent, { geometryType: 1 })
```
> The `1` here means that we are creating a `SphereGeometry` object.  
> We will create the component using a more readable name in the following tutorials.


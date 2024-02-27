---
sidebar_label: Custom Component
---
import { TechnicalNote } from '@site/src/components/TechnicalNote';
import { UnstyledDetails } from '@site/src/components/UnstyledDetails';

# Defining a Custom Component
The `defineComponent` function accepts a `ComponentPartial` that has multiple fields available.  
```ts
// Define our component
const HelloComponent = ECS.defineComponent({
  name: 'ee.tutorial.HelloComponent',
  jsonID: 'EE_tutorial_hello',
  onInit: () => { return { initialized: false } }
})
```

:::note
See [Typescript.Partial](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype) for a reference of what Partials are.  
:::

Lets review what each of these fields do and how to use them.   
## `name`
`name` is a `string` that defines the human readable label for the component that we are creating.  
It will be displayed in the editor and debugging tools.  
```ts
name: 'ee.tutorial.HelloComponent',
```
As we saw before, the engine does not define strict naming requirements for this field, but it does define a [naming convention](./styling#id-naming-convention) that is good practice to follow in your projects.  

## `jsonID`
`jsonID` is an optional `string` that defines the internal ID used to reference this component in JSON data.  
```ts
jsonID: 'EE_tutorial_hello',
```
As we saw before, this field will be used by the engine to define the name of a [glTF](https://www.khronos.org/gltf) extension.   
Because of this, the `jsonID` field has very specific [naming requirements](./styling#jsonid-naming-requirements) that must be followed.  

## `onInit`
`onInit` is a function that will be called once when the Component is added to an entity _(ie: initialized)_.  
It returns the shape of the Component's runtime data, which has the type `Schema`.  
```ts
onInit?: (this: SoAComponentType<Schema>, entity: Entity) => ComponentType & OnInitValidateNotState<ComponentType>
// this    : `@internal` The component partial itself.
// entity  : The Entity to which this Component is being assigned.
// returns : The `Schema` (aka shape) of the component's runtime data.
```
A Component's Schema can contain any type of data that you want.   
In our example from before, we saw how to use this data to store our `initialized` state variable inside the component, instead of storing it in our module.  

## Other fields
The `ComponentPartial` type accepts multiple other fields that we haven't needed for our simple HelloComponent example. These fields are:  
`schema`, `toJSON`, `onSet`, `onRemove`, `reactor`, `errors`.  

We will explore them further in later sections of the tutorial.  

<TechnicalNote>
The data used to create a Component with `defineComponent` is declared by the `ComponentPartial` interface.
This type exists so that some of the properties of Components are optional when defining them, but required during normal use.  

This is the shape of the `ComponentPartial` interface, defined in the [`ComponentFunctions.ts`](https://github.com/EtherealEngine/etherealengine/blob/dev/packages/ecs/src/ComponentFunctions.ts) file:
```ts
{
  name: string
  jsonID?: string
  onInit?: (this: SoAComponentType<Schema>, entity: Entity) => ComponentType & OnInitValidateNotState<ComponentType>

  // A Component's Schema is the shape of its runtime data.
  schema?: Schema

  // Serializer function called when the component is saved to a snapshot or scene file.
  // Its logic must convert the component's runtime data into a JSON object.
  // entity    : The Entity to which this Component is assigned.
  // component : The Component's global data (aka State).
  toJSON?: (entity: Entity, component: State<ComponentType>) => JSON

  // Called when the component's data is updated via the setComponent function.
  // This is where deserialization logic should happen.
  // entity    : The Entity to which this Component is assigned.
  // component : The Component's global data (aka State).
  // json      : The JSON object that contains this component's serialized data.
  onSet?: (entity: Entity, component: State<ComponentType>, json?: SetJSON) => void

  // Called when the Component is removed from an Entity
  onRemove?: (entity: Entity, component: State<ComponentType>) => void | Promise<void>

  // Defines the React.FC (Function Component) async logic of the resulting Component type.
  // Any side-effects that depend on the component's data should be defined here.
  reactor?: React.FC

  errors?: ErrorTypes[]
}
```
</TechnicalNote>


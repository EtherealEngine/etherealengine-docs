---
sidebar_label: ECS
---
# Entities, Components and Systems

## What is an ECS?
ECS refers to the "**Entity Component System**" architecture paradigm, that is characterized by these three key elements:
- **Entities** are simply collections of components identified by a number.  
- **Components** are abstract objects that contain data.  
  They allow data to be structured with composition instead of inheritance.  
- **Systems** are functions that operate on these entities and components.  

## Component Definitions
Components support two types of data:
- Structure of Arrays
- Array of Structures

### Structure of Arrays: Component Data
Structure of Arrays is a data layout that stores data in a way that is more cache friendly.  
It is a good choice for data that is accessed often and in a predictable way, such as transform data.
```ts
const TransformComponent = defineComponent({
  name: 'TransformComponent',
  schema: {
    position: Types.f64,
    rotation: Types.f64,
    scale: Types.f64
  }
})
```

### Array of Structures: Reactive Component Data
Reactive Component Data is an implementation unique to Ethereal Engine, using `React` and `Hookstate` under the hood.  

Its key benefits are:
- It allows for reactive data binding.  
  When a property is changed, all effects depending on that data will be triggered.  
- It is a good choice for data that is accessed infrequently and in an unpredictable way.  
  _(especially when react style logic is associated with it)_.

```ts
const DebugArrowComponent = defineComponent({
  name: 'DebugArrowComponent',

  onInit: (entity) => {
    return {
      color: 0xffffff,
      direction: new Vector3(),
      position: new Vector3()
    }
  },

  onSet: (entity, component, json) => {
    if (!json) return

    if (json.color) component.color.set(json.color)
    if (json.direction) component.direction.set(json.direction)
    if (json.position) component.position.set(json.position)
  }
})
```

### onInit
`(entity: Entity) => ComponentType<C>`  
**onInit** is a function that is called when **setComponent** is called on an entity that does not have the component in question.  
It takes an entity number, and should return an object with the initial values for the component.


### onSet
`entity: Entity, component: ComponentType<C>, json: SerializedComponentType<C>) => void`  
**onSet** is a function that is called each time **setComponent** is called.  
It takes an `entity` number, a `component` object and a `json` object.  

This function provides a method for reactive data to be updated in batch _(such as deserializing scene data)_, which allows for a much tighter data flow.


### onRemove
`(entity: Entity, component: ComponentType<C>) => void`  
**onRemove** is a function that is called when **removeComponent** is called on an entity that has the component in question.  
It takes an `entity` number and a `component` object.  

This function is where any resources associated with the component should be cleaned.


### toJSON
`(entity: Entity, component: ComponentType<C>) => SerializedComponentType<C>`  
**toJSON** is a function that is called when **serializeComponent** is called on an entity that has the component in question.  
It takes an entity number and a component object.  

This function is where the component's data should be serialized _(eg: transforming a scene's data for saving to a file)_.

### jsonID
`string`  
The **jsonID** property is a string that is used to identify the component in json.  

It is used for identifying scenes when their data is serialized/deserialized.

### reactor
`function(props: { root: EntityRoot }) => void`  
The **reactor** property specifies a function that exists for the duration of this component instance.

This function is where any effects that depend on the component should be defined.


## Update Loop
Ethereal Engine uses a very similar model to [Unity's update loop](https://docs.unity3d.com/Manual/ExecutionOrder.html), by the use of a [fixed timestep](https://www.gafferongames.com/post/fix_your_timestep/) update loop.

The engine defines a `frame update` process that is called once per frame.  
Inside this frame-update process there is a `fixed update` process that operates with an `accumulator` pattern.  
This accumulator ensures that time will always step at a stable number of updates per second, independent of the processing power of the hardware running the engine.

_Note: Because the fixed update process is independent of frame updates, each individual frame update may execute 0-to-many fixed updates during its lifetime._

Ethereal Engine implements this feature through system **pipelines**, which are collections of systems that will be executed in a specific order.

## Queries
Queries are used to select entities that have a specific set of components.  
They are used to define the entities that a system will operate on.  

Queries are defined using the **defineQuery** function:
```ts
const query = defineQuery([TransformComponent, GroupComponent])

const entities = query() // returns an array of entity numbers
```

Queries also have enter and exit derivatives.  
They are used to define when a combination of components is added or removed from an entity.  
These variations are defined using the **defineEnterQuery** and **defineExitQuery** functions:
```ts
const query = defineQuery([TransformComponent, GroupComponent])

const allEntities = query()
const enterEntities = query.enter()
const exitEntities = query.exit()
```


## Examples

### Timer
In the following code snippets we will define a `component` and a `system`.  

The **TimerComponent** will hold a property to store the current elapsed time rounded down.  
In the **initializer** of the system, we will create a new entity and adds the time component to it.  
In the **execute** function of the system, we will set the property `time` on the component of the entity.

This example uses the _`Structure of Arrays`_ (SoA) Component Data syntax, from **bitECS**.
```ts
const TimerComponent = defineComponent({
  name: 'TimerComponent',
  schema: {
    time: Types.f32
  }
})

const timerQuery = defineQuery([TimerComponent])

const execute = () => {
  const { deltaSeconds } = getState(EngineState)

  for (const entity of timerQuery()) {
      TimerComponent.time[entity] += delta
  }
}

export const TimerSystem = defineSystem({
  uuid: 'TimerSystem',
  execute
})

```

This example uses the _`Array of Structures`_ Reactive Component Data syntax, from Ethereal Engine, which allows for reactive data binding.
```ts
const TimerComponent = defineComponent({
  name: 'TimerComponent',
  onInit: (entity) => {
    return {
      time: 0
    }
  },
  onSet: (entity, component, json) => {
    if (typeof json?.time === 'number') component.time.set(json.time)
  },
  toJSON: (entity, component) => {
    return {
      time: component.time.value
    }
  }
})

const timerQuery = defineQuery([TimerComponent])

const execute = () => {
  const { elapsedSeconds } = getState(EngineState)

  for (const entity of timerQuery()) {
    const timerComponent = getMutableComponent(entity, TimerComponent)
    timerComponent.time.set(Math.floor(elapsedSeconds))
  }
}

export const TimerSystem = defineSystem({
  uuid: 'TimerSystem',
  execute
})
```

## References
- [Entity Component System Overview in 7 Minutes](https://www.youtube.com/watch?v=2rW7ALyHaas)
- [Entity Component System in TypeScript with Phaser 3 and bitECS)](https://www.youtube.com/watch?v=BVIiAO5-2-Y)
- [Overwatch GDC ECS & Netcode](https://www.youtube.com/watch?v=W3aieHjyNvw) (note, ethereal engine does not use this style of networking)

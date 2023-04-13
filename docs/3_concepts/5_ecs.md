# Entities, Components and Systems

## What is an ECS?

ECS refers to the "Entity Component System" architecture paradigm. In this pattern, data is organised into abstract objects called **components** that allows for composition instead of inheritance. An **entity** is simply collection of components identified by a number. **Systems** are functions that operate on these entities and components.

## Component Definitions

Components support two types of data: Structure of Arrays and Array of Structures.

### Structure of Arrays Component Data

Structure of Arrays is a data layout that stores data in a way that is more cache friendly. It is a good choice for data that is accessed often and in a predictable way, such as transform data.

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

### Reactive Component Data

Array of Structures is an implementation unique to Ethereal Engine, using React and Hookstate under the hood, it allows for reactive data binding. This means that when a property is changed, all effects depending on it will be triggered. It is a good choice for data that is accessed infrequently and in an unpredictable way, especially when react style logic is associated with it.

```ts
export const DebugArrowComponent = defineComponent({
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

**onInit** is a function that is called when **setComponent** is called on an entity that does not have the component in question. It is passed the entity number and should return an object with the initial values for the component.

### onSet

`entity: Entity, component: ComponentType<C>, json: SerializedComponentType<C>) => void`

**onSet** is a function that is called each time **setComponent** is called. It is passed the entity number, the component object and json object. This is how reactive data can be updated in batch, allowing for tighter data flow, such as deserializing scene data.

### onRemove
`(entity: Entity, component: ComponentType<C>) => void`

**onRemove** is a function that is called when **removeComponent** is called on an entity that has the component in question. It is passed the entity number and the component object. This is where you would clean up any resources associated with the component.

### toJSON
  
`(entity: Entity, component: ComponentType<C>) => SerializedComponentType<C>`

**toJSON** is a function that is called when **serializeComponent** is called on an entity that has the component in question. It is passed the entity number and the component object. This is where serialized data can be generated, such as for saving a scene.

### reactor

`function(props: { root: EntityRoot }) => void`

**reactor** specifies a function that exists for the duration of this component instance. This is where you would add any effects that depend on the component.



## Update Loop

The engine uses a very similar model to Unity's update loop (found here https://docs.unity3d.com/Manual/ExecutionOrder.html). It has a frame update, called once per frame, of which inside is a fixed update, which operates on an accumulator system. This system ensures a stable number of updates per second independent of the framerate. This means it may have 0 to many updates in a given frame. 

Ethereal Engine implements this with **pipelines**, which are collections of systems to execute in order.

## Queries

Queries are used to select entities that have a set of components. They are used to define the entities that a system will operate on. Queries are defined using the **defineQuery** function.

```ts
const query = defineQuery([TransformComponent, GroupComponent])

const entities = query() // returns an array of entity numbers
```

Queries also have enter and exit derivatives, which are used to define when a combination of components is added or removed from an entity. These are defined using the **defineEnterQuery** and **defineExitQuery** functions.

```ts
const query = defineQuery([TransformComponent, GroupComponent])

const allEntities = query()
const enterEntities = query.enter()
const exitEntities = query.exit()
```


## Examples

### Timer

The follow code snipets, we define a component and a system. The component will hold a property to store the current elapsed time rounded down.

In the **initializer** of the system, it creates a new entity and adds the component to it. In the **execute** function of the system, we set the property `time` on the component of the entity.

This example uses 'Structure of Arrays' (SoA) data structures with bitECS syntax.

```ts
const TimerComponent = defineComponent({
  name: 'TimerComponent',
  schema: {
    time: Types.f32
  }
})

export default async function TimerSystem() {
  const myEntity = createEntity()
  setComponent(myEntity, TimerComponent)

  const timerQuery = defineQuery([TimerComponent])

  const execute = () => {
    const { delta } = Engine.instance

    for (const entity of timerQuery()) {
      TimerComponent.time[entity] += delta
    }
  }

  const cleanup = async () => {
    removeQuery(timerQuery)
  }

  return { execute, cleanup }
}

```

This example uses 'Array of Structures' syntax, with reactive data binding.

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

export default async function TimerSystem() {

  const myEntity = createEntity()
  setComponent(myEntity, TimerComponent)

  const timerQuery = defineQuery([TimerComponent])

  const execute = () => {
    const { elapsedSeconds } = Engine.instance

    for (const entity of timerQuery()) {
      const timerComponent = getMutableComponent(entity, TimerComponent)
      timerComponent.time.set(Math.floor(elapsedSeconds))
    }
  }

  const cleanup = async () => {
    removeQuery(timerQuery)
  }

  return { execute, cleanup }
}
```

## References
- [Entity Component System Overview in 7 Minutes](https://www.youtube.com/watch?v=2rW7ALyHaas)
- [Entity Component System in TypeScript with Phaser 3 and bitECS)](https://www.youtube.com/watch?v=qaY_CKvFLYM)
- [Overwatch GDC ECS & Netcode](https://www.youtube.com/watch?v=W3aieHjyNvw) (note, ethereal engine does not use this style of networking)
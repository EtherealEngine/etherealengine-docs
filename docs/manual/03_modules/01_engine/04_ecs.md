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

<!--
TODO: Explain the concept of "controlled context"

## Controlled Context
There are two types of controlled contexts: Synchronous and Asynchronous  
Execute runs every frame (or fixed frame)  
Reactors run as per the react scheduler, asynchronously  
Reactors come in 3 types:
- UI _(aka "normal" react)_
- Component reactors
- System reactors  
  _(and custom reactors, which are functionally equivalent to system reactors)_  
-->

## Component Data Types
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
Reactive Component Data is an implementation unique to iR Engine, using `React` and `Hookstate` under the hood.  

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

This example uses the _`Array of Structures`_ Reactive Component Data syntax, from iR Engine, which allows for reactive data binding.
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
- [Overwatch GDC ECS & Netcode](https://www.youtube.com/watch?v=W3aieHjyNvw) (note, iR Engine does not use this style of networking)

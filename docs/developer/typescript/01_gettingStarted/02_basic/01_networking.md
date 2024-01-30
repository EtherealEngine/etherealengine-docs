# Adding networking
We're going to add networking to the `basic` example from the previous section.  
Our goal is to deliver a shared and collaborative experience to many players at once.

## Actions
First we want to think through what kinds of actions we want in our game.  
For this tutorial we will allow the creation and destruction of simple objects over the network.

In our case we can cheat a bit since destroying objects is common enough that there is a built in world networking event for it, and also for creating objects we can extend the built in world spawning event.  

This means that we need to define an action for creation:
```ts
const spawnAction = defineAction({
  ...WorldNetworkAction.spawnObject.actionShape,
  prefab: 'ee.basic.ball',
  $topic: NetworkTopics.world
})
```

## State
Ethereal Engine uses an 'event sourced state' paradigm for networking. That means that as a developer you publish an event and that event is performed by all instances simultaneously.

Typically actions are going to affect state. For this example we will declare that we're going to allow any number of objects, each with their own appearance. We define state in a React like way like so:

```ts
export const BasicState = defineState({
  name: 'ee.basic.BasicState',
  initial: {} as Record< EntityUUID, {} >,
  ...
```

### Receptors
Finally for this phase we want to define handlers or receptors to handle the event.   
These are by convention stored on the state itself:
```ts
  ...
  receptors: [
    [
      spawnAction,
      (state, action: typeof spawnAction.matches._TYPE) => {
        state[action.entityUUID].merge({})
      }
    ],
    [
      WorldNetworkAction.destroyObject,
      (state, action: typeof WorldNetworkAction.destroyObject.matches._TYPE) => {
        state[action.entityUUID].set(none)
      }
    ]
  ]
```

### Dispatching new events
We can spawn entities now like so at any time:

```ts
dispatchAction(spawnAction({ entityUUID:'my-entity' }))
```

### Rendering State

Once state is being networked we want to visualize that state. The react pattern is to allow state changes to occur and then 'react' to them - creating visual objects that reflect the state database:

```ts
const ArtifactReactor = ({ entityUUID }: { entityUUID: EntityUUID }) => {
  const basicState = useHookstate(getMutableState(BasicState)[entityUUID])
  useEffect(() => {
    const entity = UUIDComponent.getEntityByUUID(entityUUID)
    setComponent(entity, TransformComponent)
    setComponent(entity, VisibleComponent)
    setComponent(entity, NameComponent,'hello')
    setComponent(entity, PrimitiveGeometryComponent, { geometryType: 1 })
```

## Closing
Although this example is simple, these are the basic foundations for richer experiences.  
The source code for this example from https://github.com/etherealengine/ee-basic-tutorial

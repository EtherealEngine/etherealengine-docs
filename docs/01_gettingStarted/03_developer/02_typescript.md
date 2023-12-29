---
sidebar_label: Typescript
---
# Getting Started with Typescript
<!--
NOTE: This page should contain:
- Hero Project: Showcase for Ethereal Engine's development tools and workflows.
- Guide: Teaches a new user how to program the Hero Project and be comfortable with EE project development.
- Segue: Lead the user into the Developer Manual
-->

:::important
This guide teaches some of the Ethereal Engine recommended best practices for developers.  
As such, the level of knowledge required will be higher than if it was just an introductory guide.

_Visit the [Developer Manual](/docs/manual/developer/intro) page for in-depth information about programming with Ethereal Engine._  
:::

This guide will teach you how to create **Pong**, a multiplayer game built with Ethereal Engine using Typescript.  

## Installation and Running the project
### 1. Install Pong
<!-- TODO: This should be an MDX partial that sends the user to the developer quick-start guide for running projects with a local environment. -->
Ethereal Engine scans for projects in its `/packages/projects/projects` sub-folder.  
We can install Ethereal Engine from scratch and also register a sub project using the following commands:
```bash
git clone https://github.com/EtherealEngine/etherealengine
cd etherealengine
cd packages/projects/projects
git clone https://github.com/EtherealEngine/ee-tutorial-pong
cd ../../../
```

### 2. Run the engine
A fresh install of Ethereal Engine can be run with:
```bash
npm install
npm run dev
```

### 3. Configure the Location
Go to the Admin Panel page, create a `Location` for the project and change the project's name to `pong`.
:::note[Admin Panel]
https://localhost:3000/admin
:::

:::important
Ethereal Engine must be running for this step and the rest of this guide to work.
:::

### 4. Run Pong
Run the project on the web by visiting it with the URL you just created.
:::note[Pong]
https://localhost:3000/location/pong
:::

## Understanding Pong

### High Level Overview
A Pong world can have several separate pong tables at once.  
Each pong table has four pong plates and can handle four players at once.

Pong has several files which represent different parts of the experience:
- **PaddleSystem**: A paddle 'system' for managing the player paddles.
- **PlateComponent**: Each pong game has one or more plates that represent player positions in a game. This example creates 4 player games.
- **PongComponent**: Each pong game in has the concept of a game starting or stopping; this is managed here.
- **PongGameSystem**: A game system for managing each game instance; starting and stopping play and dealing with players.
- **PongPhysicsSystem**: A ball spawner and scoring 'system' for the pong game overall
- **worldinjection**: Connects the project's code with the engine's code.

### World Injection
Ethereal Engine projects have a `worldinjection.ts` file to connect the project code to with the engine so it can be run _(aka bootstrapping / injection)_.  
For Pong this file registers and starts three systems, and does little else:
```ts
import './PaddleSystem'
import './PongGameSystem'
import './PongPhysicsSystem'
export default async function worldInjection() {}
```

### Entities, Components and Systems
Ethereal Engine uses an ECS (Entity Component System).  
**Entities** in a game are entirely defined by their **Components** or 'capabilities'.  
**Systems** drive the state of the entire application over time by running every frame over those components.   

A great benefit of the ECS pattern is that it allows a highly granular 'vocabulary' for designers to express game ideas with.

:::info
Ethereal Engine currently uses [bitECS](https://github.com/NateTheGreatt/bitECS) for its ECS implementation.  
Another great ECS library to look into is [Flecs](https://news.ycombinator.com/item?id=35434374).  
:::

Pong imports three systems via worldInjection. Each one is responsible for a different part of the Pong experience:
1. PaddleSystem
2. PongPhysicsSystem
3. PongGameSystem

We will look at `PaddleSystem.ts` first.

### PaddleSystem: Introduction to State and Reactivity
In Pong each active player has two paddles (one for the left hand and one for the right hand), and paddles are spawned or destroyed as players come and go.  

We will use Ethereal Engine's best practices and separate our concerns.  
What this means for us, at this level of abstraction, is that we don't yet need to think about how the paddles are manifested.

We will separate the 'what' from the 'how' of the paddles:
- **what**: There are some set of paddles. _(Entities)_  
- **how**:  The paddles happen to be 3D objects with collision hulls. _(Components)_  
  > We will get into the details of how this works later.

:::info
Ethereal Engine uses the React pattern of allowing state observers to 'react' to state changes.  
You can read more in depth about this in the [ECS section](/docs/manual/developer/ecs) of the manual.
:::


In `PaddleSystem.ts` we can see a good example of the reactive state pattern that Ethereal Engine follows.  
The basic idea here is to track the list of active paddles:
```ts
export const PaddleState = defineState({
  name: 'ee.pong.PaddleState',
  initial: {} as Record<
    EntityUUID,
    {
      owner: UserID
      handedness: 'left' | 'right'
      gameEntityUUID: EntityUUID
    }
  >
  ...
```

:::info
The `defineState()` method registers a collection of Record objects.  
A `Record` is a schema in a third party runtime schema definition language that Ethereal Engine uses.
:::

### PaddleSystem: Introduction to Event Sourced State
Ethereal Engine uses an event sourced state paradigm.  

:::info
A good discussion about Event Sourcing can be found here:  
https://domaincentric.net/blog/event-sourcing-snapshotting
:::
Sourcing state and responding to that state is asynchronous.  
But, rather than having to propagate potentially thousands of successive state changes, a single 'effect' or outcome will result from this process.

In an Event Sourced system, the current state of an aggregate is usually reconstituted from the full history of events.  
This means that, before handling a command, we need to do a full read of a single fine-grained stream and transport the events over the network.  

This design allows late joiners of the game to synchronize with the overall game state.

We define a set of actions explicitly in `PaddleSystem.ts`:
```ts
export class PaddleActions {
  static spawnPaddle = defineAction({
    ...WorldNetworkAction.spawnObject.actionShape,
    prefab: 'ee.pong.paddle',
    gameEntityUUID: matchesEntityUUID,
    handedness: matches.literals('left', 'right'),
    owner: matchesUserId,
    $topic: NetworkTopics.world
  })
}
```

We then allow the registration of 'receptors' on state objects to catch dispatched events over the network.  
In this case, we're entirely focused on updating the state records defined above:
```ts
  ...
  receptors: [
    [
      PaddleActions.spawnPaddle,
      (state, action: typeof PaddleActions.spawnPaddle.matches._TYPE) => {
        state[action.entityUUID].merge({
          owner: action.owner,
          handedness: action.handedness,
          gameEntityUUID: action.gameEntityUUID
        })
      }
    ],
    [
      WorldNetworkAction.destroyObject,
      (state, action: typeof WorldNetworkAction.destroyObject.matches._TYPE) => {
        state[action.entityUUID].set(none)
      }
    ]
  ]
})
```
`WorldNetworkAction.destroyObject` is an observer that we have injected to make sure that we update our state tables appropriately.  

Although we have custom state on the object creation, we don't have any custom state on paddle destruction.


### PaddleState: Introduction to Components
With the state management out of the way, we are now left with the details of making sure that our visual representations reflect our state.

`PaddleReactor.ts` defines a React component that has a `useEffect()` to observe state changes on a given `PaddleState` entry. The reactor sets up an entity to reflect that owner when PaddleState changes.  

Inside `useEffect()` we see several typical 3D and game related components being setup:
- UUIDComponent
- TransformComponent
- VisibleComponent
- DistanceFromCameraComponent
- FrustrumCullComponent
- NameComponent
- PrimitiveGeometryComponent
- ColliderComponent
- GrabbableComponent

These components reflect the core set of components that you will find in many Ethereal Engine 3D entities used to represent objects in a game.

:::important
The `GrabbableComponent` is notable because it is a good example of components being more than just 'state'.  
They can also be used to form an expressive 'vocabulary' of the high level intentions of the developer.  

In this case, we want the paddle to stay attached to the owner's avatar at a specified attachment point.  
If we didn't have this concept we would have to fire rigid body physics target position events every frame to keep the paddle synchronized with the player.
:::

### PaddleState: Introduction to Reactors
Both PaddleReactor and Reactor in `PaddleSystem.ts` demonstrate reactivity to state:  
- The reactor is updated whenever state changes
- Game entities that exist are a reflection of that larger state.


### PaddleState: System
Tying everything together in `PaddleSystem.ts` is the PaddleSystem itself.  
It registers and runs an execute() handler every frame and it also registers the reactor:
```ts
export const PaddleSystem = defineSystem({
  uuid: 'pong.paddle-system',
  execute,
  reactor,
  insert: { after: PhysicsSystem }
})
```

### PaddleState: Overall Flow
The general flow of PaddleState is:
1. The execute handler catches and handles PaddleActions using `receiveActions(PaddleState)`
2. PaddleActions respond to network events and applies them to the PaddleState.
3. The reactor executes its process based on changes to PaddleState.


## PlateComponent

### PongComponent, PongGameSystem and PongPhysicsSystem

### Summary


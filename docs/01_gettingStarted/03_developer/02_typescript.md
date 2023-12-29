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

This guide will teach you how to get started programming with Ethereal Engine.  

You will learn how to create **Pong**, a multiplayer game built with Ethereal Engine using Typescript.  

> _This is an introductory guide._  
> _Visit the [Developer Manual](/docs/manual/developer/intro) page for more information about programming with Ethereal Engine._  

## Installation and Running the project
### 1. Install Pong
<!-- TODO: This should be an MDX partial that contains its own section, instead of just a quick sidenote. -->
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
Go to the Admin Panel, create a `Location` for the project and map the project to the name `pong`.
:::info[link]
https://localhost:3000/admin .
:::

:::important
Ethereal Engine must be running for this step and the rest of this guide.
:::

4) Run the project on the web by visiting it with the URL you created. See https://localhost:3000/location/pong

## Understanding Pong

### Quick Overview
A Pong world can have several separate pong tables at once.  
Each pong table has four pong plates and can handle four players at once.

Pong has several files which represent parts of the experience:
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

:::info[advanced]
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

:::info[advanced]
The `defineState()` method registers a collection of Record objects.  
A `Record` is a schema in a third party runtime schema definition language that Ethereal Engine uses.
:::

### PaddleSystem: Introduction to Event Sourced State
Ethereal Engine uses an event sourced state paradigm.  
Sourcing state and responding to that state is asynchronous but a single 'effect' or outcome results, rather than having to propagate potentially thousands of successive state changes.

:::info
A good discussion about Event Sourcing can be found here:  
https://domaincentric.net/blog/event-sourcing-snapshotting
:::

In an Event Sourced system, the current state of an aggregate is usually reconstituted from the full history of events. It means that before handling a command we need to do a full read of a single fine-grained stream and transport the events over the network. This allows late joiners to synchronize with the overall game state.

In `PaddleSystem.ts` we define a set of actions explicitly like so:
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

And we then allow the registration of 'receptors' on state objects to catch dispatched events over the network, and in this case we're entirely focused on updating the state records above:

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

The WorldNetworkAction.destroyObject is an observer we've injected here to catch here to make sure that we update our state tables appropriately. Although we have custom state on the object creation, we don't have any custom state on paddle destruction.

### PaddleState: Introduction to Components

With the state management out of the way, now we're left with the details of making sure our visual representations reflect our state.

PaddleReactor defines a React component that has a useEffect() to observe state changes on a given PaddleState entry. When the PaddleState changes it sets up an entity to reflect that owner. Inside the useEffect() we see several typical 3d and game related components being setup:

- UUIDComponent
- TransformComponent
- VisibleComponent
- DistanceFromCameraComponent
- FrustrumCullComponent
- NameComponent
- PrimitiveGeometryComponent
- ColliderComponent
- GrabbableComponent

Most of these components are self descriptive, and this typically reflects the core set of components you'll see in many Ethereal Engine 3d entities that represent objects in a game.

The GrabbableComponent is notable in that it's a good example of where components are more than just 'state'; they can be used to form an expressive 'vocabulary' of high level intentions. In this case we want the paddle to stay attached to the owner avatar at a specified attachment point. If we didn't have this concept we would have to fire rigid body physics target position events every frame to keep the paddle synchronized with the player.

### PaddleState: Introduction to Reactors

Both PaddleReactor and Reactor in PaddleSystem demonstrate reactivity to state. The reactor is updated whenever state changes, and the game entities that exist are a reflection of that larger state.

### PaddleState: System

Tying everything together in PaddleSystem is the PaddleSystem itself. It registers and runs an execute() handler every frame and it also registers the reactor:

```
export const PaddleSystem = defineSystem({
  uuid: 'pong.paddle-system',
  execute,
  reactor,
  insert: { after: PhysicsSystem }
})
```

### PaddleState: Overall Flow

The general flow is like so:

1) The execute handler catches and handles PaddleActions using ```receiveActions(PaddleState)```

2) The PaddleActions respond to network events and applies them to the PaddleState.

3) The reactor reacts to any state changes on PaddleState.

## PlateComponent


### PongComponent, PongGameSystem and PongPhysicsSystem


### Summary


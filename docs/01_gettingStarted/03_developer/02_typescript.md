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

## Overview

'Pong' is a simple multiplayer game in Ethereal Engine built using Typescript. It is an example of best practices for developers.

## Installation and Running

1) Ethereal Engine scans for projects mounted in the /packages/projects/projects sub-folder of Ethereal Engine. From scratch we can install Ethereal Engine itself and also register a sub project using the following:

```
gh repo clone EtherealEngine/EtherealEngine
cd EtherealEngine
cd packages/projects/projects
gh repo clone EtherealEngine/ee-tutorial-pong
cd ../../../
```

2) A fresh install of Ethereal Engine can be run like so:

```
npm install
npm run dev
```

3) Once Ethereal Engine itself is running, from the web admin panel of Ethereal Engine create a 'location' for the project. See https://localhost:3000/admin . Map the project to the name 'pong'.

4) Run the project on the web by visiting it with the URL you created. See https://localhost:3000/location/pong

## Understanding Pong

### A 10000 foot overview

Pong has several files which are roughly represent parts of the experience:

- PaddleSystem -> a paddle 'system' for managing the player paddles specifically.
- PlateComponent -> each pong game has one or more plates that represent player positions in a game. In our case we have 4 player games.
- PongComponent -> each pong game in a larger pong world has a concept of a game starting or stopping; this is managed here.
- PongGameSystem -> a game 'system' for managing each game instance; starting and stopping play and dealing with players.
- PongPhysicsSystem -> a ball spawner and scoring 'system' for the pong game overall
- worldinjection -> bootstraps the game

A 'Pong' world can have several separate pong tables at once. Each pong table has four pong plates and can handle four players at once.

### World Injection

Ethereal Engine projects typically have a worldinjection.ts file to bootstrap a project. In Pong this file registers and starts three 'systems', and does little else:

```
import './PaddleSystem'
import './PongGameSystem'
import './PongPhysicsSystem'
export default async function worldInjection() {}
```

### Entities, Components and Systems

Ethereal Engine uses an ECS (Entity Component System). Entities in a game are entirely defined by their Components or 'capabilities', and systems driven the state of the entire application over time by running every frame over those components. One benefit of an ECS is that it allows a highly granular 'vocabulary' for designers to express game ideas with.

The ECS we use currently BitECS. Another good ECS is Flecs:

- https://github.com/NateTheGreatt/bitECS
- https://news.ycombinator.com/item?id=35434374

In Pong there are three systems imported via worldInjection above. Each is responsible for a different part of the experience:

1) PaddleSystem
2) PongPhysicsSystem
3) PongGameSystem

We will look at the PaddleSystem.ts first.

### PaddleSystem: Introduction to State and Reactivity

Ethereal Engine uses the React pattern of allowing state observers to 'react' to state changes. This is done for a couple of different reasons. Philosophically it separates the 'what' from the 'how', and technically it helps decouple game components from each other, allowing developers to scale work horizontally, reducing dependencies.

The React website has several good discussions on reactivity as a whole:

- https://react.dev/learn/reacting-to-input-with-state

In Pong each active player has two paddles (one for the left hand and one for the right hand), and paddles are spawned or destroyed as players come and go. In this case the 'what' is that there are some set of paddles. And the 'how' (which we will get to later) is that the paddles happen to be 3d objects with collision hulls. But at this level of scope we can separate our concerns and we don't have to think about how the paddles are manifested.

In PaddleSystem.ts we see a good example of this reactive state pattern. The approach we've taken here is to track the enumeration of active paddles like so:

```
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

The defineState() method registers a collection of Record<> objects. A Record is a schema in a third party runtime schema definition language that Ethereal Engine uses. In this case the Record declares that this state object is a hashed collection of EntityUUID to { owner, handedness, gamEntityUUID } objects.

### PaddleSystem: Introduction to Event Sourced State

Ethereal Engine uses an event sourced state paradigm. Sourcing state and responding to that state is asynchronous but a single 'effect' or outcome results, rather than having to propagate potentially thousands of successive state changes.

A good discussion of Event Sourcing can be found here:

https://domaincentric.net/blog/event-sourcing-snapshotting

In an Event Sourced system, the current state of an aggregate is usually reconstituted from the full history of events. It means that before handling a command we need to do a full read of a single fine-grained stream and transport the events over the network. This allows late joiners to synchronize with the overall game state.

In PaddleSystem we define a set of actions explicitly like so:

```
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

```
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

[tbd]

### PongComponent, PongGameSystem and PongPhysicsSystem

[tbd]

### Segue

[tbd]

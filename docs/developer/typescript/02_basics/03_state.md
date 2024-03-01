---
sidebar_label: State
---

import { TechnicalNote } from '@site/src/components/TechnicalNote';

# State Management
We have been talking about the concept of `State`, but we have never really explained what it is or how to use it correctly. Lets fix that now.  

## What is State
In Computer Science, [State](https://en.wikipedia.org/wiki/State_(computer_science)) is the concept of remembering information (data) about something that happened earlier in time.  

Lets say we want to:
1. Increment a number every second
2. Keep incrementing the number until the application stops

To achieve this, we would need to store the current value of our number inside a variable, and that variable would contain our `State`.  

In this example, our State variable would represent the seconds elapsed.  
So, we could name it `clock` or `clockSeconds` to make it easier to understand the purpose of the data contained in the variable.

That is exactly what we did with our `initialized` variable from before.  
We needed to run our code only once _(aka when our code is first loaded)_ so we created an `if (initialized)` check that exited our code early when the value was `true`.  
Then, by updating the information contained in our variable to `true` inside our block of code, we essentially created a `State Variable` that remembered that our code was already initialized so the code would never repeat again.

### Global State
### Local State

## React State
Global State in React is any State that is shared across Components.  
Its main purpose is to avoid prop drilling when a piece of State is supposed to be accessed by a child component several levels down the component tree.  
Its purpose is being able to share updatable variables between multiple Components, without having to pass their data from component to component (aka "prop-drilling")

## Managing State
There are multiple ways to keep track of state
- Manually maintaining the value of a variable
- A state variable with `Hyperflux`
- A reactor mount with `useEffect`

## Local Variable
You might remember the `initialized` variable we created in an earlier section of the [Hello World](../gettingStarted/hello/system) tutorial.  
That variable was what is called "Local State".  

As you saw, we are fully responsible of book-keeping the values contained in the variables we create in this way.  
There are also strict limitations on what these values can be used for.  
<!-- TODO: Describe what the limitations of module scope variables are -->

## Hyperflux

### Hookstate
Hookstate is a tool created to simplify state management in React applications.


### Ethereal Engine's Hyperflux
Ethereal Engine provides a group of functions to manage state asynchronously.  
## `useEffect`
We want to do some sort of side-effect whenever something happens.  
1. Everything contained is run everytime our application is rendered (aka every update)
2. Everything contained is run when the component is first "Mounted" (explain mount)
3. List of values that, whenever they change, the code contained in the `useEffect` function is going to run
Explain what a reactor mount is

<TechnicalNote title="Full Solution">
</TechnicalNote>

```ts
/**
 * Global state that tracks locally spawned or destroyed artifacts by using action receptors
 */

const BasicState = defineState({
  name: 'ee.basic.BasicState',

  initial: {} as Record<EntityUUID, {}>,

  receptors: {
    onSpawnAction: BasicActions.spawnAction.receive((action) => {
      const state = getMutableState(BasicState)
      state[action.entityUUID].merge({})
    }),
    onDestroyObject: WorldNetworkAction.destroyObject.receive((action) => {
      const state = getMutableState(BasicState)
      state[action.entityUUID].set(none)
    })
  }
})

```

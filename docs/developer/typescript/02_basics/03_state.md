---
sidebar_label: State
---

<!--
TODO:
This page should be introductory, but it has expanded too much.
Most of these explanations/concepts should be moved to the /developer/typescript/state section.
-->

import { TechnicalNote } from '@site/src/components/TechnicalNote';

# State Management
We have been talking about the concept of `State`, but we never really explained what it is or how to use it correctly. Lets fix that now.  

## What is State
In Computer Science, [State](https://en.wikipedia.org/wiki/State_(computer_science)) is the concept of remembering information (data) about something that happened earlier in time.  

Lets say we want to:
1. Increment a number every second
2. Keep incrementing the number until the application stops

We could store the current value of our number inside a variable, and that variable would contain our `State`:  
```ts
// Simple example of a variable used to track our clock's current state
let seconds = ...
```

In this example, our State variable would represent the seconds elapsed.  
We could name it `clock` or `clockSeconds` to make it easier to understand the purpose of the data contained in the variable.

That is exactly what we did with our `initialized` variable from before.  
We needed to run our code only once _(aka when our code is first loaded)_ so we created an `if (initialized)` check that exited our code early when the value was `true`.  
Then, by updating the information contained in our variable to `true`, we created a `State Variable` that remembered whether our code was already initialized or not.  

### Local State
In Computer Science, [Scope](https://en.wikipedia.org/wiki/Scope_(computer_science)) is used to represent the part of the program where a name is valid.  

`Module Scope` is one of the many types of `Local Scope` that can exist.  
When a name has Module Scope it means that the variable/function/etc it represents will only be accessible by code in:
- The file where it is declared
- A file where the name is imported _(only if the name was defined with `export`)_.  

Our `initialized` variable started as a Module Scope variable in the earlier sections of the [Hello World](../gettingStarted/hello/system) tutorial. We declared it at the top-level of our file, so it was `Local State` _(ie: Local to the Module)_.  
```ts
let initialized = false
function hello() {
  if (initialized) return
  // ... etc
}
```

But, later on, we changed our code and moved the variable into our custom scene Component:  
```ts
export const HelloComponent = defineComponent({
  ...
  onInit: () => return { initialized: false }
})
```
With this change, we made our variable accessible anywhere where our Component is accessible.  
This still doesn't make our state `Global`, but it changed the scope from "Local to the Module" to "Local to the Component".  
<!-- TODO: Does this make the variable Global? Is this definition correct? -->

### Global State
So far we have only dealt with Local State

## React State
Global State in React is any State that can be shared between Components.  
Its purpose is being able to share updatable variables between multiple components. (eg: Accessing a variable from a child component several levels down the component tree) without having to pass their data from component to component _(called "prop-drilling")_.  

React provides the [`Context`](https://react.dev/learn/passing-data-deeply-with-context) API for this exact purpose.  
But, as we will explore in a moment, `Hookstate` and iR Engine's `Hyperflux` are much better ways to manage the state of our project.  

## Managing State in iR Engine
There are multiple ways to keep track of state in iR Engine:
- Manually maintaining the value of a variable
- A state variable with `Hyperflux`
- A reactor mount with `useEffect`

### Local Variable
As you saw, we are fully responsible of book-keeping the values contained in the variables we create this way.  
There are also strict limitations on what these values can be used for.  
<!-- TODO: Describe what the limitations of module scope variables are -->

### iR Engine's Hyperflux

#### Hookstate
Hookstate is a tool created to simplify state management in React applications.
We can access a vanilla hookstate State definition with the `useState` Hook from Hookstate.
Same as any other React Hook, we can only call the `useState` hook inside React Components.

The variable returned from `useState` will have:
1. `get()` method: Allows us to read the data contained in the variable
2. `set()` method: Allows us to modify the data of the variable
3. `merge()` method: Allows us to combine the current data with new data in an ergonomic way

#### Hyperflux
iR Engine provides a group of functions to manage state asynchronously.  

### `useEffect`
We want to do some sort of side-effect whenever something happens.  
1. Everything contained is run every time our application is rendered (aka every update)
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

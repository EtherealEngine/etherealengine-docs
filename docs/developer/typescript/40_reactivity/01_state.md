---
draft: true
---

# State Management
All of Ethereal Engine's state management uses [Hookstate](https://hookstate.js.org/) and [React](https://react.dev/).  
Together, these tools give reactive, declarative, and controlled state management across any scope.

## Scoped State
Scoped state can be defined using the `useHookstate` hook.  
This functionality uses vanilla `Hookstate`, and is useful for:
- State that is only used in a single component
- State that is only used in a single component tree

```tsx
import { useHookstate } from '@hookstate/core'

const MyComponent = () => {
  const state = useHookstate({
    count: 0
  })
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => state.count.set(state.count.get() + 1)}>Increment</button>
    </div>
  )
}
```

## Global State
Global state definitions are wrapped in a 'store' which allows for automatic creation and cleanup as needed.  
This API, as well as the underlying hookstate API, can be imported from `@etherealengine/hyperflux`.

```ts title="MyState.ts"
import { defineState } from '@etherealengine/hyperflux'

const MyState = defineState({
  name: 'MyState',
  initial: {
    count: 0
  }
})
```

Global state will be registered to the engine instance once it has been called with `getState` or `getMutableState`.  
This will cause the state to be created if it does not exist, and will be cleaned up when the engine instance is destroyed.

It's proxy can be accessed with `Engine.instance.store.stateMap.MyState` where `MyState` is the name of the state.

When accessing the state, `getState` returns the underlying object typed as readonly.  
This is useful for reading state values, but should not be used to write to state.

```ts
import { getState } from '@etherealengine/hyperflux'
import { MyState } from './MyState'

const state = getState(MyState)
console.log(state.count) // 0
state.count = 1 // Error: Cannot assign to 'count' because it is a read-only property.
```

State can be mutated via the `getMutableState` function, which returns a proxy to the state, which can be used to read and write state values.
The proxy is reactive, so any changes to the state will cause the component to re-render.

The proxy returned can be wrapped in Hookstate's reactive hook `useHookstate`.  
This will cause the component to re-render when any state values are changed.

```tsx
import { getMutableState, useHookstate } from '@etherealengine/hyperflux'
import { MyState } from './MyState'

const MyComponent = () => {
  const state = useHookstate(getMutableState(MyState))
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => state.count.set(state.count.get() + 1)}>Increment</button>
    </div>
  )
}
```


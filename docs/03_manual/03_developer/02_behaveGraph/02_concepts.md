<!-- TODO: De-duplicate the sections -->
# 3. Code Overview:

## Node Types

- Events You can implement arbitrary events that start execution: Start, Tick
- Actions You can implement actions that trigger animations, scene scene variations, or update internal state: Log, Play Gltf animation, Play Audio, Play Video, etc
- Logic You can do arithmetic, trigonometry as well as vector operations and string manipulation: Add, Subtract, Multiply, Divide, Pow, Exp, Log, Log2, Log10, Min, Max, Round, Ceil, Floor, Sign, Abs, Trunc, Sqrt, Negate, A# Introduction

# 3. Code Overview:

## Node Types

- Events You can implement arbitrary events that start execution: Start, Tick
- Actions You can implement actions that trigger animations, scene scene variations, or update internal state: Log, Play Gltf animation, Play Audio, Play Video, etc
- Logic You can do arithmetic, trigonometry as well as vector operations and string manipulation: Add, Subtract, Multiply, Divide, Pow, Exp, Log, Log2, Log10, Min, Max, Round, Ceil, Floor, Sign, Abs, Trunc, Sqrt, Negate, And, Or, Not, ==, >, >=, \<, \<=, isNan, isInfinity, concat, includes.
- Queries You can query the state from the system.
- Flow Control Control execution flow using familiar structures: Branch, Delay, Debounce, Throttle, FlipFlop, Sequence, Gate, MultiGate, DoOnce, DoN, ForLoop
- Variables You can create, set and get variable values.
- Custom Events You can create, listen to and trigger custom events.

### 3.2 Key Concepts

Nodes -
Connections -
Flow -

Events

Set and Get Scene Properties

Registering nodes

Value Types

Value type Converters

### 3.3 Engine Nodes

### 3.3.1 Entity

Teleport Entity
Add Entity
Delete Entity
Get Entity from Scene
Get Camera Entity

### 3.3.2 Component

Add Component

Delete Component

Get component from registry
Get component from entity

### 3.3.3 Engine

Play Video

Play Audio

Play Gltf Animations

Get Avatar animations

Fade Camera

Switch Scene

### 3.3.4 Events

Either in pairs of trigger and listener , or just listener
On Button State

triggerLoadAsset -> onLoadAsset




### 3.2 Key Concepts

Nodes -
Connections -
Flow -

Events

Set and Get Scene Properties

Registering nodes

Value Types

Value type Converters

### 3.3 Engine Nodes

### 3.3.1 Entity

Teleport Entity
Add Entity
Delete Entity
Get Entity from Scene
Get Camera Entity

### 3.3.2 Component

Add Component

Delete Component

Get component from registry
Get component from entity

### 3.3.3 Engine

Play Video

Play Audio

Play Gltf Animations

Get Avatar animations

# Hello, world!
Below is an example of markdown in JSX.
```jsx
<div style={{backgroundColor: 'violet', padding: '1rem'}}>
  Try and change the background color to `tomato`.
</div>
```

Fade Camera

Switch Scene

### 3.3.4 Events
Either in pairs of trigger and listener , or just listener
On Button State

triggerLoadAsset -> onLoadAsset

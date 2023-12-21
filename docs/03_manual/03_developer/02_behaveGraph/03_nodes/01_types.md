# Node Types

## Events
Initiate actions with Events: **Start** (begin execution) and **Tick** (continuous execution).

## Actions
Trigger animations, scene changes, or update internal states with Actions. Examples include:
- **Log**: Record a message.
- **Play Gltf animation**: Start a 3D animation.
- **Play Audio**: Play a sound.
- **Play Video**: Display a video.

## Logic
Perform mathematical and logical operations, manipulate strings:
- **Add**, **Subtract**, **Multiply**, **Divide**: Basic arithmetic
- **And**, **Or**, **Not**: Logical operations
- **==**, **>**, **>=**, **\<**, **\<=**: Comparison operations
- **Concat**: Combine strings
- **Includes**: Check if a string contains another

## Queries
Retrieve information from the scene through ECS queries.

## Flow Control
Control execution sequence with user-friendly structures:
- **Branch**: Make decisions based on conditions.
- **Delay**: Pause execution for a specified duration.
- **Debounce**: Ensure an action only happens after a pause.
- **Throttle**: Limit execution rate.
- **FlipFlop**: Alternate between two states.
- **Sequence**: Execute nodes in a specified order.
- **Gate**, **MultiGate**: Control flow based on conditions.
- **DoOnce**, **DoN**: Execute a node once or a specific number of times.
- **ForLoop**: Iterate through a sequence of actions.

## Variables
Create, set, and retrieve variable values.

## Custom Events
Design, listen to, and trigger custom events to customize system behavior.

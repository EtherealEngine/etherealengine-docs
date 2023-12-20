# Code Overview:

## Node Types

### Events
Initiate actions with Events: **Start** (begin execution) and **Tick** (continuous execution).

### Actions
Trigger animations, scene changes, or update internal states with Actions. Examples include:
- **Log**: Record a message.
- **Play Gltf animation**: Start a 3D animation.
- **Play Audio**: Play a sound.
- **Play Video**: Display a video.

### Logic
Perform mathematical and logical operations, manipulate strings:
- **Add**, **Subtract**, **Multiply**, **Divide**: Basic arithmetic.
- **And**, **Or**, **Not**: Logical operations.
- **==**, **>**, **>=**, **&#60;**, **&#60;=**: Comparison operations.
- **Concat**: Combine strings.
- **Includes**: Check if a string contains another.

### Queries
Retrieve information from the scene through ecs queries.

### Flow Control
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

### Variables
Create, set, and retrieve variable values.

### Custom Events
Design, listen to, and trigger custom events to customize system behavior.

## Key Concepts

**Nodes** - Basic building blocks defining program logic or processes. Represent actions or elements connected visually.

**Connections** - Lines linking nodes, defining data or control flow. Establish logical sequences.

**Flow** - Order of instructions or operations within a program. Represents data or program execution path.

**Events** - Incidents or situations during program execution, e.g., user interactions.

**Set and Get Scene Properties** - Store and retrieve information within the program.

**Registering Nodes** - Add nodes to a registry for runtime control.

**Value Types** - Abstract data type supporting general, custom data types, and objects.

**Value Type Converters** - Convert between different data types.

## Engine Nodes

### Entity

#### Get Entity in Scene Node

**Node Type:** Query  
**Name:** Get Entity in Scene  
**Description:** Retrieve an entity in the current scene.  
**Input Sockets:**  
- Entity: *Select an entity from the scene.*  
**Output Sockets:**  
- Entity: *Outputs the selected entity.*  
**Usage:** Obtain an entity from the scene for further operations.

---

#### Get Local Client Entity Node

**Node Type:** Query  
**Name:** Get Local Client Entity  
**Description:** Retrieve the local client entity within the engine.  
**Input Sockets:** None  
**Output Sockets:**  
- Entity: *Outputs the local client entity.*  
**Usage:** Access and work with the local client entity.

---

#### Get Camera Entity Node

**Node Type:** Query  
**Name:** Get Camera Entity  
**Description:** Obtain the camera entity in the engine.  
**Input Sockets:** None  
**Output Sockets:**  
- Entity: *Outputs the camera entity.*  
**Usage:** Access the camera entity for camera-related operations.

---

#### Get Entity Transform Node

**Node Type:** Query  
**Name:** Get Entity Transform  
**Description:** Retrieve the transformation (position, rotation, scale, matrix) of a specified entity.  
**Input Sockets:**  
- Entity: *Select the entity for transformation.*  
**Output Sockets:**  
- Position: *Outputs the position of the entity.*  
- Rotation: *Outputs the rotation of the entity.*  
- Scale: *Outputs the scale of the entity.*  
- Matrix: *Outputs the transformation matrix of the entity.*  
**Usage:** Obtain the transformation details of an entity in the scene.

---

#### Add Entity Node

**Node Type:** Action  
**Name:** Add Entity  
**Description:** Add a new entity to the scene, with optional parent entity and component.  
**Input Sockets:**  
- Flow: *Control script flow.*  
- Parent Entity: *Choose the parent entity for the new entity.*  
- Component: *Select a component to attach to the new entity.*  
- Entity Name: *Provide a name for the new entity (optional).*  
**Output Sockets:**  
- Flow: *Control script flow.*  
- Entity: *Outputs the newly created entity.*  
**Usage:** Dynamically add entities to the scene during script execution.

---

#### Delete Entity Node

**Node Type:** Action  
**Name:** Delete Entity  
**Description:** Delete a specified entity from the scene.  
**Input Sockets:**  
- Flow: *Control script flow.*  
- Entity: *Select the entity to delete.*  
**Output Sockets:**  
- Flow: *Control script flow.*  
**Usage:** Remove entities from the scene when no longer needed.

---

#### Set Entity Transform Node

**Node Type:** Action  
**Name:** Set Entity Transform  
**Description:** Set the transformation (position, rotation, scale) of a specified entity.  
**Input Sockets:**  
- Flow: *Control script flow.*  
- Entity: *Select the entity to transform.*  
- Position: *Set the new position for the entity.*  
- Rotation: *Set the new rotation for the entity.*  
- Scale: *Set the new scale for the entity.*  
**Output Sockets:**  
- Flow: *Control script flow.*  
**Usage:** Modify the transformation of an entity in the scene.

---

#### Get UUID Node

**Node Type:** Function  
**Name:** Get UUID  
**Description:** Retrieve the UUID (Universally Unique Identifier) of a specified entity.  
**Input Sockets:**  
- Entity: *Select the entity for UUID retrieval.*  
**Output Sockets:**  
- UUID: *Outputs the UUID of the selected entity as a string.*  
**Usage:** Obtain the UUID of an entity for various purposes.

### Component

#### Add Component Node

**Node Type:** Action  
**Name:** Add Component  
**Description:** Add a component to a specific entity in the scene.  
**Input Sockets:**  
- Flow: *Control script flow.*  
- Entity: *Select the entity to add the component.*  
- Component Name: *Choose the type of component to add.*  
**Output Sockets:**  
- Flow: *Control script flow.*  
- Entity: *Outputs the entity with the added component.*  
**Usage:** Dynamically attach default components to entities for enhanced functionality.

---

#### Delete Component Node

**Node Type:** Action  
**Name:** Delete Component  
**Description:** Remove a specified component from a given entity.  
**Input Sockets:**  
- Flow: *Control script flow.*  
- Entity: *Select the entity to remove the component.*  
- Component Name: *Choose the type of component to delete.*  
**Output Sockets:**  
- Flow: *Control script flow.*  
- Entity: *Outputs the entity with the component removed.*  
**Usage:** Remove specific components from entities, modifying behavior or appearance.

---

Additionally, we provide procedurally generated getter and setter nodes for 61/91 editable components available in the engine.

### Custom

#### Play Video Node

**Node Type:** Action  
**Name:** Play Video  
**Description:** Play a video on a specified entity within the scene.  
**Input Sockets:**  
- Flow: *Control script flow.*  
- Entity: *Select the entity for video playback.*  
- Media Path: *Provide the path to the video.*  
- Autoplay: *Specify whether the video should autoplay (true or false).*  
- Volume: *Set the volume for the video (0 to 1).*  
- Play Mode: *Choose the play mode for the video (e.g., "normal").*  
- Video Fit: *Select the fit mode for the video (e.g., "cover").*  
**Output Sockets:**  
- Flow: *Control script flow.*  
**Usage:** Play videos on entities, adjusting playback settings as needed.

---

#### Play Audio Node

**Node Type:** Action  
**Name:** Play Audio  
**Description:** Play audio on a specified entity within the scene.  
**Input Sockets:**  
- Flow: *Control script flow.*  
- Entity: *Select the entity for audio playback.*  
- Media Path: *Provide the path to the audio file.*  
- Autoplay: *Specify whether the audio should autoplay (true or false).*  
- Is Music: *Indicate whether the audio is music (true or false).*  
- Volume: *Set the volume for the audio (0 to 1).*  
- Play Mode: *Choose the play mode for the audio (e.g., "normal").*  
**Output Sockets:**  
- Flow: *Control script flow.*  
**Usage:** Play audio on entities, customizing playback options such as volume and autoplay.

---

#### Get Avatar Animations Node

**Node Type:** Query  
**Name:** Get Avatar Animations  
**Description:** Retrieve available avatar animations.  
**Input Sockets:**  
- Animation Name: *Choose an animation from the list.*  
**Output Sockets:**  
- Animation Name: *Outputs the selected animation name.*  
**Usage:** Obtain a list of available avatar animations for further use.

---

#### Play Animation Node

**Node Type:** Action  
**Name:** Play Animation  
**Description:** Play animations on a specified entity.  
**Input Sockets:**  
- Flow: *Control script flow.*  
- Entity: *Select the entity for animation.*  
- Action: *Choose the action for the animation (e.g., "play", "pause", "stop").*  
- Animation Speed: *Set the animation speed.*  
- Animation Pack: *Provide the animation pack name.*  
- Active Clip Index: *Specify the active clip index.*  
- Is Avatar: *Indicate whether the animation is for an avatar (true or false).*  
**Output Sockets:**  
- Flow: *Control script flow.*  
**Usage:** Control animations on entities, including actions like play, pause, and stop.

---

#### Set Animation Action Node

**Node Type:** Action  
**Name:** Set Animation Action  
**Description:** Set actions and properties for animations.  
**Input Sockets:**  
- Flow: *Control script flow.*  
- Entity: *Select the entity with the animation.*  
- Animation Speed: *Set the animation speed.*  
- Blend Mode: *Choose the animation blend mode (e.g., "normal").*  
- Loop Mode: *Select the loop mode for the animation (e.g., "once").*  
- Clamp When Finished: *Specify whether to clamp the animation when finished (true or false).*  
- Zero Slope at Start: *Indicate whether to use zero slope at the start (true or false).*  
- Zero Slope at End: *Indicate whether to use zero slope at the end (true or false).*  
- Weight: *Set the animation weight.*  
**Output Sockets:**  
- Flow: *Control script flow.*  
**Usage:** Configure animation actions and properties for entities.

---

#### Load Asset Node

**Node Type:** Action  
**Name:** Load Asset  
**Description:** Load an asset and add a media component to an entity.  
**Input Sockets:**  
- Flow: *Control script flow.*  
- Asset Path: *Provide the path to the asset.*  
**Output Sockets:**  
- Flow: *Control script flow.*  
- Load End: *Signal that asset loading has completed.*  
- Entity: *Outputs the entity with the loaded asset.*  
**Usage:** Load assets dynamically and attach them to entities.

---

#### Camera Fade Node

**Node Type:** Action  
**Name:** Camera Fade  
**Description:** Fade the camera view to black or back to normal.  
**Input Sockets:**  
- Flow: *Control script flow.*  
- To Black: *Specify whether to fade the camera to black (true or false).*  
**Output Sockets:**  
- Flow: *Control script flow.*  
**Usage:** Create camera fade effects.

### Events

#### On Button State Node

**Node Type:** Event  
**Name:** On Button State  
**Description:** Trigger events based on the state of a specified button from various input sources (keyboard, mouse, gamepad, XR gamepad).  
**Input Sockets:**  
- Button: *Select the button to monitor.*  
**Output Sockets:**  
- Down: *Flow output for button press down.*  
- Pressed: *Flow output for button press.*  
- Touched: *Flow output for button touch.*  
- Up: *Flow output for button release.*  
- Value: *Float output representing button value.*  
**Usage:** Create event-based logic responding to button state changes.

---

#### On Query Node

**Node Type:** Event  
**Name:** On Query  
**Description:** Trigger events based on query results for a specified combination of components within a 3D engine system.  
**Input Sockets:**  
- Type: *Select the query event type ("enter" or "exit").*  
- System: *Choose the 3D engine system or system group for the query.*  
- ComponentName N: *Specify component names for the query (N represents the index).*  
**Output Sockets:**  
- Flow: *Flow output for each matching entity.*  
- Entity: *Entity output representing the entity that matches the query result.*  
**Usage:** Create event-based logic responding to component combinations in a 3D engine system.

---

#### OnCollision Node

**Node Type:** Event  
**Name:** Collision Events  
**Description:** Trigger events based on collision occurrences within a 3D engine system.  
**Input Sockets:**  
- Entity: *Specify the entity for which collision events are monitored.*  
**Output Sockets:**  
- Flow: *Flow output for each collision event.*  
- Entity: *Entity output representing the entity involved in the collision.*  
- Target: *Entity output representing the target entity involved in the collision.*  
**Usage:** Create event-based logic responding to collisions involving a specific entity in a 3D engine system.

### State

Getter and setter nodes for hyperflux states in the engine, handling various functionality.

### Action

Dispatch and consumer nodes for hyperflux actions, allowing predefined actions to be dispatched and listened to using behave graph.

# Code Overview:

## Node Types

### Events
You can set up events to initiate actions: **Start** (begin execution) and **Tick** (continuous execution).

### Actions
Implement actions to trigger animations, scene changes, or update internal states. Examples include:
- **Log**: Record a message.
- **Play Gltf animation**: Start a 3D animation.
- **Play Audio**: Play a sound.
- **Play Video**: Display a video.

### Logic
Perform basic mathematical and logical operations, as well as manipulate strings. Use operations like:
- **Add**, **Subtract**, **Multiply**, **Divide**: Basic arithmetic.
- **And**, **Or**, **Not**: Logical operations.
- **==**, **>**, **>=**, **&#60;**, **&#60;=**: Comparison operations.
- **Concat**: Combine strings.
- **Includes**: Check if a string contains another.

### Queries
Retrieve information from the system through queries.

### Flow Control
Control the sequence of execution with user-friendly structures:
- **Branch**: Make decisions based on conditions.
- **Delay**: Pause execution for a specified duration.
- **Debounce**: Ensure an action only happens after a pause.
- **Throttle**: Limit the rate of execution.
- **FlipFlop**: Alternate between two states.
- **Sequence**: Execute nodes in a specified order.
- **Gate**, **MultiGate**: Control the flow based on conditions.
- **DoOnce**, **DoN**: Execute a node once or a specific number of times.
- **ForLoop**: Iterate through a sequence of actions.

### Variables
Create, set, and retrieve variable values.

### Custom Events
Design, listen to, and trigger custom events to customize the behavior of your system.

## Key Concepts

**Nodes** - Nodes are the basic building blocks used to create and define the logic or processes of a program. Think of them as specific actions or elements in a program that are visually connected to represent the program's flow or functionality.

**Connections** - Connections are the lines or arrows that link nodes together, defining how data or control moves within a program. They establish a structured and logical sequence of operations, showing how information flows from one node to another.

**Flow** - Flow refers to the order in which instructions or operations are carried out within a program. It represents the path that data or program execution follows, starting from an event in the scene.

**Events** - Events are incidents or situations that occur during program execution. These can include user interactions, system notifications, or sensor inputs.

**Set and Get Scene Properties** - These are nodes that allow you to store and retrieve information within the program. Setter nodes store a variable in the program, and getter nodes retrieve that variable later on. They also enable users to access and modify component and state properties.

**Registering Nodes** - To use a particular node, it must be registered under a profile and added to a node registry. This provides security by controlling which nodes can be used during runtime. Nodes can be added or removed as needed.

**Value Types** - Each program has its own abstract data type supporting general data types, custom data types, and custom objects.

**Value Type Converters** - These nodes allow users to freely convert between different data types and transform node outputs to fit the inputs of other nodes.



## Engine Nodes

### Entity

A collection of nodes which deal with entities in the engine 

#### Get Entity in Scene Node

**Node Type:** Query  
**Name:** Get Entity in Scene  
**Description:** This node allows you to retrieve an entity that exists within the current scene.  
**Input Sockets:**  
- Entity: *Select an entity from the scene.*  
**Output Sockets:**  
- Entity: *Outputs the selected entity.*  
**Usage:** Use this node to obtain an entity from the scene and pass it as output for further operations.

#### Get Local Client Entity Node

**Node Type:** Query  
**Name:** Get Local Client Entity  
**Description:** This node retrieves the local client entity within the engine.  
**Input Sockets:** None  
**Output Sockets:**  
- Entity: *Outputs the local client entity.*  
**Usage:** Use this node when you need to access and work with the local client entity in your script.

#### Get Camera Entity Node

**Node Type:** Query  
**Name:** Get Camera Entity  
**Description:** This node allows you to obtain the camera entity in the engine.  
**Input Sockets:** None  
**Output Sockets:**  
- Entity: *Outputs the camera entity.*  
**Usage:** Utilize this node to access the camera entity, which can be useful for camera-related operations.

#### Get Entity Transform Node

**Node Type:** Query  
**Name:** Get Entity Transform  
**Description:** This node retrieves the transformation (position, rotation, scale, and matrix) of a specified entity.  
**Input Sockets:**  
- Entity: *Select the entity whose transform you want to retrieve.*  
**Output Sockets:**  
- Position: *Outputs the position of the entity.*  
- Rotation: *Outputs the rotation of the entity.*  
- Scale: *Outputs the scale of the entity.*  
- Matrix: *Outputs the transformation matrix of the entity.*  
**Usage:** Use this node to obtain the transformation details of an entity in the scene.

#### Add Entity Node

**Node Type:** Action  
**Name:** Add Entity  
**Description:** This node adds a new entity to the scene, optionally specifying a parent entity and a component.  
**Input Sockets:**  
- Flow: *Control the flow of your script.*  
- Parent Entity: *Choose the parent entity for the new entity.*  
- Component: *Select a component to attach to the new entity.*  
- Entity Name: *Provide a name for the new entity (optional).*  
**Output Sockets:**  
- Flow: *Control the flow of your script.*  
- Entity: *Outputs the newly created entity.*  
**Usage:** Use this node to dynamically add entities to the scene during script execution.

#### Delete Entity Node

**Node Type:** Action  
**Name:** Delete Entity  
**Description:** This node deletes a specified entity from the scene.  
**Input Sockets:**  
- Flow: *Control the flow of your script.*  
- Entity: *Select the entity to delete.*  
**Output Sockets:**  
- Flow: *Control the flow of your script.*  
**Usage:** Utilize this node to remove entities from the scene when they are no longer needed.

#### Set Entity Transform Node

**Node Type:** Action  
**Name:** Set Entity Transform  
**Description:** This node allows you to set the transformation (position, rotation, and scale) of a specified entity.  
**Input Sockets:**  
- Flow: *Control the flow of your script.*  
- Entity: *Select the entity to transform.*  
- Position: *Set the new position for the entity.*  
- Rotation: *Set the new rotation for the entity.*  
- Scale: *Set the new scale for the entity.*  
**Output Sockets:**  
- Flow: *Control the flow of your script.*  
**Usage:** Use this node to modify the transformation of an entity in the scene. For the local client entity, it tries to teleport to the specified transform; if the final destination is invalid, the operation fails.

#### Get UUID Node

**Node Type:** Function  
**Name:** Get UUID  
**Description:** This node retrieves the UUID (Universally Unique Identifier) of a specified entity.  
**Input Sockets:**  
- Entity: *Select the entity whose UUID you want to retrieve.*  
**Output Sockets:**  
- UUID: *Outputs the UUID of the selected entity as a string.*  
**Usage:** Use this node to obtain the UUID of an entity for various purposes.


### Component

#### Add Component Node

**Node Type:** Action  
**Name:** Add Component  
**Description:** This node enables you to add a component to a specific entity in your scene.  
**Input Sockets:**  
- Flow: *Control the flow of your script.*  
- Entity: *Select the entity to which you want to add the component.*  
- Component Name: *Choose the type of component to add to the entity.*  
**Output Sockets:**  
- Flow: *Control the flow of your script.*  
- Entity: *Outputs the entity with the added component.*  
**Usage:** Use this node to dynamically attach default components to entities, enhancing their functionality within the scene.

---

#### Delete Component Node

**Node Type:** Action  
**Name:** Delete Component  
**Description:** This node allows you to remove a specified component from a given entity.  
**Input Sockets:**  
- Flow: *Control the flow of your script.*  
- Entity: *Select the entity from which you want to remove the component.*  
- Component Name: *Choose the type of component to delete from the entity.*  
**Output Sockets:**  
- Flow: *Control the flow of your script.*  
- Entity: *Outputs the entity with the component removed.*  
**Usage:** Use this node to remove specific components from entities in your scene, modifying their behavior or appearance.

---

Additionally, we provide procedurally generated getter and setter nodes for 61/91 editable components available in the engine.



### Custom

#### Play Video Node

**Node Type:** Action  
**Name:** Play Video  
**Description:** This node allows you to play a video on a specified entity within the scene.  
**Input Sockets:**  
- Flow: *Control the flow of your script.*  
- Entity: *Select the entity on which to play the video.*  
- Media Path: *Provide the path to the video.*  
- Autoplay: *Specify whether the video should autoplay (true or false).*  
- Volume: *Set the volume for the video (0 to 1).*  
- Play Mode: *Choose the play mode for the video (e.g., "normal").*  
- Video Fit: *Select the fit mode for the video (e.g., "cover").*  
**Output Sockets:**  
- Flow: *Control the flow of your script.*  
**Usage:** Use this node to play videos on entities, adjusting playback settings as needed.

---

#### Play Audio Node

**Node Type:** Action  
**Name:** Play Audio  
**Description:** This node allows you to play audio on a specified entity within the scene.  
**Input Sockets:**  
- Flow: *Control the flow of your script.*  
- Entity: *Select the entity on which to play the audio.*  
- Media Path: *Provide the path to the audio file.*  
- Autoplay: *Specify whether the audio should autoplay (true or false).*  
- Is Music: *Indicate whether the audio is music (true or false).*  
- Volume: *Set the volume for the audio (0 to 1).*  
- Play Mode: *Choose the play mode for the audio (e.g., "normal").*  
**Output Sockets:**  
- Flow: *Control the flow of your script.*  
**Usage:** Use this node to play audio on entities, customizing playback options such as volume and autoplay.

---

#### Get Avatar Animations Node

**Node Type:** Query  
**Name:** Get Avatar Animations  
**Description:** This node retrieves available avatar animations.  
**Input Sockets:**  
- Animation Name: *Choose an animation from the list.*  
**Output Sockets:**  
- Animation Name: *Outputs the selected animation name.*  
**Usage:** Use this node to obtain a list of available avatar animations for further use.

---

#### Play Animation Node

**Node Type:** Action  
**Name:** Play Animation  
**Description:** This node allows you to play animations on a specified entity.  
**Input Sockets:**  
- Flow: *Control the flow of your script.*  
- Entity: *Select the entity on which to play the animation.*  
- Action: *Choose the action for the animation (e.g., "play", "pause", "stop").*  
- Animation Speed: *Set the animation speed.*  
- Animation Pack: *Provide the animation pack name.*  
- Active Clip Index: *Specify the active clip index.*  
- Is Avatar: *Indicate whether the animation is for an avatar (true or false).*  
**Output Sockets:**  
- Flow: *Control the flow of your script.*  
**Usage:** Use this node to control animations on entities, including actions like play, pause, and stop.

---

#### Set Animation Action Node

**Node Type:** Action  
**Name:** Set Animation Action  
**Description:** This node allows you to set actions and properties for animations.  
**Input Sockets:**  
- Flow: *Control the flow of your script.*  
- Entity: *Select the entity with the animation.*  
- Animation Speed: *Set the animation speed.*  
- Blend Mode: *Choose the animation blend mode (e.g., "normal").*  
- Loop Mode: *Select the loop mode for the animation (e.g., "once").*  
- Clamp When Finished: *Specify whether to clamp the animation when finished (true or false).*  
- Zero Slope at Start: *Indicate whether to use zero slope at the start (true or false).*  
- Zero Slope at End: *Indicate whether to use zero slope at the end (true or false).*  
- Weight: *Set the animation weight.*  
**Output Sockets:**  
- Flow: *Control the flow of your script.*  
**Usage:** Use this node to configure animation actions and properties for entities.

---

#### Load Asset Node

**Node Type:** Action  
**Name:** Load Asset  
**Description:** This node loads an asset and adds a media component to an entity.  
**Input Sockets:**  
- Flow: *Control the flow of your script.*  
- Asset Path: *Provide the path to the asset.*  
**Output Sockets:**  
- Flow: *Control the flow of your script.*  
- Load End: *Signal that the asset loading has completed.*  
- Entity: *Outputs the entity with the loaded asset.*  
**Usage:** Use this node to load assets dynamically and attach them to entities.

---

#### Camera Fade Node

**Node Type:** Action  
**Name:** Camera Fade  
**Description:** This node fades the camera view to black or back to normal.  
**Input Sockets:**  
- Flow: *Control the flow of your script.*  
- To Black: *Specify whether to fade the camera to black (true or false).*  
**Output Sockets:**  
- Flow: *Control the flow of your script.*  
**Usage:** Use this node to create camera fade effects.





### Events

#### On Button State Node

**Node Type:** Event  
**Name:** On Button State  
**Description:** This node triggers events based on the state of a specified button from various input sources, such as the keyboard, mouse, gamepad, or XR gamepad.  
**Input Sockets:**  
- Button: *Select the button for which you want to monitor the state. You can choose from a wide range of buttons from different input sources.*  
**Output Sockets:**  
- Down: *Flow output for when the button is pressed down.*  
- Pressed: *Flow output for when the button is pressed.*  
- Touched: *Flow output for when the button is touched.*  
- Up: *Flow output for when the button is released.*  
- Value: *Float output representing the value of the button (e.g., pressure on the button).*  
**Usage:** Use this node to create event-based logic that responds to the state changes of specific buttons on various input sources. For example, you can use it to trigger actions when a keyboard key is pressed or when a gamepad button is touched, this also works for mouse clicks and taps on a touchpad.

---

#### On Query Node

**Node Type:** Event  
**Name:** On Query  
**Description:** This node triggers events based on the query results for a specified combination of components within a 3D engine system.  
**Input Sockets:**  
- Type: *Select the type of query event to trigger ("enter" or "exit").*  
- System: *Choose the 3D engine system or system group to execute the query in.*  
- ComponentName N: *Specify the component names (N represents the index) for which you want to query the entities.*  
**Output Sockets:**  
- Flow: *Flow output for each matching entity.*  
- Entity: *Entity output representing the entity that matches the query result.*  
**Usage:** Use this node to create event-based logic that responds to combinations of components being added or deleted from an entity defined within a 3D engine system.

---

#### OnCollision Node

**Node Type:** Event  
**Name:** Collision Events  
**Description:** This node triggers events based on collision occurrences within a 3D engine system.  
**Input Sockets:**  
- Entity: *Specify the entity for which collision events are monitored.*  
**Output Sockets:**  
- Flow: *Flow output for each collision event.*  
- Entity: *Entity output representing the entity involved in the collision.*  
- Target: *Entity output representing the target entity involved in the collision.*  
**Usage:** Use this node to create event-based logic that responds to collision events involving a specific entity within a 3D engine system.

### State

We support getter and setter nodes for hyperflux states in the engine which handle a lot of functionality in the engine.
 
### Action

We support dispatch and consumer nodes for hyperflux actions, predefined actions can be dispatched and listened to in the engine using behave graph  


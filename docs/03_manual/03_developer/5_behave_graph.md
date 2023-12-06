# Introduction

* Overview
* Audience

Getting Started

* Installation
* Configuration

Code Overview:

* High-Level Architecture
* Key Concepts
* Engine Nodes

Usage

* Examples

Configuration and Customization

* Making new nodes

## 1. Introduction

### 1.1 Overview

Behavior graphs are expressive, deterministic, and extensible state machines that can encode arbitrarily complex behavior.

Behavior graphs are a popular choice for implementing visual scripting languages. Prominent game engines like Unreal Engine and Unity have adopted behavior graphs as an essential component of their visual scripting systems. For example, Unreal Engine's Blueprints, Unity's Visual Scripting, and NVIDIA Omniverse's OmniGraph rely on behavior graphs to enable game designers and developers to create complex behaviors without writing code directly.

Within the Ethereal Engine, the Behavior Graphs feature plays a pivotal role by providing a no-code interface to the engine and by interacting with the engine while modeling, organizing, controlling and assigning complex behaviors on entities, with ease.

### 1.2 Audience

Behavior Graphs in the Ethereal engine target developers, designers, artists, and non-technical users. This visual scripting feature enables easy implementation of complex logic and actions for entities without the need for writing scripts. It fosters collaboration and empowers diverse individuals to create immersive experiences and interactive content within the engine.

## 2. Getting Started

### 2.1 Installation - at the moment the behavior graph implementation is available on the behave-graph-integration branch in the Ethereal Engine Repository

Clone the branch and follow general Ethereal engine installation steps
[general instructions](/docs/host/installation/)

The Behavior Graphs must be defined in the studio and thus require a user to have admin privileges

### 2.2 Configuration

The Behave graph is implemented as a component in the engine following the ECS(Entity component system) architecture in the engine.

Users can add and remove a behave graph component from an entity  

Step 1: find the behave graph component under the scripting section in the component shelf in the right side of the screen
Step 2:

1. double click on the component tor drag and drop into scene to add a new entity with the behave graph component into the screen
2. Drag and drop into the hierarchy panel on another entity to add to scene as child of the selected entity
3. Drag and drop into properties panel of selected entity to add component to entity

The behave graph properties panel has two properties:

* Run graph: runs the graph in headless mode as part of the engine
* Disable graph: disable graph from playing

### 2.3 Creating your First graph

Before we dive into creating the graph let's take a look at the graph panel

The graph panel consists of the the panel itself, panel buttons, nodes and connections

The default behave graph consists of an  

On start event node

On tick event node

Logger node

To navigate across the panel, drag across the surface of the panel

### 2.3.1 buttons in the graph panel

The buttons panel is location in the bottom left side of the screen

The buttons are as follows

Zoom in: zoom into the graph viewport

Zoom out: zoom out of the graph viewport

Fit view: tries to fit all nodes into the screen at the same time, if not possible it centers the view at the center of all nodes

Lock graph:  Toggles ability to graph edit

Help: Opens an instruction modal for making graphs

Load Graph: Opens a modal, user can paste graph json in the input field to load the corresponding graph

Save Graph: Opens a model, user can copy the graph json from the text box and save as needed

Play Graph: runs headful version of the graph connected to the graph editor

### 2.3.2 Saving Graph

The graph has its own json which is also part of the scene json, therefore the user needs to save the graph in as its own json which then must be saved as a part of the scene

The graph json is autosaved every 5 seconds the graph panel i open and whenever the graph panel is closed (the component unmounts)

The graph and overall changes to the scene must be saved using the save scene option from the main menu

### 2.3.3 Playing a graph

A graph can be played in two modes, headful and headless,

headful mode play - headful mode, activated by pressing the play button in the graph buttons, graph stops executing when the panel is closed or component unmounts, meant for quick testing, setting scene variables and rapid development

Headless mode play - headless mode, play activated from properties panel, execution does not stop unless play is toggled off again from the properties panel

To play all graphs in the scene the user can use the play scene button from the top toolbar

NOTE: headful and headless plays must be managed separately

#### Ok finally with all this context, lets add a node

To add a node, right click anywhere on the graph panel

This will open up the node picker select window,

Type in the search input to filter nodes by prefix
Click on the node to add to the panel

Lets add a logger node and connect it to the on tick event

To connect the flow of the nodes , drag from one flow socket to another
There can be only one flow output from one flow output  socket

But there can be multiple inputs to a flow input socket

To play the graph click on the play graph button

Well done, outputs to the log can be seen in the dev tools console

TODO: add pictures

3. Code Overview:

Node Types

* Events You can implement arbitrary events that start execution: Start, Tick
* Actions You can implement actions that trigger animations, scene scene variations, or update internal state: Log, Play Gltf animation, Play Audio, Play Video, etc
* Logic You can do arithmetic, trigonometry as well as vector operations and string manipulation: Add, Subtract, Multiply, Divide, Pow, Exp, Log, Log2, Log10, Min, Max, Round, Ceil, Floor, Sign, Abs, Trunc, Sqrt, Negate, A# Introduction

* Overview
* Audience

Getting Started

* Installation
* Configuration

Code Overview:

* High-Level Architecture
* Key Concepts
* Engine Nodes

Usage

* Examples

Configuration and Customization

* Making new nodes

## 1. Introduction

### 1.1 Overview

Behavior graphs are expressive, deterministic, and extensible state machines that can encode arbitrarily complex behavior.

Behavior graphs are a popular choice for implementing visual scripting languages. Prominent game engines like Unreal Engine and Unity have adopted behavior graphs as an essential component of their visual scripting systems. For example, Unreal Engine's Blueprints, Unity's Visual Scripting, and NVIDIA Omniverse's OmniGraph rely on behavior graphs to enable game designers and developers to create complex behaviors without writing code directly.

Within the Ethereal Engine, the Behavior Graphs feature plays a pivotal role by providing a no-code interface to the engine and by interacting with the engine while modeling, organizing, controlling and assigning complex behaviors on entities, with ease.

### 1.2 Audience

Behavior Graphs in the Ethereal engine target developers, designers, artists, and non-technical users. This visual scripting feature enables easy implementation of complex logic and actions for entities without the need for writing scripts. It fosters collaboration and empowers diverse individuals to create immersive experiences and interactive content within the engine.

## 2. Getting Started

### 2.1 Installation - at the moment the behavior graph implementation is available on the behave-graph-integration branch in the Ethereal Engine Repository

Clone the branch and follow general Ethereal engine installation steps
[general instructions](/docs/host/installation/)

The Behavior Graphs must be defined in the studio and thus require a user to have admin privileges

### 2.2 Configuration

The Behave graph is implemented as a component in the engine following the ECS(Entity component system) architecture in the engine.

Users can add and remove a behave graph component from an entity  

Step 1: find the behave graph component under the scripting section in the component shelf in the right side of the screen
Step 2:

1. double click on the component tor drag and drop into scene to add a new entity with the behave graph component into the screen
2. Drag and drop into the hierarchy panel on another entity to add to scene as child of the selected entity
3. Drag and drop into properties panel of selected entity to add component to entity

The behave graph properties panel has two properties:

* Run graph: runs the graph in headless mode as part of the engine
* Disable graph: disable graph from playing

### 2.3 Creating your First graph

Before we dive into creating the graph let's take a look at the graph panel

The graph panel consists of the the panel itself, panel buttons, nodes and connections

The default behave graph consists of an  

On start event node

On tick event node

Logger node

To navigate across the panel, drag across the surface of the panel

### 2.3.1 buttons in the graph panel

The buttons panel is location in the bottom left side of the screen

The buttons are as follows

Zoom in: zoom into the graph viewport

Zoom out: zoom out of the graph viewport

Fit view: tries to fit all nodes into the screen at the same time, if not possible it centers the view at the center of all nodes

Lock graph:  Toggles ability to graph edit

Help: Opens an instruction modal for making graphs

Load Graph: Opens a modal, user can paste graph json in the input field to load the corresponding graph

Save Graph: Opens a model, user can copy the graph json from the text box and save as needed

Play Graph: runs headful version of the graph connected to the graph editor

### 2.3.2 Saving Graph

The graph has its own json which is also part of the scene json, therefore the user needs to save the graph in as its own json which then must be saved as a part of the scene

The graph json is autosaved every 5 seconds the graph panel i open and whenever the graph panel is closed (the component unmounts)

The graph and overall changes to the scene must be saved using the save scene option from the main menu

### 2.3.3 Playing a graph

A graph can be played in two modes, headful and headless,

headful mode play - headful mode, activated by pressing the play button in the graph buttons, graph stops executing when the panel is closed or component unmounts, meant for quick testing, setting scene variables and rapid development

Headless mode play - headless mode, play activated from properties panel, execution does not stop unless play is toggled off again from the properties panel

To play all graphs in the scene the user can use the play scene button from the top toolbar

NOTE: headful and headless plays must be managed separately

#### Ok finally with all this context, lets add a node

To add a node, right click anywhere on the graph panel

This will open up the node picker select window,

Type in the search input to filter nodes by prefix
Click on the node to add to the panel

Lets add a logger node and connect it to the on tick event

To connect the flow of the nodes , drag from one flow socket to another
There can be only one flow output from one flow output  socket

But there can be multiple inputs to a flow input socket

To play the graph click on the play graph button

Well done, outputs to the log can be seen in the dev tools console

TODO: add pictures

3. Code Overview:

Node Types

* Events You can implement arbitrary events that start execution: Start, Tick
* Actions You can implement actions that trigger animations, scene scene variations, or update internal state: Log, Play Gltf animation, Play Audio, Play Video, etc
* Logic You can do arithmetic, trigonometry as well as vector operations and string manipulation: Add, Subtract, Multiply, Divide, Pow, Exp, Log, Log2, Log10, Min, Max, Round, Ceil, Floor, Sign, Abs, Trunc, Sqrt, Negate, And, Or, Not, ==, >, >=, \<, \<=, isNan, isInfinity, concat, includes.
* Queries You can query the state from the system.
* Flow Control Control execution flow using familiar structures: Branch, Delay, Debounce, Throttle, FlipFlop, Sequence, Gate, MultiGate, DoOnce, DoN, ForLoop
* Variables You can create, set and get variable values.
* Custom Events You can create, listen to and trigger custom events.

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

## 4. Usage

Add some example screenshots and explain

## 5.Configuration and Customization

### 5.1 Making new nodes

Describe the creation of nodes

Making flow nodes
Making Event node
Making Value types

Making Function node

Extending Dependencies  
nd, Or, Not, ==, >, >=, \<, \<=, isNan, isInfinity, concat, includes.
* Queries You can query the state from the system.
* Flow Control Control execution flow using familiar structures: Branch, Delay, Debounce, Throttle, FlipFlop, Sequence, Gate, MultiGate, DoOnce, DoN, ForLoop
* Variables You can create, set and get variable values.
* Custom Events You can create, listen to and trigger custom events.

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

<div style={{backgroundColor: 'violet', padding: '1rem'}}>
  Try and change the background color to `tomato`.
</div>
Fade Camera

Switch Scene

### 3.3.4 Events

Either in pairs of trigger and listener , or just listener
On Button State

triggerLoadAsset -> onLoadAsset

## 4. Usage

Add some example screenshots and explain

## 5.Configuration and Customization

### 5.1 Making new nodes

Describe the creation of nodes

Making flow nodes
Making Event node
Making Value types

Making Function node

Extending Dependencies  
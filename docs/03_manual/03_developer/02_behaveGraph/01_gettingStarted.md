<!-- TODO: De-duplicate the sections -->
# Getting Started

## 2.1 Installation
The Behavior Graphs are a part of the studio and thus require a user to have admin or creator privileges

## 2.2 Configuration
The Behave graph is implemented as a component in the engine following the ECS (Entity component system) architecture in the engine.

Users can add and remove a behave graph component from an entity  

Step 1: find the behave graph component under the scripting section in the component shelf in the right side of the screen

Step 2:
- double click on the component tor drag and drop into scene to add a new entity with the behave graph component into the screen
- Drag and drop into the hierarchy panel on another entity to add to scene as child of the selected entity
- Drag and drop into properties panel of selected entity to add component to entity

The behave graph properties panel has two properties:

- Run graph: runs the graph in headless mode as part of the engine
- Disable graph: disable graph from playing

## 2.3 Creating your First graph
Before we dive into creating the graph let's take a look at the graph panel

The graph panel consists of the the panel itself, panel buttons, nodes and connections

The default behave graph consists of:
- On start event node
- On tick event node
- Log node

To navigate across the panel, drag across the surface of the panel

### 2.3.1 buttons in the graph panel
The buttons panel is location in the bottom left side of the screen

The buttons are as follows
- Zoom in: zoom into the graph viewport
- Zoom out: zoom out of the graph viewport
- Fit view: tries to fit all nodes into the screen at the same time, if not possible it centers the view at the center of all nodes
- Lock graph:  Toggles ability to edit graph
- Help: Opens an instruction modal for making graphs
- Load Graph: Opens a modal, user can paste graph json in the input field to load the corresponding graph
- Save Graph: Opens a model, user can copy the graph json from the text box and save into an external file
- Play Graph: runs headful version of the graph connected to the graph editor

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

<!-- TODO: add pictures -->

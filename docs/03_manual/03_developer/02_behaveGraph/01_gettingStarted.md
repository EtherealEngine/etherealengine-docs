# Getting Started with Behavior Graphs

## Installation
Behavior Graphs are preinstalled as a part of the ethereal engine studio. Studio access require users to have admin or creator privileges.

## Configuration
The Behave graph is implemented as a component in the engine, following the ECS (Entity Component System) architecture.

Users can add or remove a Behave graph component from an entity using the following steps:

1. Locate the Behave graph component under the scripting section in the component shelf on the right side of the screen.
2. Perform one of the following actions:
   - Double-click on the component or drag and drop it into the scene to add a new entity with the Behave graph component.
   - Drag and drop it into the hierarchy panel on another entity to add it to the scene as a child of the selected entity.
   - Drag and drop it into the properties panel of a selected entity to add the component to that entity.

The Behave graph properties panel has two properties:

- **Run Graph:** Executes the graph in headless mode as part of the engine.
- **Disable Graph:** Prevents the graph from playing.

## Creating Your First Graph
Before delving into creating the graph, let's explore the graph panel.

The graph panel includes the panel itself, panel buttons, nodes, and connections.

The default Behave graph includes:
- On Start event node
- On Tick event node
- Log node

To navigate the panel, drag across its surface.

### Buttons in the Graph Panel
The buttons panel is located at the bottom-left side of the screen.

The buttons include:
- **Zoom In:** Enlarges the graph viewport.
- **Zoom Out:** Shrinks the graph viewport.
- **Fit View:** Attempts to fit all nodes into the screen; if not possible, centers the view at the center of all nodes.
- **Lock Graph:** Toggles the ability to edit the graph.
- **Help:** Opens an instructional modal for creating graphs.
- **Load Graph:** Opens a modal where users can paste graph JSON into the input field to load the corresponding graph.
- **Save Graph:** Opens a modal where users can copy the graph JSON from the text box and save it to an external file.
- **Play Graph:** Executes the headful version of the graph connected to the graph editor.

### Saving Graph
The graph has its JSON, which is part of the scene JSON. Users need to save the graph as its own JSON, which must then be saved as part of the scene.

The graph JSON is autosaved every 5 seconds when the graph panel is open and whenever the graph panel is closed (the component unmounts).

Save the graph and overall changes to the scene using the "Save Scene" option in the main menu.

### Playing a Graph
A graph can be played in two modes: headful and headless.

**Headful Mode Play:** Activated by pressing the play button in the graph buttons. The graph stops executing when the panel is closed or the component unmounts. It's meant for quick testing, setting scene variables, and rapid development.

**Headless Mode Play:** Activated from the properties panel. Execution does not stop unless play is toggled off again from the properties panel.

To play all graphs in the scene, users can use the "Play Scene" button from the top toolbar.

**Note:** Headful and headless plays must be managed separately.

## Adding a Node
To add a node, right-click anywhere on the graph panel.

This opens the node picker select window. Type in the search input to filter nodes by prefix and click on the node to add it to the panel.

Let's add a logger node and connect it to the On Tick event.

To connect the flow of the nodes, drag from one flow socket to another. There can be only one flow output from one flow output socket, but there can be multiple inputs to a flow input socket.

To execute the graph, click on the "Play Graph" button.

Congratulations! Outputs to the log can be seen in the dev tools console.

<!-- TODO: add pictures -->

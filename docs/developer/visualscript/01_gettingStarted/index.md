---
title: Getting Started
---

# Getting Started with VisualScript
<!-- TODO: Add pictures to this file -->
_This guide will teach you how to get started programming with iR Engine and VisualScript._  
_Visit the [VisualScript: Introduction](/developer/visualscript) page for an overview of what VisualScript is._  
<!-- TODO: Add VisualScript intro text as a mdx partial, instead of linking to the other page -->

## Installation
VisualScript is preinstalled with iR Engine, and can be accessed as part of the iR Engine Studio.
> Note: Access to the Studio requires users to have admin or creator privileges.

## Configuration
VisualScript is implemented as a component of the engine, following the ECS (Entity Component System) architecture.

Users can add or remove a VisualScript component from an entity using the following steps:
1. Locate the VisualScript component under the scripting section in the component shelf on the right side of the screen.
1. Perform one of the following actions:
   1. Double-click on the component or drag and drop it into the scene to add a new entity with the VisualScript component.
   1. Drag and drop it into the hierarchy panel on another entity to add it to the scene as a child of the selected entity.
   1. Drag and drop it into the properties panel of a selected entity to add the component to that entity.

The VisualScript properties panel has two properties:
- **Run Graph:** Executes the graph in headless mode as part of the engine.
- **Disable Graph:** Prevents the graph from playing.

## Creating Your First Graph
Before delving into creating the graph, let's explore the graph panel.

The graph panel includes the panel itself, panel buttons, nodes, and connections.

Each VisualScript, by default, includes:
- On Start event node
- On Tick event node
- Log node

> Note: Drag across the panel's surface to navigate it.

### Buttons in the Graph Panel
The buttons panel is located at the bottom-left side of the screen. It includes:
- **Zoom In:** Enlarges the graph viewport.
- **Zoom Out:** Shrinks the graph viewport.
- **Fit View:** Attempts to fit all nodes into the screen; if not possible, centers the view at the center of all nodes.
- **Lock Graph:** Toggles the ability to edit the graph.
- **Help:** Opens an instructional modal for creating graphs.
- **Load Graph:** Opens a modal where users can paste graph JSON into the input field to load the corresponding graph.
- **Save Graph:** Opens a modal where users can copy the graph JSON from the text box and save it to an external file.
- **Play Graph:** Executes the headful version of the graph connected to the graph editor.

### Saving a Graph
Each graph has its own JSON data, which is part of the scene's JSON object.
Users need to save their graph as a separate JSON, which must then be saved as part of the scene.

The graph's JSON is autosaved every 5 seconds when the graph panel is open and whenever the graph panel is closed _(aka. the graph component is unmounted by the engine)_.

Save the graph and overall changes to the scene by using the `Save Scene` option in the main menu.

### Playing a Graph
A graph can be played in two modes: `headful` and `headless`.

- **Headful Mode Play**:  
  Activated by pressing the play button in the graph buttons.  
  The graph stops executing when the panel is closed or the component unmounts.  
  This mode is meant for quick testing, setting scene variables, and rapid development.
- **Headless Mode Play**:  
  Activated from the properties panel.  
  Execution does not stop unless play is toggled off again from the properties panel.  

Use the `Play Scene` button from the top toolbar to play all graphs of the current scene.

> Note: Headful and Headless plays must be managed separately.

## Adding a Node
Right-click anywhere on the graph panel to add a node.  

This action will open the node picker select window.  
Type in the search input to filter nodes by prefix and click on the node to add it to the panel.

Let's add a logger node and connect it to the On Tick event.

Drag from one flow socket to another to connect the flow of both nodes.  
There can be only one flow output from one flow output socket, but there can be multiple inputs to a flow input socket.

Click on the `Play Graph` button to execute the graph.

Congratulations!  
You will now be able to see the output of your graph's log calls in the developer console of your browser.


# Events Nodes
<!-- TODO: Turn into separate pages with images -->

## OnButtonState Node
- **Node Type:** Event  
- **Name:** On Button State  
- **Description:** Trigger events based on the state of a specified button from various input sources (keyboard, mouse, gamepad, XR gamepad).  
- **Input Sockets:**  
  - Button: *Select the button to monitor.*  
- **Output Sockets:**  
  - Down: *Flow output for button press down.*  
  - Pressed: *Flow output for button press.*  
  - Touched: *Flow output for button touch.*  
  - Up: *Flow output for button release.*  
  - Value: *Float output representing button value.*  
- **Usage:** Create event-based logic responding to button state changes.

---

## OnQuery Node
- **Node Type:** Event  
- **Name:** On Query  
- **Description:** Trigger events based on query results for a specified combination of components within a 3D engine system.  
- **Input Sockets:**  
  - Type: *Select the query event type ("enter" or "exit").*  
  - System: *Choose the 3D engine system or system group for the query.*  
  - ComponentName N: *Specify component names for the query (N represents the index).*  
- **Output Sockets:**  
  - Flow: *Flow output for each matching entity.*  
  - Entity: *Entity output representing the entity that matches the query result.*  
- **Usage:** Create event-based logic responding to component combinations in a 3D engine system.

---

## OnCollision Node
- **Node Type:** Event  
- **Name:** Collision Events  
- **Description:** Trigger events based on collision occurrences within a 3D engine system.  
- **Input Sockets:**  
  - Entity: *Specify the entity for which collision events are monitored.*  
- **Output Sockets:**  
  - Flow: *Flow output for each collision event.*  
  - Entity: *Entity output representing the entity involved in the collision.*  
  - Target: *Entity output representing the target entity involved in the collision.*  
- **Usage:** Create event-based logic responding to collisions involving a specific entity in a 3D engine system.


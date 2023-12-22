# Entity Nodes
<!-- TODO: Turn into separate pages with images -->

## Get Entity in Scene Node
- **Node Type:** Query  
- **Name:** Get Entity in Scene  
- **Description:** Retrieve an entity in the current scene.  
- **Input Sockets:**  
  - Entity: *Select an entity from the scene.*  
- **Output Sockets:**  
  - Entity: *Outputs the selected entity.*  
- **Usage:** Obtain an entity from the scene for further operations.

---

## Get Local Client Entity Node
- **Node Type:** Query  
- **Name:** Get Local Client Entity  
- **Description:** Retrieve the local client entity within the engine.  
- **Input Sockets:** None  
- **Output Sockets:**  
  - Entity: *Outputs the local client entity.*  
  **Usage:** Access and work with the local client entity.

---

## Get Camera Entity Node
- **Node Type:** Query  
- **Name:** Get Camera Entity  
- **Description:** Obtain the camera entity in the engine.  
- **Input Sockets:** None  
- **Output Sockets:**  
  - Entity: *Outputs the camera entity.*  
- **Usage:** Access the camera entity for camera-related operations.

---

## Get Entity Transform Node
- **Node Type:** Query  
- **Name:** Get Entity Transform  
- **Description:** Retrieve the transformation (position, rotation, scale, matrix) of a specified entity.  
- **Input Sockets:**  
  - Entity: *Select the entity for transformation.*  
- **Output Sockets:**  
  - Position: *Outputs the position of the entity.*  
  - Rotation: *Outputs the rotation of the entity.*  
  - Scale: *Outputs the scale of the entity.*  
  - Matrix: *Outputs the transformation matrix of the entity.*  
- **Usage:** Obtain the transformation details of an entity in the scene.

---

## Add Entity Node
- **Node Type:** Action  
- **Name:** Add Entity  
- **Description:** Add a new entity to the scene, with optional parent entity and component.  
- **Input Sockets:**  
  - Flow: *Control script flow.*  
  - Parent Entity: *Choose the parent entity for the new entity.*  
  - Component: *Select a component to attach to the new entity.*  
  - Entity Name: *Provide a name for the new entity (optional).*  
- **Output Sockets:**  
  - Flow: *Control script flow.*  
  - Entity: *Outputs the newly created entity.*  
- **Usage:** Dynamically add entities to the scene during script execution.

---

## Delete Entity Node
- **Node Type:** Action  
- **Name:** Delete Entity  
- **Description:** Delete a specified entity from the scene.  
- **Input Sockets:**  
  - Flow: *Control script flow.*  
  - Entity: *Select the entity to delete.*  
- **Output Sockets:**  
  - Flow: *Control script flow.*  
- **Usage:** Remove entities from the scene when no longer needed.

---

## Set Entity Transform Node
- **Node Type:** Action  
- **Name:** Set Entity Transform  
- **Description:** Set the transformation (position, rotation, scale) of a specified entity.  
- **Input Sockets:**  
- Flow: *Control script flow.*  
  - Entity: *Select the entity to transform.*  
  - Position: *Set the new position for the entity.*  
  - Rotation: *Set the new rotation for the entity.*  
  - Scale: *Set the new scale for the entity.*  
- **Output Sockets:**  
  - Flow: *Control script flow.*  
- **Usage:** Modify the transformation of an entity in the scene.

---

## Get UUID Node
- **Node Type:** Function  
- **Name:** Get UUID  
- **Description:** Retrieve the UUID (Universally Unique Identifier) of a specified entity.  
- **Input Sockets:**  
  - Entity: *Select the entity for UUID retrieval.*  
- **Output Sockets:**  
  - UUID: *Outputs the UUID of the selected entity as a string.*  
- **Usage:** Obtain the UUID of an entity for various purposes.


# Custom Nodes
<!-- TODO: Turn into separate pages with images -->

## Play Video Node
- **Node Type:** Action  
- **Name:** Play Video  
- **Description:** Play a video on a specified entity within the scene.  
- **Input Sockets:**  
  - Flow: *Control script flow.*  
  - Entity: *Select the entity for video playback.*  
  - Media Path: *Provide the path to the video.*  
  - Autoplay: *Specify whether the video should autoplay (true or false).*  
  - Volume: *Set the volume for the video (0 to 1).*  
  - Play Mode: *Choose the play mode for the video (e.g., "normal").*  
  - Video Fit: *Select the fit mode for the video (e.g., "cover").*  
- **Output Sockets:**  
  - Flow: *Control script flow.*  
- **Usage:** Play videos on entities, adjusting playback settings as needed.

---

## Play Audio Node
- **Node Type:** Action  
- **Name:** Play Audio  
- **Description:** Play audio on a specified entity within the scene.  
- **Input Sockets:**  
  - Flow: *Control script flow.*  
  - Entity: *Select the entity for audio playback.*  
  - Media Path: *Provide the path to the audio file.*  
  - Autoplay: *Specify whether the audio should autoplay (true or false).*  
  - Is Music: *Indicate whether the audio is music (true or false).*  
  - Volume: *Set the volume for the audio (0 to 1).*  
  - Play Mode: *Choose the play mode for the audio (e.g., "normal").*  
- **Output Sockets:**  
  - Flow: *Control script flow.*  
- **Usage:** Play audio on entities, customizing playback options such as volume and autoplay.

---

## Get Avatar Animations Node
- **Node Type:** Query  
- **Name:** Get Avatar Animations  
- **Description:** Retrieve available avatar animations.  
- **Input Sockets:**  
  - Animation Name: *Choose an animation from the list.*  
- **Output Sockets:**  
  - Animation Name: *Outputs the selected animation name.*  
- **Usage:** Obtain a list of available avatar animations for further use.

---

## Play Animation Node
- **Node Type:** Action  
- **Name:** Play Animation  
- **Description:** Play animations on a specified entity.  
- **Input Sockets:**  
  - Flow: *Control script flow.*  
  - Entity: *Select the entity for animation.*  
  - Action: *Choose the action for the animation (e.g., "play", "pause", "stop").*  
  - Animation Speed: *Set the animation speed.*  
  - Animation Pack: *Provide the animation pack name.*  
  - Active Clip Index: *Specify the active clip index.*  
  - Is Avatar: *Indicate whether the animation is for an avatar (true or false).*  
- **Output Sockets:**  
  - Flow: *Control script flow.*  
- **Usage:** Control animations on entities, including actions like play, pause, and stop.

---

## Set Animation Action Node
- **Node Type:** Action  
- **Name:** Set Animation Action  
- **Description:** Set actions and properties for animations.  
- **Input Sockets:**  
  - Flow: *Control script flow.*  
  - Entity: *Select the entity with the animation.*  
  - Animation Speed: *Set the animation speed.*  
  - Blend Mode: *Choose the animation blend mode (e.g., "normal").*  
  - Loop Mode: *Select the loop mode for the animation (e.g., "once").*  
  - Clamp When Finished: *Specify whether to clamp the animation when finished (true or false).*  
  - Zero Slope at Start: *Indicate whether to use zero slope at the start (true or false).*  
  - Zero Slope at End: *Indicate whether to use zero slope at the end (true or false).*  
  - Weight: *Set the animation weight.*  
- **Output Sockets:**  
  - Flow: *Control script flow.*  
- **Usage:** Configure animation actions and properties for entities.

---

## Load Asset Node
- **Node Type:** Action  
- **Name:** Load Asset  
- **Description:** Load an asset and add a media component to an entity.  
- **Input Sockets:**  
  - Flow: *Control script flow.*  
  - Asset Path: *Provide the path to the asset.*  
- **Output Sockets:**  
  - Flow: *Control script flow.*  
  - Load End: *Signal that asset loading has completed.*  
  - Entity: *Outputs the entity with the loaded asset.*  
- **Usage:** Load assets dynamically and attach them to entities.

---

## Camera Fade Node
- **Node Type:** Action  
- **Name:** Camera Fade  
- **Description:** Fade the camera view to black or back to normal.  
- **Input Sockets:**  
  - Flow: *Control script flow.*  
  - To Black: *Specify whether to fade the camera to black (true or false).*  
- **Output Sockets:**  
  - Flow: *Control script flow.*  
- **Usage:** Create camera fade effects.


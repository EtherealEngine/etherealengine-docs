---
sidebar_label: "Assembly Menu"
---
import StudioOverview from './_studio_overview.md'

# 7. Assembly Menu
<StudioOverview />

## Files
- **Model**: Creates objects in the hierarchy. Drag a model from the assets folder into the URL box or drag assets directly from project files into the hierarchy
- **Volumetric**: Import volumetric files. Accepts DRCS, UVOL, or Manifest Files, links to cloud hosting
- **Video**: 2D plane accepts .mp4 .mkv .avi
- **Audio**: Import audio clips, .mp3, .flac, .ogg, .wav, .m4a

## Scene Composition
- **Ground Plane**: Create collision ground plane
- **Group**: Collection of models or assets
- **Asset Prefab**: Create prefabs from groups or objects that are saved to the assets folder. Saving requires specific naming: 'assetName'.xre.gltf
- **Collider**: Creates a collision ball, cuboid, capsule, or cylinder to be manually placement

## Interaction
- **Spawn Point**: A point where people will appear when they enter your scene
- **Portal**: A portal to teleport a player to a port in a different location

## Lights
- **Hemisphere Light**: A light which illuminates the scene from directly overhead
- **Point Light**: A light which emits in all directions from a single point
- **Directional Light**: Creates a light that emits evenly in a single direction
- **Ambient Light**: A combination of direct and indirect light, provides general lighting to all assets
- **Spot Light**: Creates a light that shines in a specific direction


## Scripting
Inserts code into the scene by creating a new Entity Component System based on the provided `.ts` file

## FX
- **Ocean**: Cube body of water
- **Particle Emitter**: Creates a particle emitter
- **Cloud**: Sprite based cloud volume
- **Water**: Creates a circular water surface with ripple effect
- **Spline**: Create and customize curves

## Misc
### E-commerce shop
Create a shop, choose product from dropdown, click select product, click away, click back, select product item(.glb), select variant, select product, click away, click back, object will populate scene

# Asset Import Pipeline

# Omniverse

# Unity

# Unreal

# Blender

## WARNING: This page is out of date

The simplest pipeline uses Blender & the Studio's inbuilt transformation tool. 

Scenes that contain colliders should have these colliders exported separately.
Visible meshes should not have collider metadata, instead a copy should be created.

The process of moving from Blender to iR Engine looks like the following:

1. Blend file is the source of truth
2. Export visible meshes from from blend file
3. Export collider meshes from blend file with Custom Properties
4. Import to editor
5. Optimize visible glb with transformation tool
6. Use final transformed visible glb & collider glb for live scene

## Collider Metadata

All fixed colliders should be a child of a separate root hierarchy.

The root object of the collider hiearchy must have `xrengine.collider.bodyType: Fixed`
Each collider must be a child of the root object with `shapeType: <shape>`

The currently supported shapes are as follows:

- Cuboid
- Ball
- Capsule
- Cylinder
- ConvexPolyhedron
- TriMesh

Other supported metadata for each collider is:

- friction: number
- restitution number
- collisionLayer: number
- collisionMask: number
- isTrigger: number

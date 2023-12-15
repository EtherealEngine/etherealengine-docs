---
sidebar_label: "Toolbar"
---
import StudioOverview from './_studio_overview.md'

# 1. Toolbar
<StudioOverview />

## 1.1. File Menu
Create new scenes, import files, and save or export existing scenes.  

## 1.2. Advanced
Toggle advanced options on Model or Avatar components.  
Add and remove components in the Properties tab.

## 1.3. Active Instances
Active Instances shown here

## 1.4. Transform Gizmo:  Scale, Rotate, Move
[ **Y** ] Scale  
[ **R** ] Rotate  
[ **T** ] Move  

## 1.5. World Space or Object Space Transform -  toggle to world or object
Sets your transform control to be oriented to the object(selection) or world.
- **World space**: Relates to the entire scene’s orientation.
- **Object space**: Relates to transforms made to a specific object _(your selection)_ in relationship to world space.

[ **Z** ] Toggle World space or Object(Selection) space

## 1.6. Toggle Transform Pivot
To use: shift select objects and enter transform mode *(Y, R, T)*

Pivot types:
- **Selection**: The center pivot of the final asset you selected in the sequence
- **Center**: The Pivot that sits at an equal distance between all selections
- **Bottom**: The Pivot that sits equally between all selections and at the bottom of your final selection in the sequence
- **Origin**: The Pivot mode to the world origin (0,0,0)  
_Note: It is recommended to use Toggle Transform in conjunction with the World/Object Space transforms_

[ **X** ] Toggle between Selection, Center, or Bottom  
[ **E** ] incrementally rotate around the Y axis, adopts the selected snapping degree value  

## 1.7. Grid Snapping (toggle)
Transform objects by a unit of measurement [0.1m, 0.125m, 1m, 4m, etc]  
Rotate objects by a specific amount of degrees [5°, 10°, 20°, 90°, etc]

[ **C** ] Toggle Snap Mode  
[ **E** ] incrementally rotate around the Y axis, adopts the selected snapping degree value  

## 1.8. Grid Visibility (toggle)
Set grid spacing by meters

## 1.9. Render Mode
How you view materials in the Engine  
_(Unlit, Lit, Shadows, Wireframe, Normals)_

## 1.10. Preview Scene
Spawns you into the scene  

## 1.11. Status (toggle)
Show stats about the scene and gives you a clue as to how optimized your scene is
- **Memory**: Geometries, Textures
- **Render**: FPS, Frame Time, Calls(drawcalls), Triangles, Points, Lines

## 1.12. Helpers (toggle)
View hidden information about your scene, ie: colliders.

## 1.13. Node Helpers (toggle)
Helper geometry that helps components have visibility in the scene when inactive.

## 1.14. Take A Screenshot
Takes a screenshot of your scene at the current view

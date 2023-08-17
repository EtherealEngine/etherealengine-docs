# Ethereal Engine Studio


## UI Overview 


1. Toolbar
2. Scene and File Directory 
#3: Preview
#4: Viewport
#5: Hierarchy, Material Library, Node Graph
#6: Properties 
#7: Assembly Menu
#8: User Profile  
___________________________________________________________________________

#1 Toolbar	





1. File Menu
Create new scenes, import files, and save or export existing scenes.  



2: Advanced 
Toggle advanced options on Model or Avatar components. 
Add and remove components in the Properties tab 



3. Active Instances 
Active Instances shown here



4. Transform Gizmo:  Scale, Rotate, Move 
  [ Y ] Scale
 [ R ] Rotate
 [ T ] Move


5. World Space or Object Space Transform -  toggle to world or object 
Sets your transform control to be oriented to the object(selection) or world 
World space relates to the entire scene’s orientation
Object space (your selection) relates to transforms made to a specific object in relationship to the world space

[ Z ] Toggle World space or Object(Selection) space


6. Toggle Transform Pivot - modes: Selection, Center, Bottom, or Origin
To use, shift select objects, enter transform mode (Y, R, T), choose pivot type:
Selection:the center pivot of the final asset you selected in the sequence 
Center: a pivot that sits at an equal distance between all selections
Bottom: pivot that sits equally between all selections and at the bottom of your final selection in the sequence
Origin: sets pivot mode to the world origin (0,0,0)
*it is recommended to use the Toggle Transform in conjunction with the World/Object Space transforms

[ X ] Toggle between Selection, Center, or Bottom
[ E ] incrementally rotate around the Y axis, adopts the selected snapping degree value 


7. Grid Snapping (toggle)
Transform objects by a unit of measurement [.1 meters, .125 meters, 1 meter, 4 meters, etc]
Rotate objects by a specific degrees [5o,10o, 20o, 90o, etc]

[ C ] Toggle Snap Mode
[ E ] incrementally rotate around the Y axis, adopts the selected snapping degree value 


8. Grid Visibility (toggle)
Set grid spacing by meters



9. Render Mode
How you view materials in the Engine
(Unlit, Lit, Shadows, Wireframe, Normals)


10. Preview Scene 
Spawns you into the scene  


11. Status (toggle)

Show stats about the scene and gives you a clue as to how optimized your scene is
Memory: Geometries, Textures
Render: FPS, Frame Time, Calls(drawcalls), Triangles, Points, Lines



12. Helpers (toggle)
View hidden information about your scene, ie: colliders 


13. Node Helpers (toggle)
Helper geometry that helps components have visibility in the scene when inactive 


14. Take A Screenshot
Takes a screenshot of your scene at the current view



#2 Scene and File Directory 

Project Files
Contains all files associated with your project. 
.json files and various other file types in this menu are your project files and will show up automatically when you create a new scene.

Assets folder
Contains all assets you can import into your scene. When you use the Toolbar: File Menu to import files, they are delivered directly to the assets folder. To populate your scene simply drag them from the assets directly to your hierarchy. 
Tip: Import may create a transform offset
When some assets are loaded they automatically show up in the scene in the hierarchy and sometimes at an offset. Simply delete them from the hierarchy and re-drag them from your assets folder into your scene hierarchy to have them be set at home (0,0,0)


#3 The Preview Panel 
The preview panel allows you to preview certain files, currently supporting image, video and audio files 



#4 Viewport
The view of all things active inside your scene. 
Objects have the typical navigation controls
X = red 
Y = green 
Z = blue



#5 Hierarchy & Material Library
Hierarchy 
The scene Hierarchy contains all element currently in your scene (assets, lighting, items from the tool menu, etc) 
Material Library
Location of an assets materials and where you can select and edit them 

#6 Properties 
Where you can access and edit detailed information about objects in your scene.
Select an object in the Hierarchy to view its Properties. This panel supports editing and adding actions to objects, ie: keying transforms, turning on animation tracks, looping motion, and adding components to objects 

Model URL
Shows the location of an object in your scene hierarchy 


Using the Advanced Tab (toolbar)
By activating the advanced tab from the toolbar you are able to add specific components to assets in your scene adding data to the entity.
Explode objects that are imported as a collapsed group


Types of Components 


#7 Assembly Menu

Files
Model
Creates objects in the hierarchy. Drag a model from the assets folder into the URL box or drag assets directly from project files into the hierarchy
Volumetric
Import volumetric files. Accepts DRCS, UVOL, or Manifest Files, links to cloud hosting
Video
2D plane accepts .mp4 .mkv .avi
Audio
Import audio clips, .mp3, .flac, .ogg, .wav, .m4a

Scene Composition
Ground Plane
Create collision ground plane
Group
Collection of models or assets
Asset Prefab
Create prefabs from groups or objects that are saved to the assets folder. Saving requires specific naming: 'assetName'.xre.gltf
Collider
Creates a collision ball, cuboid, capsule, or cylinder to be manually placement

Interaction
Spawn Point
A point where people will appear when they enter your scene
Portal
A portal to teleport a player to a port in a different location

Lights
Hemisphere Light
A light which illuminates the scene from directly overhead
Point Light
A light which emits in all directions from a single point
Directional Light
Creates a light that emits evenly in a single direction
Ambient Light
A combination of direct and indirect light, provides general lighting to all assets
Spot Light
Creates a light that shines in a specific direction


Scripting
Inserts code into the scene by creating a new Entity Component System based on the provided .ts file

FX
Ocean
Cube body of water
Particle Emitter
Creates a particle emitter
Cloud
Sprite based cloud volume
Water
Creates a circular water surface with ripple effect
Spline
Create and customize curves

Misc
E-commerce shop
Create a shop, choose product from dropdown, click select product, click away, click back, select product item(.glb), select variant, select product, click away, click back, object will populate scene

#8 User Profile  
Your Ethereal Engine account settings and linked account information


The settings wheel icon allows you to turn up your scene resolution.
If you notice the scene looks blurry, go to the Graphics tab inside Settings and turn the Resolution tab all the way up.




Create a Project
Import Assets 
You can use the File menu to import assets or you can drag and drop them into the assets folder, when clicking and dragging notice a slight change in the color of the Engine, this signifies the engine is ready to ingest your file. 
Importing assets immediately creates them in the scene at an arbitrary location when imported via the viewport. It is recommended to delete that import and drag an asset directly from project files into the hierarchy to easily zero out your transforms.
Ethereal Engine accept the following file types

3D Models .glb, .gltf
Images .png, .tiff, .jpeg
Volumetric DRCS, UVOL, Manifest Files on the Cloud
Videos .mp4m, .mkv, .avi
Audio .mp3, .mpeg, .m4a
Save Project
In the File menu, click the save or save as button to save your scene 
Some projects require time to save so don't exit this window until a few minutes have passed
Edit Materials
Ethereal Engine supports a PBR workflow and Vertex Colors
PBR Workflow: 
Diffuse or Base Color Map 
Metalness Map
Roughness Map
Normal Map
Ambient Occlusion (AO) Map
*each of these loaded will represent one draw call, only use maps you absolutely need. You can drop the diffuse map and use our built in RGB color selector to save scene space.

Your asset materials are visible in the order below under the Material Library tab 
Material Library 
>Asset Name 
	>material name
	>material name
	>material name



Material Types:
MeshBasicMaterial	
This material is not affected by lights. 
https://threejs.org/docs/?q=meshba#api/en/materials/MeshBasicMaterial 			       


MeshStandardMaterial 
A standard physically based material, using Metallic-Roughness workflow.
https://threejs.org/docs/?q=meshstan#api/en/materials/MeshStandardMaterial



MeshMatcapMaterial
MeshMatcapMaterial is defined by a MatCap (or Lit Sphere) texture, which encodes the 			material color and shading.
MeshPhysicalMaterial
An extension of the MeshStandardMaterial, providing more advanced physically-based rendering
(added properties include: Clearcoat, Physically-based transparency, Advanced reflectivity, and Sheen)
MeshLambertMaterial
A material for non-shiny surfaces, without specular highlights.
MeshPhongMaterial 
A material for shiny surfaces with specular highlights.
MeshToonMaterial
A material implementing toon shading.
ShaderMaterial 
https://threejs.org/docs/?q=shadermat#api/en/materials/ShaderMaterial
ShadowMaterial 
https://threejs.org/docs/?q=shadow#api/en/materials/ShadowMaterial

Saving Changes
Anytime you make a change to a model, you need to save your change.
This includes edits to the Position, Rotation, Scale, Normals, UVs, Materials and Attributes. 
After making your edit, go to the hierarchy and re-select your asset, in the Properties tab, scroll to the bottom and click the Save Changes button. If you want to Save As, in the url just above the Save Changes button, you can manually edit the name at the end of the url and click Save Changes. You can find the new version of your .glbl in the assets folder. 

Tip: Convert .gltfs or .usdz to .glb format in the engine using this method
Compression 
The in-engine compression menu is available when you select the model you want to run compression on from the Hierarchy. Scrolling down inside of the Properties panel you can expand the Model Transform Properties Menu. 
There are three menus, gltF-Transform, Delete Attributes, Bake To Vertices.

gltF-Compression:
Runs compression on the models geometry and image textures. Default settings work well for most models.
The Image Format menu allows you to either choose JPG, KTX2, or PNG for the image’s compression format.
The Max Texture Size denotes the pixel scale of your image. Default settings downsize the textures to 1024 pixels x 1024 pixels
Press Optimize to run the compression



Delete Attributes:
Models occasionally are imported with an excess of attributes taking up unwanted space, to delete the extra, unnecessary data list the attributes here with a space in between each attribute listed


Bake To Vertices:
This tool bakes your texture to vertex color. By doing this we can eliminate the need for loading heavy images on some models. Vertex Baking transfers your PBR maps to the vertex of your model. We currently support diffuse, lightMap and emissive. 
*this method is for models that have a simple texture with either a single color or few details

Animations in Objects
Avatars
To turn on the animations of an imported model you would like to use as an avatar, in the Loop Animation tab you can select the animation track you wish to activate, “mixamo.com”.
Loop Animations: loop the motion tracks available on your avatar 
Checking ‘Is Avatar’ allows you to use the animations built into the engine on your Avatar. 


Animated Geometry
Loop Animations: loop the motion tracks available on your model

Skybox/Cubemap
The Skybox Button from the Tools Panel allows you to create a Skybox for your scene. 
You can choose between Color, Skybox, Cubemap, and Equirectangular
Color: basic color as the sky 
Skybox: cubemap that surrounds your scene giving the look of being in an environment
Equirectangular: sphere that surrounds your scene giving the look of being in an environment, recommended sources for equirectangular images are hdrihaven.com or 

Tip: HdriHaven has great free HDRI Resources
 


Importing individual models (.glb/.gltf & .usdz)
Import your model via the File Menu or drag and drop into the Viewport (when viewport changes color it is ready to ingest the file) 
With the model in your Hierarchy, select it and scroll down in its Properties tab. 
Re-name to your desired description with a .glb or .gltf extension. You can find your saved model in your Assets tab in the Project Files directory
scene should be determined by what your scene is composed of. Successful optimization is achieved by leveraging the appropriate use of detail per model. 
Converting Models to .glb (recommended)
Convert .gltf to a .glb (in browser)
Recommended to convert .gltf into .glbs for easier importing 
https://glb-packer.glitch.me/
https://cartmagician.com/tools/3d-to-AR-converter (paid)
Convert .fbx to .glb (app)
https://github.com/facebookincubator/FBX2glTF
Convert .usd to .gltf (in browser)
https://products.groupdocs.app/conversion/usd-to-gltf


Using SampleStandardMaterial to enhance projects
Custom settings for Glass, Plastic, Glow & Metal are provided below

For the MeshStandardMaterial
(re-create values below to simulate materials on your geometry)
https://threejs.org/docs/?q=meshstan#api/en/materials/MeshStandardMaterial


 Glass		             Plastic	               Glow			      Metal


Tip: Exporting assets for basic materials
It is not required to have a texture map on all assets in 3D and it is recommended to use Standard Materials as often as possible. We recommended using basic materials for all basic metal, glass, emissive, and plastic assets (follow the sample material set-up above). You must denote which assets will have Standard Materials before you import your .glb to the engine. It is recommended to simply drag a native material from your chosen DCC or game engine prior to export, correctly name the basic material before exporting the .glb. Names given before import are the names the engine will inherit.

Saving Your Project 

Save As or Save Scene can be found in the File Menu.
Allow the Engine a few minutes to save your file.
Tip: Change the view to create a thumbnail
You will be asked to create a thumbnail on Save which takes a screenshot from the current viewport view. Move your viewport to look at the desired view for your thumbnail before you click Save.

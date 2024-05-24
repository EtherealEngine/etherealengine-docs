# Scene Management
<!-- TODO: Extend this file into a full section (Scene Management) -->
## Creating a Scene
### Importing Assets
There are two ways to import files:
- Using the File menu to import them
- Drag and drop them into the assets folder
  Note: When clicking and dragging, a slight change in the color of the Engine signifies that the engine is ready to process your file.

Importing assets immediately creates an entity for them in the scene.  
They will be located at an arbitrary location when imported through the viewport.  
It is recommended to delete that import and drag assets directly from project files into the hierarchy. This is the easiest way to zero out your transforms.

The Engine can accept the following file types:
- **3D Models**: .glb, .gltf
- **Images**: .png, .tiff, .jpeg
- **Volumetric**: DRCS, UVOL, Manifest Files on the Cloud
- **Videos**: .mp4m, .mkv, .avi
- **Audio**: .mp3, .mpeg, .m4a

### Saving a Scene
In the File menu, click the save or save as button to save your scene.
Some projects require time to save so don't exit this window until a few minutes have passed.

## Editing Materials
iR Engine supports PBR workflow and Vertex Colors. The material properties supported are:
- Diffuse or Base Color Map
- Metalness Map
- Roughness Map
- Normal Map
- Ambient Occlusion (AO) Map

Note: Each of these loaded maps will represent one draw call. Only use maps you absolutely need.  
You can drop the diffuse map and use our built in RGB color selector to save scene space.

Your asset materials are visible in the order below under the Material Library tab:  
>Material Library 
- >Asset Name
	- >material name
	- >material name
	- >material name

### Material Types:
- [MeshBasicMaterial](https://threejs.org/docs/?q=meshba#api/en/materials/MeshBasicMaterial): A basic material that is not affected by lights.
- [MeshStandardMaterial](https://threejs.org/docs/?q=meshstan#api/en/materials/MeshStandardMaterial): A standard physically based material, using the Metallic-Roughness workflow.
- [MeshMatcapMaterial](https://threejs.org/docs/?q=shadow#api/en/materials/MeshMatcapMaterial): Defined by a MatCap (or Lit Sphere) texture, which encodes the material color and shading.
- [MeshPhysicalMaterial](https://threejs.org/docs/?q=shadow#api/en/materials/MeshPhysicalMaterial): An extension of the MeshStandardMaterial, providing more advanced physically-based rendering
  _(added properties include: Clearcoat, Physically-based transparency, Advanced reflectivity and Sheen)_
- [MeshLambertMaterial](https://threejs.org/docs/?q=shadow#api/en/materials/MeshLambertMaterial): A material for non-shiny surfaces, without specular highlights.
- [MeshPhongMaterial](https://threejs.org/docs/?q=shadow#api/en/materials/MeshPhongMaterial): A material for shiny surfaces with specular highlights.
- [MeshToonMaterial](https://threejs.org/docs/?q=shadow#api/en/materials/MeshToonMaterial): A material implementing toon shading.
- [ShaderMaterial](https://threejs.org/docs/?q=shadermat#api/en/materials/ShaderMaterial): A material that will use a custom shader along its surface.
- [ShadowMaterial](https://threejs.org/docs/?q=shadow#api/en/materials/ShadowMaterial): A material that can receive shadows, but otherwise is completely transparent.

## Saving Changes
Anytime you make a change to a model, you need to save your change.
This includes edits to the Position, Rotation, Scale, Normals, UVs, Materials and Attributes.
After making your edit, go to the hierarchy and re-select your asset, in the Properties tab, scroll to the bottom and click the Save Changes button. If you want to Save As, in the url just above the Save Changes button, you can manually edit the name at the end of the url and click Save Changes. You can find the new version of your .glbl in the assets folder.

> Tip: Convert .gltfs or .usdz to .glb format in the engine using this method

## Compression
The in-engine compression menu is available when you select the model you want to run compression on from the Hierarchy. Scrolling down inside of the Properties panel you can expand the Model Transform Properties Menu.
There are three menus, gltF-Transform, Delete Attributes, Bake To Vertices.

### glTF-Compression:
Runs compression on the models geometry and image textures. Default settings work well for most models.
The Image Format menu allows you to either choose JPG, KTX2, or PNG for the image’s compression format.
The Max Texture Size denotes the pixel scale of your image. Default settings downsize the textures to 1024 pixels x 1024 pixels
Press Optimize to run the compression

### Delete Attributes
Models occasionally are imported with an excess of attributes taking up unwanted space, to delete the extra, unnecessary data list the attributes here with a space in between each attribute listed

### Bake To Vertices
This tool bakes your texture to vertex color. By doing this we can eliminate the need for loading heavy images on some models. Vertex Baking transfers your PBR maps to the vertex of your model.  
We currently support diffuse, lightMap and emissive.  
_Note: This method is for models that have a simple texture with either a single color or very few details._

## Animations in Objects
### Avatars
To turn on the animations of an imported model you would like to use as an avatar, in the Loop Animation tab you can select the animation track you wish to activate, `mixamo.com`.
- Loop Animations: Loop the motion tracks available on your avatar.
- Is Avatar: Allows you to use the animations built into the engine with your Avatar.

### Animated Geometry
Loop Animations: loop the motion tracks available on your model.

## Skybox/Cubemap
The Skybox Button from the Tools Panel allows you to create a Skybox for your scene.
You can choose between Color, Skybox, Cubemap, and Equirectangular
- **Color**: basic color as the sky 
- **Skybox**: cubemap that surrounds your scene giving the look of being in an environment
- **Equirectangular**: sphere that surrounds your scene giving the look of being in an environment, recommended sources for equirectangular images are hdrihaven.com or

> Tip: [HDRi Haven](https://hdri-haven.com) has great free HDRI Resources
 
### Importing individual models (.glb/.gltf & .usdz)
1. Import your model via the File Menu or drag and drop into the Viewport (when viewport changes color it is ready to ingest the file).  
2. With the model in your Hierarchy, select it and scroll down in its Properties tab.  
3. Re-name to your desired description with a .glb or .gltf extension.  

You can find your saved model in the Assets tab.  
Successful optimization is achieved by leveraging the appropriate use of detail per model.

### Converting Models
_Note: It is recommended to convert .gltf into .glb for easier importing._

Convert .gltf to .glb (in browser)
- https://glb-packer.glitch.me/
- https://cartmagician.com/tools/3d-to-AR-converter (paid)

Convert .fbx to .glb (app)
- https://github.com/facebookincubator/FBX2glTF

Convert .usd to .gltf (in browser)
- https://products.groupdocs.app/conversion/usd-to-gltf

### Using `SampleStandardMaterial` to enhance projects
Custom settings for Glass, Plastic, Glow & Metal are provided below

For the [MeshStandardMaterial](https://threejs.org/docs/?q=meshstan#api/en/materials/MeshStandardMaterial)  
_(re-create values below to simulate materials on your geometry)_
| Glass | Plastic | Glow | Metal |
|-------|---------|------|-------|
|       |         |      |       |

#### Tips: Exporting assets for basic materials  
> It is not required to have a texture map on all assets in 3D and it is recommended to use Standard Materials as often as possible.
We recommended using basic materials for all basic metal, glass, emissive, and plastic assets _(follow the sample material set-up above)_.  

> You must indicate which assets will have Standard Materials before you import your .glb to the engine.  

> It is recommended to simply drag a native material from your chosen DCC or game engine prior to export, and correctly name the basic material before exporting the .glb file.  
> Names given before import are the names the engine will inherit.  

## Saving Your Scene
`Save As` and `Save Scene` can be found in the File Menu.
Allow the Engine a few minutes to save your file.

> Tip: Change the view to create a thumbnail  
> Move your viewport to look at the desired view for your thumbnail before you click `Save`.  
> You will be asked to create a thumbnail on Save which takes a screenshot from the current viewport view.  


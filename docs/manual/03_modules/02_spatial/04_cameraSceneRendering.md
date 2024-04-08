# Rendering Scenes

The `RendererComponent` defines the parameters for rendering a scene to render target (such as an HTML canvas or WebXR layer). 

Scenes are simply defined as entity hierarchies. The `SceneComponent` is used to specify which scene entities to render. Only the root of an entity hierarchy needs to be specified.

Once an entity as both of these components, only a `CameraComponent` is needed to actually render a scene. The camera provides a perspective from which to render the scene from. The CameraComponent specifies an ArrayCamera, which allows rendering one or more perspectives simultaneously.

Upon the `WebGLRendererSystem` running, it will aggregate the list of entities to render, and get the underlying objects from the GroupComponent into a flat list. This list is iterated, and pulls out a few extra parameters. The `EnvironmentMapComponent` specifies the environment map to use for meshes that do not have an environment map already specified. The `BackgroundComponent` specifies the skybox to render, either a Color, a Texture or a CubeTexture. The `FogComponent` specifies the fog parameters to use.

<!-- TODO
- Postprocessing
-->

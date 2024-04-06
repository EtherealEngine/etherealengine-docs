# Spatial Input & WebXR

## Supporting multiple input sources

Input can come from a variety of places. In non-immersive contexts, it usually comes from a gamepad, mouse & keyboard or screen touches. In immersive contexts, it comes from the viewer's 6DOF perspective, and a variety of device-specific extensions such as 6DOF controllers, hands, gamepads & potentially more.

Since this engine is immersive-first, the abstractions of easily unifying all these input sources is naturally to spatializing them where possible, and using WebXR and other web specifications to guide the API layers.

The first component to introduce is the `InputSourceComponent` which stores the input source information according to the WebXR `XRInputSource` interface, as well as generalized accessor for current button states and entity intersections.

If the input source is spatial, it will have a TransformComponent and `XRSpaceComponent`, which stores the spatial infromation about the source.

If the input source originates from a pointer (mouse or touch), it will store this information in an `InputPointerComponent`, which also stores a reference to the HTML canvas object it originated from.

During the input system phase, the ClientInputSystem calculates all the runtime information, such as transform and intersections for input sources. For each intersection, it also stores the intersecting input source entity on the first intersected entity if the `InputComponent` exists on that entity, which effectively specifies an entity is an input receiver. Input can be "captured" globally by an entity by mutating the `capturingEntity` property on `InputState`, which enforces that only that entity should receive input.
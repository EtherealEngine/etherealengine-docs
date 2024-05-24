# Overview
The `Hello World` tutorial has taught us how to work with and create the most minimal iR Engine programming example possible. But, as we are about to learn, there is a lot more to explore!

## Hello World
Lets review what we have achieved with our project. So far we:
- Imported some iR Engine's typescript modules in our file
- Created an entity, and gave it an `uuid` and a `name`
- Gave the entity the ability to:
  - Be visible on the screen with a `VisibleComponent`
  - Have Linear Transformations with a `TransformComponent`
- Defined the position of the sphere in the scene
- Gave the entity a `PrimitiveGeometryComponent` _(a Sphere)_
- Defined a Custom `Component` type
- Defined a `Query` to search for our Custom Component
- Locked our logic to only happen once with the `initialized` State variable contained inside our Custom Component.
- Defined a `System` and locked our logic behind its `execute` function
- Locked our logic to only trigger for the entities that match our `helloQuery` generator
- Added our project's code to the engine with the `xrengine.config.ts` configuration file

That's a lot!!!

## iR Engine: Basics
In this tutorial we will expand on our knowledge, and we will add these features to the source code of our project:
- Physics Properties: Gravity, Collision, Friction, etc
- Logic that happens every frame at specific intervals _(eg: every fixed-frame or every visual-frame)_
- State Management _(eg: our `initialized` variable, but better)_
- Input Management _(keyboard, mouse, touchpad, etc)_
- How to debug our code to search for errors
- Networked events and actions that can be shared between multiple devices

And, at the end of the tutorial, we will put everything together into a complete mini-game!

Lets not wait any longer and get started by adding [`Physics`](../physics) to our project.

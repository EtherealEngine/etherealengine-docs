# Turning entities into spatialized objects

## Transforms

The first concept to spatialize our entities is to introduce the `TransformComponent`. This stores the spatial information for our entity, its `position`, `rotation`, and `scale`. These properties are bitecs-proxified three.js math objects: a Vector3 for position, a Quaternion for rotation, and another Vector3 for scale.

There are two more properties, the `matrix` and `matrixWorld`, which are three.js Matrix4 properties. `matrix` stores this transform relative to its parent, and `matrixWorld` stores it relative to the absolute origin.

## Hierarchy

Our next component is the `EntityTreeComponent` which stores the parent/child relationships: a `parentEntity` entity and `children` array of entities. Changing either of these via setComponent will automatically update the parent and children entities to reflect this change.

To optimize upon traditional hierarchy based calculations, the `TransformSystem` automatically sorts an complete list of all spatial entities in order to utilize `bitecs'` SoA CPU caching to allow the javascript engine to calculate matrices as fast as possible.

## Physics

Physics is split into two systems.

The first is the `PhysicsSystem` which updates the ECS and physics bodies before & after simulation, as well running the simulation. Substeps can be configured via `PhysicsState`, and the simulation timestep can be configured via `ECSState`. Beyond this, the system has a few neat tricks, such as interpolating kinematic rigidbodies between substeps, and automatically populating & depopulating collision events into the `CollisionComponent`. 

The second is the `PhysicsPreTransformSystem` which has two responsibilities, teleporting rigidbodies & colliders if the `TransformComponent` has been mutated, and smoothly interpolating the transform of an entity between physics steps, such that it does not stutter relative to the device framerate.
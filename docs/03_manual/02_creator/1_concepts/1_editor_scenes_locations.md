# Studio & Locations

## Scene Studio

Navigating to `/studio` will show you the projects page, where you can open existing projects or create a new one.

Opening a project will route you to `/studio/<projectName>` where the project studio will load. From here, you can open a scene, which will route you again to `/studio/<projectName>/<sceneName>`

The scene consists of a list of 'nodes' which act as templates / prefabs. These are what you would normally expect in a scene studio, such as models, colliders and audio, but we also support a wide range of integrations, such as shopify, wordpress and even portals to let you traverse between worlds.

To save a scene with Ctrl+S or in the top left Hamburger menu.

## Locations & Instances

Locations can be thought of as instantiations of scene. This is how you connect your scene to a shared session.

Locations can be loaded via the `/location/<locationName>` route, where `locationName` is the name of the location. By default, the locations `default`, `apartment` and `sky-station` are added.

An **instance** is an individual session running at a location, in which users are connected together in real time. This allows the deployment to scale events and locations to potentially millions of concurrent users without having to support them all on a single instance. 

There are two types of instances: **world** instances and **media** instances. World instances handle the spatial objects in the scene, such as avatars, vehicles and grabbables. Media instances handle realtime audio, video and screenshare. 

Media instances can be tied to a location, or exist ephemerally as a group call, called parties.

Instances can also be customised with the 'matchmaker' functionality to create private rooms.

Adding a new location is done from `/admin/locations` route, and live instances can be viewed from `/admin/instances`.

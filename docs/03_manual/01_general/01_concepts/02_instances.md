# Instances & Locations

**Locations** can be thought of as instantiations of a scene.  
They allow scenes to be connected to a session that can be shared between multiple devices at the same time.

An **instance** is an individual session running at a location, in which users are connected together in real time. This allows the deployment to scale events and locations to potentially millions of concurrent users without having to support them all on a single instance. 

There are two types of instances:
- **World** instances: Handle the spatial objects in the scene.
  _(such as avatars, vehicles and grabbables)_
- **Media** instances: Handle realtime audio, video and screenshare.

Media instances can be tied to a location, or exist ephemerally as a group call (called `parties`).

Instances can also be customised with the `matchmaker` functionality to create private rooms.

Locations can be loaded via the `/location/<locationName>` route, where `locationName` is the name of the location.
Ethereal Engine always adds locations `default`, `apartment` and `sky-station` by default to new projects.

Adding a new location is done from the `/admin/locations` route, and live instances can be viewed from `/admin/instances`.


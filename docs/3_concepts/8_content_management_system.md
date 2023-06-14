# Content Management System

Static resources associate database entries with files in the storage provider. These files exist as a key value store, that the store provider creates a unix-like file system abstraction on top of (where folders are indicated by a forward slash `/`).

### DISCLAIMER:
Static resources are currently being rewritten as per the "New Implementation" section below

## New Implementation (in progress)

When installing a project, all scenes that include assets contained withing that project's `/assets` folder create a `static_resource` entry. This currently includes models, images, videos, audio & volumetric assets.

If a LODComponent is present, each of the variants is assigned a `static_resource_variant` entry.

Any files that have dependency files (such as `.gltf` => `.bin` or `.uvol` => `.mp4`) have each file assigned their own static resource entries associated via the `parentResourceId` relationship. (// todo, should we have a `static_resource_dependency` table instead?)

When in the editor, static resources outside of your own project (external or in another project) are treated as read only via project based scopes.

When using assets external to the open project, a warning “This file is not in your project, do you want to add it?” is present on the input field. Clicking it opens a file browser modal that moves static resource to the open project.

Upon uploading a file a project, the user will be asked if they want to add it to the project or to temp.

Upon saving a scene with temp files, a modal will appear with a preview and checkbox for each asset to copy to the project.

Projects automatically clean up their old files when the builder runs, so users don’t need to worry about manually handling them.


## Old Implementation

There are two main top level folders, `static-resources` and `projects`.

Projects are a special case, and have their own path. These are all the installed projects to the engine, with each project being a copy of the project's repository.

Static resources are for all static resources not associated with a project, such as avatars and other uploaded files.

Avatars follow a structure of `/static-resources/avatars/public` for all public avatars and `/static-resources/avatars/<userID>` where `<userID>` is the user's userID.

Uploaded files will follow the structure of `/static-resources/<resourceType>` where `<resourceType>` is the type of the resource, (such as model, video or audio).


# Static Resources

Static resources associate database entries with files in the storage provider. These files exist as a key value store, that the store provider creates a unix-like file system abstraction on top of (where folders are indicated by a forward slash `/`).

## File structure

There are two main top level folders, `static-resources` and `projects`.

Projects are a special case, and have their own path. These are all the installed projects to the engine, with each project being a copy of the project's repository.

Static resources are for all static resources not associated with a project, such as avatars and other uploaded files.

Avatars follow a structure of `/static-resources/avatars/public` for all public avatars and `/static-resources/avatars/<userID>` where `<userID>` is the user's userID.

Uploaded files will follow the structure of `/static-resources/<resourceType>` where `<resourceType>` is the type of the resource, (such as model, video or audio).


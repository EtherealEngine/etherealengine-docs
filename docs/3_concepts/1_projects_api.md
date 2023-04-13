# Projects

Projects are folders that contain all your custom code, assets and scenes. They
are version controlled using git & github, and can be installed to any deployment
with a single click. (more on that in the [next chapter](./3_editor_scenes_locations.md))

Pictured below is an example of 4 projects installed. By default, only the 
`default-project` is installed, which in a production environment is read only.
You can find the default project under `/packages/projects/default-project/`

In a production environment, the builder process will install all projects
according to the `project` database table and will download files from the
storage provider. In a local development environment, the local file system is
always the source of truth. Any project folders added or removed from the file
system will be automatically added or removed from the database. This is to
ensure there is no accidental loss of data, as these project folders are all git
repositories.

![](./images/projects-folder.png)

## File Structure

Projects have a few conventions.

- `assets/` is where files uploaded from the editor will be uploaded to

- `src/` is where code assets can be served from

- `tests/` is where test files can be run

- `sceneName.scene.json` is a scene file

- `sceneName.thumbnail.png` is an auto-generated scene thumbnail file

- `xrengine.config.ts` the project configuration, where client routes, database 
  models, feathers services and the project thumbnail can be defined

A project must also have a package.json to provide custom dependencies, and to define
the project name, project version, and Ethereal Engine version it is known to work with.

Systems imported from a scene MUST have their filename end with `System.ts` and be in the `/src/systems` folder.
This is to optimize vite's code-splitting bundling process, as each potentially dynamically
importable file will result in a new bundle with it's own copy of all of it's import dependencies.

`@etherealengine/*` monorepo dependencies will be symlinked and not needed, but some
package managers (such as pnpm) require these to be defined. If so, they should
be defined in `peerDependencies` and kept up to date with the current engine version.

## Config

The ethereal engine config file has the following options:

```ts
export interface ProjectConfigInterface {
  onEvent?: string
  thumbnail?: string
  routes?: {
    [route: string]: {
      component: () => Promise<{ default: (props: any) => JSX.Element }>
      props?: {
        [x: string]: any
        exact?: boolean
      }
    }
  }
  webappInjection?: () => Promise<{ default: (props: any) => void | JSX.Element }>
  worldInjection?: () => Promise<{ default: () => Promise<void> }>
  services?: string
  databaseSeed?: string
  settings?: Array<ProjectSettingSchema>
}
```

### Hooks
The `onEvent` property is a relative path string that points to a file which 
must expose an object with properties as follows:

```ts
export interface ProjectEventHooks {
  onInstall?: (app: Application) => Promise<any>
  onLoad?: (app: Application) => Promise<any>
  onUpdate?: (app: Application) => Promise<any>
  onUninstall?: (app: Application) => Promise<any>
  /**
   * get oEmbed for active routes that match URL
   * return that project's onOEmbedRequest()
   * if null, return default
   */
  onOEmbedRequest?: (app: Application, url: URL, currentOEmbed: OEmbed) => Promise<OEmbed | null>
}
```

These functions are called when the project they belong to are installed, 
updated (such as scenes saved) or uninstalled respectively. This is used in the 
default ethereal engine project to install the default avatars. 
See `/packages/projects/default-project/projectEventHooks.ts`.

### Thumbnail

This is a URL to a thumbnail for the project.

### Routes

Routes enable users to customise the various URL paths of their website 
utilising dynamic loading of modules. The key of each object represents the path 
(with leading forward slash included) while the value represents a react 
component object which gets wrapped in `React.lazy()` and a props object which 
passes options into the react-dom-router Route component corresponding to the route.

### Webapp Injection
Webapp injection allows logic to be run on all pages, loaded before any routes 
are loaded. This will soon be extended to allow easy stylesheet injection and 
other configurables of the webapp.

### World Injection

World injection allows logic to be run every time a new world is created, 
currently only when the engine is initialised. This is loaded on all instances 
of the engine, such as a location and the editor. An example use case of this 
would be registering custom scene loader and editor prefabs.

### Services

The `services` property is a relative path that points to a file which must 
return type `((app: Application) => Promise<any>)[]` which is run on all 
instanceservers and api servers at startup. This allows users to expose custom 
Feathers services, or whatever other functionality they made need.

### Database Seeding

The `databaseSeed` property is a relative path that points to a file which must 
return type `ServicesSeedConfig` from `../packages/common/src/interfaces/ServicesSeedConfig.ts`
which is run when the database seeder is run. This can be useful for setting 
custom locations, which can be seen in the 
[Ethereal Engine demo project](https://github.com/etherealengine/demo-etherealengine-project).

### i18n

Internationalization can be added using the pattern `./i18n/<language>/<namespace>.json`. An example of the format can be found in [the base i18n files](https://github.com/etherealengine/etherealengine/tree/dev/packages/client-core/i18n).

# Documentation

- [Why are we building Ethereal Engine?](./docs/00_overview/00_startHere.md)
- [Installation instructions](./docs/03_manual/04_host/01_installation/00_intro.md)
- [Projects API](./docs/03_manual/03_developer/01_projectsOverview.md)
- [Scene Editor, Locations and Instances](./docs/03_manual/02_creator/01_concepts/)
- [Entity Component System Overview (ECS)](./docs/03_manual/03_developer/04_ecs.md)
- [Testing guide](./docs/03_manual/03_developer/07_testing/00_intro.md)
  - [Writing Reasonable & Testable Code](./docs/03_manual/03_developer/07_testing/01_reasonableCode.md)
  - [Test-driven Development](./docs/03_manual/03_developer/07_testing/02_testDrivenDevelopment.md)
- DevOps
  - [Database Migration](./docs/03_manual/04_host/03_devopsDeployment/04_databaseMigrations.md)
  - [Deploying Ethereal Engine on minikube](./docs/03_manual/04_host/03_devopsDeployment/02_minikube.md)
- See also [Ethereal Engine Wiki](https://github.com/etherealengine/etherealengine/wiki/)

## Contributing Guidelines: Documentation Repository
```md
# Markdown style guide

## General Markdown
- Dash `-` for bullet points and todo entries
- Asterisk `*` for bold
- Underscore `_` for italics
- End lines with double space `  ` for newline breaks within the same paragraph.
- Always assign a valid coding language to code blocks _(necessary for syntax highlighting)_.
- Always use `N. Text` for numbered bullet points.  (eg: 1. First point)
- Align newline subtext of bullet points to the text of the bullet point, so that the subtext becomes a part of the bullet point alignment rules.
- Align the first paragraph after a title right next to their title, without an empty newline in between the text and the title.
  (preferable, not mandatory. easier to pattern/block skim-read internally, and doesn't affect the rendered html)
  

## Docusaurus: Routing
- Always name files/folder with the format: `NN_theFile.md`
  - Prefix dictates file position.
  - Prefix always starts with 2digits+underscore (`NN_`, eg: 00_intro.md)
  - Use camelCase for file/folder names.
- Rely on folder/file names for document ordering.
  Note: Folders will (sometimes) need a `_category_.json` that defines a `"position": "NN"` property for them to be correctly ordered.
- Do not rely on `readme.md` files for declaring a folder's root file.
  - Use a `_category_.json` file for each new section, instead of `readme.md` files.
- The `00_` file of a folder should always contain introductory information about the section.
  (It replaces the use of `readme.md` files)
- Folders that do not need an introductory page should not add a `00_intro.md`, `_category_.json` or `readme.md` files
  When neither of these files exist, docusaurus will just make the category clickable/expandable with no routing redirection.

### Docusaurus: Metadata
- Never add a metadata header to files that do not need it.
  _Explicit per-file metadata is tedious, brittle and very difficult to maintain_
- Only give files the `sidebar_label` metatag when the title differs from the desired sidebar name. 
  _(eg: FAQ vs Frequently Asked Questions)_
- Only give files a `title` metatag when the first `# Title` header in the file differs from the desired file title.
- Always give a `# Title` to every file, and rely on it for file metadata.
- Use filename routing for identifying files
  - eg: Use `/path/to/file/intro` instead of `id: file.intro`
  - Only give files an `id` metatag when other methods of identification would not work.
- Never use explicit slugs, unless strictly necessary
  _(eg: when file path identification does not work correctly)_.
```

# Website Structure
<!-- TODO: Format this page properly -->

## Docusaurus Rules and Requirements
### Document Routing
- Always name files/folder with the format: `NN_theFile.md`
  - Prefix dictates file position.
  - Prefix always starts with 2digits+underscore (`NN_`, eg: 01_someFile.md)
  - Always use camelCase for file/folder names.
- Rely on folder/file names for document ordering.  
  Note: Folders will need a `_category_.json` that defines a `"position": "NN"` property for them to be correctly ordered.
- Use an `index.md` file for declaring a folder's root file.  
  We don't use the `readme.md` convention, and the `folderName.md` convention is tricky because of file-numbering for order sorting.
- The `index.md` file of a folder should always contain introductory information about the section.
- If the `index.md` file is only a dummy file:  
  Always add a `DocCardList` component to the page to make it behave like a `GeneratedIndex`
- Folders that do not need an introductory page should not add an `index.md` or `_category_.json` files  
  Reason: Docusaurus will make the category clickable/expandable with no routing redirection when neither of these files exist.

### Frontmatter
_(aka Document Metadata)_
- Never add a metadata header to files that do not need it.  
  _Explicit per-file metadata is tedious, brittle and very difficult to maintain_
- Only give files the `sidebar_label` metatag when the title differs from the desired sidebar name.   
  _(eg: FAQ vs Frequently Asked Questions)_
- Only give files a `title` metatag when the first `# Title` header in the file differs from the desired file title.  
- Always give a `# Title` to every file, and rely on it for file metadata.  
- Avoid giving pages a Frontmatter title tag different than its `# Title` unless strictly necessary.  
- Use filename routing for identifying files  
  - eg: Use `/path/to/file` instead of `id: file.intro`  
  - Only give files an `id` metatag when other methods of identification would not work.  
- Never use explicit slugs, unless strictly necessary  
  _(eg: when file path identification does not work correctly)_.  

---
sidebar_label: Components
---
# Working with Components
## Custom Components

<!--
TODO:
- [ ] Editor Node
- [ ] ... What else? List what's possible
-->

## `defineComponent` fields
### `onInit`
`(entity: Entity) => ComponentType<C>`  
**onInit** is a function that is called when **setComponent** is called on an entity that does not have the component in question.  
It takes an entity number, and should return an object with the initial values for the component.


### `onSet`
`(entity: Entity, component: ComponentType<C>, json: SerializedComponentType<C>) => void`  
**onSet** is a function that is called each time **setComponent** is called.  
It takes an `entity` number, a `component` object and a `json` object.  

This function provides a method for reactive data to be updated in batch _(such as deserializing scene data)_, which allows for a much tighter data flow.


### `onRemove`
`(entity: Entity, component: ComponentType<C>) => void`  
**onRemove** is a function that is called when **removeComponent** is called on an entity that has the component in question.  
It takes an `entity` number and a `component` object.  

This function is where any resources associated with the component should be cleaned.


### `toJSON`
`(entity: Entity, component: ComponentType<C>) => SerializedComponentType<C>`  
**toJSON** is a function that is called when **serializeComponent** is called on an entity that has the component in question.  
It takes an entity number and a component object.  

This function is where the component's data should be serialized _(eg: transforming a scene's data for saving to a file)_.

### `jsonID`
`string`  
The **jsonID** property is a string that is used to identify the component in json.  

It is used for identifying scenes when their data is serialized/deserialized.

### `reactor`
`function(props: { root: EntityRoot }) => void`  
The **reactor** property specifies a function that exists for the duration of this component instance.

This function is where any effects that depend on the component should be defined.

---
draft: true
---

# Queries
Queries are used to select entities that have a specific set of components.  
They are used to define the entities that a system will operate on.  

Queries are defined using the **defineQuery** function:
```ts
const query = defineQuery([TransformComponent, GroupComponent])

const entities = query() // returns an array of entity numbers
```

Queries also have enter and exit derivatives.  
They are used to define when a combination of components is added or removed from an entity.  
These variations are defined using the **defineEnterQuery** and **defineExitQuery** functions:
```ts
const query = defineQuery([TransformComponent, GroupComponent])

const allEntities = query()
const enterEntities = query.enter()
const exitEntities = query.exit()
```

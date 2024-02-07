# Creating a project
In this section we will create a simple project called `basic`.
:::note
You can find the original source at https://github.com/EtherealEngine/ee-tutorial-basic  
See the previous section for installation instructions.
:::

Ethereal Engine typescript projects usually have these pieces:
1. **Entities**: We use an ECS system where entities are a way that we represent game state.
2. **Components**: Entities are decorated with components that produce behaviors on entities.
3. **Systems**: Drive behavior over time
4. **WorldInjection**: Registers the project with Ethereal Engine

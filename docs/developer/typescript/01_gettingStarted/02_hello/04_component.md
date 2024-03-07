import { TechnicalNote } from '@site/src/components/TechnicalNote';
import { UnstyledDetails } from '@site/src/components/UnstyledDetails';

# Components
Ok, lets admit the truth.  
We have cheated with something else.  

You might have noticed already, but we are creating a Sphere for **every scene**.  
Open any other project with the engine, and you will see that our ball is also there!  
That's not good. Whoops.  

## Our Problem
We have setup our Sphere code to be simple and minimal.  
This is what we have done so far:  
- We created a file called `src/Hello.ts` that contains our code
- We connected our code to the engine with the project's configuration file
- We defined a system at module scope using `defineSystem`
- We never defined our Sphere as a Component  _(whoops)_
- We never added our Sphere Component to a specific Scene  
  _(well, we didn't have a Sphere Component, so we couldn't)_

These two last steps are the key to our problem.  
This happens because the engine will execute projects globally, but we are not restricting our code to be run only when requested.  

So our example, up until now, has been acting as if it was an extension to the Studio editor!  

<TechnicalNote>
A more technical description of our problem is that our example is not using the engine API properly.   
Execution of projects is global and meant to be data oriented.  
But the data we’re relying on in our example is created within the project, instead of being triggered by actions from our users.  
</TechnicalNote>

## Our Solution
The proper way to add our simple Sphere would be to lock our logic behind a custom Scene Component.  
That way, when a component is added to an entity, the system can be activated through a query.  

Solving this correctly will require us to use all of these new concepts:
- Defining a Custom Component
- Defining a Query for our Component
- Manage our `initialized` variable from inside our Component
- Connect our Sphere such that it is loaded only for a specific Scene

This section is quite complex, and we are going to properly explore all of these concepts in the following tutorials. So, for now, the assignments are going to be very simple.  
We will leave the explanations for the [Ethereal Engine Basics](/developer/typescript/basics) guide.  

## Creating a Custom Component {#create}
You can probably already guess the name of the function we are going to use next.  
The function for **defining a Component** is called...
<UnstyledDetails title="Spoiler">
`defineComponent`, which its part of the namespace... <UnstyledDetails title="Spoiler 2">`ECS`</UnstyledDetails>
</UnstyledDetails>

:::note
I will fill in the difficult parts for this assignment, as I don't expect you to be able to magically know these things just yet.  
We will do that on the next tutorial!  
:::

Here are your hints for completing this task:
```ts
// Define our component
export ... = ... ({
  name: ...,
  jsonID: 'EE_tutorial_hello',
  onInit: () => { return { initialized: false } }
})
```
<TechnicalNote title="Solution">

```ts
// Define our component
export const HelloComponent = ECS.defineComponent({
  name: 'ee.tutorial.HelloComponent',
  jsonID: 'EE_tutorial_hello',
  onInit: () => { return { initialized: false } }
})
```
Pay attention to the format of the `name` and `jsonID` fields.  
We haven't talked about this convention, but we will do so later on.  
</TechnicalNote>

You won't see any changes if you run the project as it is now.  
We haven't connected the Component to anything just yet!  

## State Management
We haven't talked much about State, and there is a lot to explain about it.  
We will have an entire section explaining state management in the [Ethereal Engine Basics](/developer/typescript/basics/state) guide.  

I will give you this one for free.  
This is the code that replaces our `initialized` variable from the previous page:  
```ts
// Check if we have already initialized our Sphere
let { initialized } = ECS.getMutableComponent(entity, HelloComponent)
if (initialized.value) continue
initialized.set(true)  // Set our initialized state to true
```
<TechnicalNote title="Note">
Note how we wrote `if (initialized.value)` instead of just `if (initialized)`.  
And we are modifying its value with `initialized.set(true)` instead of `initialized = true`.  
We will explain why this is the case in the [Ethereal Engine Basics: State](/developer/typescript/basics/state) section.  
</TechnicalNote>

This code will be very useful for our next few steps.  
Don't dwell too much on where to place it just yet. I will give you better instructions for doing that later when we need it.  

<TechnicalNote title="Hint">
Notice how there is a [`continue`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/continue) statement in the second line.  
[`continue`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/continue) is a keyword that only works inside of a loop _(eg: A `for` loop)_.  
Remember that for later.  
</TechnicalNote>

Lets see how we can lock our code to be run only under a specific condition.  


import { TechnicalNote } from '@site/src/components/TechnicalNote';

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

These two last steps are the key of our problem.  
The reason is because the engine will execute projects globally, but we are not restricting our code to be run only when requested.  
So our example, up until now, has been acting as if it was an extension to the Studio editor!  

<TechnicalNote>
A more technical description of our problem is that our example is not using the engine API properly.   
Execution of projects is global and meant to be data oriented.  
But the data we’re relying on in our example is created within the project, instead of being triggered by actions from our users.  
</TechnicalNote>

## Our Solution
The proper way to add our simple Sphere would be to lock our logic behind a custom Scene Component.  
That way, when a component is added to an entity, the system can be activated through a query.  


## Creating a Custom Component

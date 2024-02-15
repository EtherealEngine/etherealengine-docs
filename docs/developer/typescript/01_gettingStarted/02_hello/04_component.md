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

## Our Solution
The engine will run whatever code we send from our file as if it was part of the engine itself.

The core issue is that our example is not using the engine API properly.   
The execution of projects is global and meant to be data oriented.
But the data we’re relying on in the example is created within the project, instead of by actions from our users.
Our example, up until this point, is acting as if it was part of the Studio editor!

The proper way would be to lock our logic behind a component.  
What we should be doing, instead, is to create a custom Scene Component.  
That way, when a component is added to an entity, the system can be activated through a query.

# Writing Reasonable & Testable Code

Writing tests for code is one thing, but writing testable code is another!  
Testable code comes from abstracting control flows and operations on data with functions in order to avoid side effects and reduce, or at least have better control over, the mutation of state in your application.

In the **functional programming** (FP) paradigm, pure functions are functions which do not mutate any existing state of _any_ scope. Since we are not in a fully functional paradigm, a focus on these qualities of functions can be priceless:  
- [Stateless](https://en.wikipedia.org/wiki/State_(computer_science)) Functions: The function itself has **no memory of the past**
- [Referential Transparency](https://en.wikipedia.org/wiki/Referential_transparency): The function operates on its parameters, and **nothing else**  
  _(no global state access, etc)_


These types of functions may (arguably) mutate parameter state, but may only operate on the given parameters.
State residing outside of the scope of a stateless function should **never be depended on or mutated**. This will ensure that the function holds no inherent state of its own, and therefore will exhibit the behavior of being referentially transparent and [idempotent](https://en.wikipedia.org/wiki/Idempotence).

Idempotency is the quality of a function that can be executed several times without changing its output for a specific input. Idempotent functions can be thought of as mappings from one input to one output.

All of this combined makes functions extremely simple to reason about, very reusable, and easy to test!  
Even if it takes a little bit more effort to write functions in this way at first, it will save us a lot of time, energy and stress in the long run.

### Example
Here is an example of a function that does not exhibit referential transparency and it is not stateless.  
It is also not idempotent. Same input, different output!  
```js
let y = 3
const someFunction = x => {
  x += y
  y++
  return x
}

someFunction(3) // => 6
someFunction(3) // => 7
someFunction(3) // => 8
```
This first example is not good for reasonable code and will be very difficult to predict.

The same function written as a stateless and idempotent function with referential transparency would look like this:
```js
const someFunction = (data, x) => {
  x += data.y
  data.y++
  return x
}

someFunction({ y: 3 }, 3) // => 6
someFunction({ y: 3 }, 3) // => 6
someFunction({ y: 3 }, 3) // => 6
```
In contrast, this second function:
- Holds no inherent state of its own
- Does not operate on any data that was not passed into the function as explicit arguments
- Is idempotent: same input, same output  

The function is now very reasonable and easy to predict.

## Code Composition / Decomposition
We must now capture the process of decomposing a program into smaller pieces that are more reusable, more reliable, and easier to understand.
Then we can combine each individual piece to form an entire program that is easier to reason about as a whole.
FP tends to follow this fundamental principle.

FP falls under the umbrella of declarative programming paradigms:  
It expresses a set of operations without revealing how they’re implemented or how data flows through them.

Unlike imperative programming, declarative programming separates program description from evaluation. It focuses on the use of expressions to describe what the logic of a program is without necessarily specifying its control flow or state change.

These two paradigms can be used together to form powerful and extremely testable functions and compositions which support a sturdy codebase. Write functions imperatively, then compose them together declaratively!

### Example
Using the previous unit/integration test examples, lets see what the algorithm would look like when written imperatively:
```js
const algorithm = x => {
  x += 2  // first, add two
  x *= 3  // then, multiply by three
  x /= 2  // finally, divide by two
  return x
}
```

Lets rewrite the same function, as demonstrated before, but this time in a declarative way:
```js
const addTwo = x => x + 2
const multThree = x => x * 3
const halve = x => x / 2

const algorithm = pipe(addTwo, multThree, halve) // The `pipe` function is standard in FP

algorithm(4) // => 9
```

As you can see, the imperative function has no reusable parts, but the declarative version does!  
This is a simple example but, in larger-scale functions and systems, this simple distinction can be a powerful tool in writing reasonable, testable and reusable code.  

Bonus: The code is now _self documenting_. No need for comments, just pure and self-descriptive functions!


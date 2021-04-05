# Data Module Pattern Project

A small project to try to use data-* attributes to bind raw HTML with Javascript to create dynamic behaviour.

## Logic

Any element may have a "data-module" attribute that informs which module will be used with that element, which is simple a javascript function that accepts the element and add custom behaviour using javascript.

A module is nothing more than a function that follows this description:

```javascript
export default function moduleName(el, props) {
  /**Attach events and append children on el here */
  
  /** 
    Return a cleanup function that will be used to remove any code that must be cleaned up, i.e., event listeners.
  */
  return () => {}
}
```

When the application starts, we search for any element that has a data-module described, find which module function will be used using a look-up dictionary (that could be created dynamically), and invoke the function with the element. Any other data-* attribute that was added to the element with data-module will be passed as a attribute in a object that will be given in the module function as second argument (props).

Example:

```html
<li
  data-module="todo"
  data-id="1"
  data-done="false"
  data-text='"Remember to do it"'
></li>
```

Will invoke todoModule in the element passing this object as props:

```javascript
{
  id: 1,
  done: false,
  text: 'Remember to do it'
}
```

## Motivation

I find myself time to time trying to add javascript to a page without using Vue/React or some other framework/lib, just to try to understand why we use such tools. So this is a small attempt to show that to sprinkle dynamic behaviour into a raw HTML isn't exactly necessary to use a full blown solution. Of course, a lot of edge case situations are not considered in this example, nor it is performant, since the entire todos list is removed from the HTML, you have to invoke your own update to update the UI. So remember, **this is not production ready code, it should not be used in your site wihotut knowing the implication that it may cause, so please, do go around throwing your solution away for a "more vanilla style" solution just because.**

## Inspiration

[This amazing article](https://www.viget.com/articles/how-does-viget-javascript/) by [Leo Bauza](https://www.viget.com/about/team/lbauza)

## Decla - declarative apps framework

**Decla.js** is game changing frontend framework of 2021!
Everything you like and ever wanted - writing fast, superlight, functional and simple web apps. Common packages out of the box, bunch of examples and tutorials, fastest growing framework community.

***

Briefly before we begin, Decla components are pure functions, they don't create any side effects, instead they return declarative structures to describe side effects. So for example, instead of returning explicit vdom, they return declarations of dom effects to be taken. This allows handling any kind of side effect in appropriate way, making components design simple and predictable. Read more: [Decla.js introducing virtual effects](), [Decla concepts](docs/concepts.md)

One more thing to mention, Decla framework makes your frontend development fast and easy, 
so please hit the like button and share with friends to give it more juice!

### Simple Component and App

Creating component is as easy as to write a function, because Decla components are simple js functions:
```js
import { app, dom } from 'decla'

function Hello({ useTags }){
  const { h1, text } = useTags()
  
  return h1({}, [
    text('Hello World!')
  ])
}

app(Hello, {}, dom(document.body))
```
<details><summary>Same component returning "declarative effects structure"</summary><p>

```js
function Hello({ domEffect }){
  return [domEffect, { tagName: 'h1', attrs: {} },[
    [domEffect, { tagName: 'text', attrs: 'Hello world!' }]
  ]]
}
```
</p>
</details>

[Try it on CodePen](). It is recommended to use dom effects decorators like `useTags()` to make your code more readable and elegant. Read more: [Using hyperscript and jsx](docs/hyperscript-jsx.md)

### Stateless Component and App

Decla is state driven framework, meaning it re-renders app on any state change (initial state is passed while app is mounting, see example below). Decla components are stateless, they interact with app state using state decorators like `useState(getter,setter)`.

```js
import { app, dom } from 'decla'
import { intervalEffect } from '@decla/effects'

const Counter = ({ useState, useTags }) => {
  const [count, incCount] = useState(
    state => state,
    state => ++state
  )

  const { text } = useTags()

  return [
    count < 10 && [IntervalEffect, { 
      action: incCount,
      every: 1000, 
    }],
    text(count)
  ]
}

app(Counter, 0, dom(document.body))
```
[Try it on CodePen](). Decla takes care about cancelling and (re)starting effects depending on returned structure, this gives freedom and more advanced control over effects. Read more: [Writing custom effects](docs/custom-effects.md)


### Components composition and App

This expample shows how simple components composition can be, and how to handle user actions

```js
import { app, dom } from 'decla'

const RandomCat = ({ useTags, useProps }) => {
  const { say } = useProps()
  const { img } = useTags()

  return img({ 
    src: `https://cataas.com/cat/says/${say}` 
  })
}

const CatApp = ({ useState, useTags }) => {
  const [cats, incCats] = useState(
    cats => cats,
    cats => ++cats
  )

  const { input } = useTags()

  return [ 
    input({
      value: 'Get Random Cat!',
      onclick: incCats,
      type: 'button',
    }),
    [RandomCat, { 
      say: `Random-cat-${cats}`
    }]
  ]
}

app(CatApp, 0, dom(document.body))
```
[Try it on CodePen](). Decla differentiates components from effects by names, effect's name should always end with 'Effect' (this means effects cannot be declared as arrow functions), read more: [Decla API and structures](docs/effects/decla-api-and-structures.md)


### Congratulations! 
Now you are decla.js developer! Yes, that's easy! Slap the like button to let us know we are on the right direction, stay tuned and safe!


### Want some more of Decla.js?
- [Getting started](docs/getting-started.md) [TODO]
- [Installing decla](docs/installing.md) [TODO]
- [Main decla concepts](docs/concepts.md) [TODO]
- Using common packages [TODO]
  - [Using time effects](docs/effects/time.md)
  - [Using http effects](docs/effects/http.md)
  - [Using persistence effect](docs/effects/persistence.md)
  - [Using router component](docs/packages/router.md)
  - [Using hyperscript and jsx](docs/hyperscript-jsx.md)
  - [Server side rendering](docs/effects/ssr.md)
- [Writing custom effects](docs/custom-effects.md) [TODO]
- [Decla API and structures](docs/effects/decla-api-and-structures.md) [TODO]
- [Testing decla components/apps](docs/effects/testing-decla-componentsapps.md) [TODO]
- [Decla apps examples](docs/effects/real-world-examples.md) [TODO]
also take a look at:
- [Deep dive into declajs](docs/deep-dive-into-decla.md) [TODO]
- [Other tutorials](docs/effects/tutorials.md) [TODO]


### Community
We are open to any question, feedback or improvement, feel free to join our community channel discussions or file an github issue for some help.


### License 
[MIT](LICENSE.md)
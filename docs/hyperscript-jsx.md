## Using Hyperscript and JSX with Decla

As you already know Decla Components return declarative structures, building real world apps can makes those structures complicated, especially when they are nested or mixed. Out of the box Decla provides possibility to simplify those structures and make Components more readable.

### Hyperscript

Each Decla Component have access to hyperscript function through it's props and can use it to describe declarative structures in more compact and efficient way. Decla uses following hyperscipt `h` function syntax:
```js
h(name[, props[, child, ..., childN]]){ 
  /* return declarative structure */ 
}
```
- **name** is either string('tag' name of DomEffect) or any other Decla Component/Effect
- **props** Component/Effect props object or string (used with `text` tag)
- **child** child structure passed into Component or Effect

Example of Decla hyperscript usage:
```js
function Component(props, child){
  /* assumed AnyEffect and OtherComponent 
    are defined in outer scope */
  return h('div', {}, [
    h('span', { class: 'some-class' }, [
      h('text', 'Decla hypersript usage!')
    ]),
    h(AnyEffect, { prop: 'effect-prop' }),
    h(OtherComponent, { prop: 'prop' })
  ])
}
```
<details><summary>the same example returning raw declarative structures</summary>
<p>

```js
function Component({ DomEffect }, child){  
  /* assumed AnyEffect and OtherComponent 
    are defined in outer scope */
  return [DomEffect, { tagName: 'div', attrs: { class: 'some-class' }},[
    [DomEffect, { tagName: 'span', attrs: {} }, [
      [DomEffect, { tagName: 'text', attrs: 'Decla hypersript usage!' }]
    ]],
    [AnyEffect, { prop: 'effect-prop' }]
    [OtherComponent, { prop: 'prop' }]
  ]]
}
```
</p>
</details>

### Hyperscript with JSX

Since Decla provides jsx compatible hyperscript function by default, using jsx with Decla becomes a question of simple jsx compiler configuration, for example Babel config:
```json
{
  "plugins": ["@babel/plugin-transform-react-jsx", {
    "pragmaFrag": "h",
    "pragma": "h"
  }]
}
```
*pragmaFrag* - in case you want to use jsx 'Fragments'

Now jsx syntax compiled into hyperscript function calls and to make it properly work hyperscript function `h` should be provided into each jsx component: 
```jsx
function Component({ h }){
  /* <div></div> compiled into h('div', {})
  and to make it properly work we need `h`
  that is why it is required from props */
  return <div></div>
}
```

### Decla JSX Pro tip!
Using traditional functions as Decla Components recommended in general, also it allows to configure jsx compiler pragma property to `arguments[0].h` as result there is no need to require `h` function from each jsx component props anymore. Moreover, this makes Decla Components more valid (without any unnecessary imports, or ignoring unused vars). Win-win.
```jsx
// works, no need to require 'h'
function App({ useState }){
  const [counter, incCounter] = useState(
    state => state,
    state => ++state
  )
  
  return <div>
    <span>{ counter }</span>
    <input type="button" value="Count!" 
      onclick={ incCounter } />
  </div>
}

app(App, 0, dom(document.body))
```
[Try it on CodePen](https://codepen.io/sergey-shpak/pen/dyOVoYN)


### Relative topics
- [Declarative structures](), 
- [Decla API](),
- [Decla Components](),
- [Decla examples]()
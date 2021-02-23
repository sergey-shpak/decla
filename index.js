export { dom } from './packages/effects/dom.js'

export const compile = (nodes, getOptions) => 
  nodes.reduce((acc, node) => {
    if(Array.isArray(node) 
      && typeof node[0] === 'function' 
        && !node[0].name.endsWith('Effect'))
          node = node[0](getOptions(node[1]), node[2])

    return acc.concat(
      Array.isArray(node)
      ? typeof node[0] === 'function'
      ? Array.isArray(node[2]) && node[2].length
        ? [ [node[0], node[1], compile([node[2]], getOptions)] ]
        : [node]
      : compile(node, getOptions)
      : void 0
    )
  }, [])

// TODO: More efficient effects mapping algorithm?
export const patch = (prevTree, nextTree, context) => {
  prevTree = prevTree.map((prev, idx) => {
    const next = nextTree[idx]
    return prev && (!next || prev[0] !== next[0])
    ? prev[3](context)
    : prev
  })

  return nextTree.map((next, idx) => {
    const prev = prevTree[idx]
    if(next){
      const cancel = next[0](prev, next,
        (...args) => next[2] = patch(...args), context)
      next.push((ctx) => {
        patch(next[2], [], cancel(ctx))
      })
    }
    return next
  })
}

export const app = (src, state, ...helpers) => {
  const options = helpers.reduce((prev, helper) => 
    Object.assign(prev, helper), {})

  let tree = []
  src = [[src]]

  return (function render(){
    tree = patch(tree, compile(src, (props) => 
      Object.assign(Object.create(options), { 
        useState: (getter, setter) => [
          getter(state), (value) => 
            render(state = setter(state, value))
        ],
        useProps: () => props
      })
    ))
    
    return end => 
      render(src = [[end]])
  })()
}
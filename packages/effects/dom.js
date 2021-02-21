// TODO: sync dom updates with browser 
// using requestAnimationFrame/setTimeout

const eventHandler = function (event) {
  this.events[event.type](event)
}

const updateDomNode = (node, oldAttrs, newAttrs) => 
  node.nodeType === Node.TEXT_NODE
  ? oldAttrs.value !== newAttrs.value 
  ? (node.nodeValue = newAttrs.value, node)
  : node
  : Object.keys({ ...oldAttrs, ...newAttrs})
    .filter(attr => oldAttrs[attr] !== newAttrs[attr])
    .reduce((node, attr) => {
      if(attr.startsWith('on')){
        node.events = node.events || {}
        node.events[attr.slice(2)] = newAttrs[attr]

        if(!oldAttrs[attr]) 
          node.addEventListener(attr.slice(2), eventHandler)
        else if(!newAttrs[attr])
          node.removeEventListener(attr.slice(2), eventHandler)

      } else if(newAttrs[attr]) {
        node.setAttribute(attr, newAttrs[attr])
      } else if(!newAttrs[attr]){
        node.removeAttribute(attr)
      }
      return node
    }, node)

const createDomNode = (tag, attrs) => updateDomNode(
  tag !== 'text'
  ? document.createElement(tag, { is: attrs.is })
  : document.createTextNode(attrs.value),
  {}, 
  attrs
) 

export const dom = (parent) => {

  const DomEffect = (prev, next, propagate, context = { parent, idx: 0 }) => {
    let el

    if(prev && prev[1].tagName === next[1].tagName){
      el = context.parent.childNodes[context.idx]
      context.idx++
      updateDomNode(el, prev[1].attrs, next[1].attrs)
      propagate(prev[2], next[2], { parent: el, idx: 0 })
    } else {
      if(prev) prev[3](context)
      el = context.parent.insertBefore(
        createDomNode(next[1].tagName, next[1].attrs), 
        context.parent.childNodes[context.idx]
      )
      context.idx++
      propagate([], next[2], { parent: el, idx: 0 })
    }

    return (context) => {
      context && context.parent.removeChild(el)      
    }
  }

  const useTags = () => new Proxy({}, {
    get: (target, tagName) => 
      (attrs = {}, child = []) =>
        [DomEffect, { 
          tagName, 
          attrs: tagName === 'text'
          ? { value: attrs }
          : attrs
        }, child]
    })
    
  const h = (name, attrs, ...child) => (
    typeof name !== 'object' ? [
      typeof name === 'string'
      ? DomEffect
      : name,
      typeof name === 'string'
      ? { tagName: name, attrs: attrs || {} }
      : attrs || {},
      child.map(item => 
        typeof item === 'string'
        ? h(DomEffect, { tagName: 'text', attrs: { value: item } })
        : item      
      )
    ] : [attrs, ...child]
  )

  return { DomEffect, useTags, h }
}
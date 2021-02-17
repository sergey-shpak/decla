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

export const dom = (root) => {
  const domEffect = (prev, next, index, propagate, parent = root) => {
    const [, nextProps] = next || []
    const [, prevProps] = prev || []

    if(!prev){
      next[3] = parent.insertBefore(
        createDomNode(nextProps.tagName, nextProps.attrs), 
        parent.childNodes[index]
      )
    } else if(!next){
      parent && parent.removeChild(prev[3])
    } else if(prevProps.tagName !== nextProps.tagName){      
      next[3] = createDomNode(nextProps.tagName, nextProps.attrs)  

      prev[3].childNodes.forEach(node => 
        next[3].appendChild(node))

      parent.replaceChild(next[3], prev[3])
    } else {
      updateDomNode(next[3] = prev[3], prevProps.attrs, nextProps.attrs)
    }

    propagate(next ? next[3] : null)
    return next
  }

  const useTags = () => new Proxy({}, {
    get: (target, tagName) => 
      (attrs = {}, child = []) =>
        [domEffect, { 
          tagName, 
          attrs: tagName === 'text'
          ? { value: attrs }
          : attrs
        }, child]
    })

  return { domEffect, useTags }
}
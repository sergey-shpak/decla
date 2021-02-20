export const IntervalEffect = (prev, next, propagate, context) => {
  if(!prev){
    const id = setInterval(next[1].action, next[1].every)
    return () => clearInterval(id)
  } else return next[3]
}
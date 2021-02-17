export const IntervalEffect = (prev, next, index, propagate, context) => {
  if(!prev)
    next[3] = setInterval(next[1].action, next[1].every)
  else if(!next)
    clearInterval(prev[3])
  else next[3] = prev[3]
  return next
}
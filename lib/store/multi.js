const multi = (store) => (next) => (action) =>
  Array.isArray(action)
    ? action.map(next)
    : next(action)

export default multi

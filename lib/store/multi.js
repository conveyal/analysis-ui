const multi = ({dispatch}) => (next) => (action) =>
  Array.isArray(action)
    ? action.filter(Boolean).map(dispatch)
    : next(action)

export default multi

const multi = ({dispatch}) => (next) => (action) =>
  Array.isArray(action)
    ? action.map(dispatch)
    : next(action)

export default multi

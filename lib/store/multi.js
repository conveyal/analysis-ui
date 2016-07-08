export default function arrayMiddleware ({dispatch}) {
  return (next) => (action) => {
    return Array.isArray(action)
      ? action.filter(Boolean).map(dispatch)
      : next(action)
  }
}

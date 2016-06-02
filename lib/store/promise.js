function warn (error) {
  console.error(error.stack)
  throw error // To let the caller handle the rejection
}

const promise = ({dispatch}) => (next) => (action) =>
  typeof action.then === 'function'
    ? Promise.resolve(action).then(dispatch, warn)
    : next(action)

export default promise

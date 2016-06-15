function warn (error) {
  console.error(error.stack)
  throw error // To let the caller handle the rejection
}

// TODO: switch to FSA compliant promises

const promise = ({dispatch}) => (next) => (action) =>
  typeof action.then === 'function'
    ? Promise.resolve(action).then((result) => {
      if (result) dispatch(result)
      else console.error('%s promised action had no result', action)
    }, warn)
    : next(action)

export default promise

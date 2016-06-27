const debug = require('debug')('scenario-editor:store:promise')

function warn (error) {
  console.error(error.stack)
  throw error // To let the caller handle the rejection
}

function isPromise (a) {
  return a && typeof a.then === 'function'
}

// TODO: switch to FSA compliant promises

const promise = ({dispatch}) => (next) => (action) =>
  isPromise(action)
    ? action.then((result) => {
      if (result) dispatch(result)
      else debug('promised action had no result')
    }, warn)
    : next(action)

export default promise

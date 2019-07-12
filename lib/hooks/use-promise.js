import React from 'react'

/**
 * Pass a function that returns the promise to be executed.
 */
export default function usePromise(getPromise) {
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(undefined)
  const [value, setValue] = React.useState(undefined)

  // Will throw an error if hooks are used after unmount.
  React.useEffect(() => {
    let mounted = true

    getPromise()
      .then(v => mounted && setValue(v))
      .catch(e => mounted && setError(e))
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [getPromise])

  return [loading, error, value]
}

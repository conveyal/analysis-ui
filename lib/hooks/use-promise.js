import React from 'react'

/**
 * Pass a function that returns the promise to be executed.
 */
export default function usePromise(getPromise) {
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(undefined)
  const [value, setValue] = React.useState(undefined)

  React.useEffect(() => {
    getPromise()
      .then(setValue)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [getPromise])

  return [loading, error, value]
}

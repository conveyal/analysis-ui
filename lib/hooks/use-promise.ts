import {useEffect, useState} from 'react'

import LogRocket from '../logrocket'

function errorToString(e): string {
  const str = e.value || e.message || ''
  if (str === 'Failed to fetch')
    return 'Failed to contact server. Please make sure you have an active internet connection.'
  return str
}

/**
 * Pass a function that returns the promise to be executed.
 */
export default function usePromise(
  getPromise
): [boolean, void | string, void | any] {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<void | string>()
  const [value, setValue] = useState<void | any>()

  // Will throw an error if hooks are used after unmount.
  useEffect(() => {
    let mounted = true
    setLoading(true)

    getPromise()
      .then((v) => {
        if (mounted) setValue(v)
      })
      .catch((e) => {
        LogRocket.captureException(e)
        if (mounted) setError(errorToString(e))
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [getPromise])

  return [loading, error, value]
}

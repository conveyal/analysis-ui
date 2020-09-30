import {useEffect, useState} from 'react'

import LogRocket from '../logrocket'

function errorToString(e: unknown): string {
  if (typeof e === 'string') return e

  if (e instanceof Response) {
    if (e.status === 401 || e.status === 403) return 'Access denied.'
    if (e.status === 404) return '404: Object does not exist.'
    if (e.status === 500) return 'Server error.'
    return 'Application error'
  }

  if (e instanceof Error) {
    const v = e.message
    if (v === 'Failed to fetch') {
      return 'Failed to contact server. Please make sure you have an active internet connection.'
    }
    return v
  }

  return 'Unknown error'
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
      .catch((e: unknown) => {
        if (e instanceof Error) LogRocket.captureException(e)
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

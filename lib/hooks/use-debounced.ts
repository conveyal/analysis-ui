import debounce from 'lodash/debounce'
import {useEffect, useState} from 'react'

/**
 * Function should be immutable or created with `useCallback`.
 */
export default function useDebounced(fn, ms = 500) {
  const [originalFn, setOriginalFn] = useState(() => fn)
  const [debounced, setDebounced] = useState(() => debounce(fn, ms))

  // If the function changes, create a new one
  useEffect(() => {
    if (originalFn !== fn) {
      setOriginalFn(() => fn)
      setDebounced(() => debounce(fn, ms))
    }
  }, [fn, ms, originalFn])

  // Handle component unmounting and window closing
  useEffect(() => {
    window.addEventListener('beforeunload', debounced.flush)
    return () => {
      window.removeEventListener('beforeunload', debounced.flush)
      debounced.flush()
    }
  }, [debounced])

  return debounced
}

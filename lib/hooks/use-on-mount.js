import {useEffect} from 'react'

/**
 * An empty array as the second parameter causes the effect to run once on
 * component mount. A function returned by `fn` will be run on unmount.
 */
export default function useOnMount(fn) {
  useEffect(fn, []) // eslint-disable-line
}

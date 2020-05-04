import {useEffect, useState} from 'react'

const isServer = typeof window === 'undefined'

function getSize() {
  return {
    width: isServer ? undefined : window.innerWidth,
    height: isServer ? undefined : window.innerHeight
  }
}

/**
 * Get and update the window size.
 */
export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState(getSize)

  useEffect(() => {
    if (isServer) return

    function handleResize() {
      setWindowSize(getSize())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, []) // Empty array ensures that effect is only run on mount and unmount

  return windowSize
}

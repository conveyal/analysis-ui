import React from 'react'

export default function useInterval(callback, interval) {
  const savedCallback = React.useRef()

  // Remember the latest callback
  React.useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval
  React.useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (interval !== null) {
      const id = setInterval(tick, interval)
      return () => clearInterval(id)
    }
  }, [interval])
}

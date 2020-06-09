import React from 'react'
import Simplebar from 'simplebar-react'

import useWindowSize from 'lib/hooks/use-window-size'

/**
 * Sets the height to the window size to enable scrolling in the dock.
 */
export default function InnerDock({children, className = '', style = {}}) {
  const ref = React.useRef()
  const windowSize = useWindowSize()
  const [height, setHeight] = React.useState('100vh')
  React.useEffect(() => {
    if (ref.current && ref.current.el && windowSize.height) {
      setHeight(windowSize.height - ref.current.el.offsetTop)
    }
  }, [ref, windowSize])

  return (
    <Simplebar
      className={`InnerDock ${className}`}
      ref={ref}
      style={{...style, height}}
    >
      {children}
    </Simplebar>
  )
}

import React from 'react'

/**
 * Sets the height to the window size to enable scrolling in the dock.
 */
export default function InnerDock(p) {
  const el = React.useRef()
  const [style, setStyle] = React.useState({})
  const setHeight = React.useCallback(() => {
    if (el.current) {
      setStyle({
        height: window.innerHeight - el.current.offsetTop
      })
    }
  }, [el])

  React.useEffect(() => {
    window.addEventListener('resize', setHeight)
    setHeight()
    return () => window.removeEventListener('resize', setHeight)
  }, [el, setHeight])

  return (
    <div className={`InnerDock ${p.className || ''}`} ref={el} style={style}>
      {p.children}
    </div>
  )
}

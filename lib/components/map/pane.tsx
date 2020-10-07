import {CSSProperties} from 'react'
import {Pane} from 'react-leaflet'

const wrapperStyle: CSSProperties = {
  position: 'relative'
}

/**
 * Prevent overflow into other non-map components
 */
export default function InternalPane(p) {
  return (
    <div style={wrapperStyle}>
      <Pane {...p} />
    </div>
  )
}

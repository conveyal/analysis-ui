import lonlat from '@conveyal/lonlat'
import React from 'react'
import {Marker, Tooltip, useLeaflet} from 'react-leaflet'

/**
 * Handle map clicks and moving the marker.
 */
export default function AnalysisMap(p) {
  // Leaflet bug that causes a map click when dragging a marker fast:
  // https://github.com/Leaflet/Leaflet/issues/4457#issuecomment-351682174
  const [avoidClick, setAvoidClick] = React.useState(false)
  const leaflet = useLeaflet()
  const {markerPosition, setDestination} = p
  React.useEffect(() => {
    function onClick(e) {
      if (!avoidClick) setDestination(lonlat(e.latlng))
    }
    leaflet.map.on('click', onClick)
    return () => leaflet.map.off('click', onClick)
  }, [avoidClick, leaflet, setDestination])

  // Set the center point on load
  React.useEffect(() => {
    if (markerPosition) {
      if (!leaflet.map.getBounds().contains(markerPosition)) {
        leaflet.map.panTo(markerPosition)
      }
    }
  }, [markerPosition, leaflet])

  /**
   * Set hte origin and fetch if ready.
   */
  function dragMarker(e) {
    setAvoidClick(true)
    setTimeout(() => {
      setAvoidClick(false)
    }, 50)

    p.setOrigin(lonlat(e.target.getLatLng()))
  }

  return (
    <Marker
      draggable={!p.disableMarker}
      opacity={p.disableMarker ? 0.5 : 1.0}
      onDragEnd={dragMarker}
      position={markerPosition}
    >
      {p.markerTooltip && (
        <Tooltip permanent>
          <span>{p.markerTooltip}</span>
        </Tooltip>
      )}
    </Marker>
  )
}

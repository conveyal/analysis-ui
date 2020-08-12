import lonlat from '@conveyal/lonlat'
import {useCallback, useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import {Marker, Tooltip, useLeaflet} from 'react-leaflet'

import {setDestination} from 'lib/actions/analysis'
import useOnMount from 'lib/hooks/use-on-mount'

/**
 * Handle map clicks and moving the marker.
 */
export default function AnalysisMap({
  isDisabled,
  markerPosition,
  markerTooltip,
  setOrigin
}) {
  // Leaflet bug that causes a map click when dragging a marker fast:
  // https://github.com/Leaflet/Leaflet/issues/4457#issuecomment-351682174
  const [avoidClick, setAvoidClick] = useState(false)
  const dispatch = useDispatch()
  const leaflet = useLeaflet()

  useEffect(() => {
    function onClick(e) {
      if (!avoidClick) dispatch(setDestination(lonlat(e.latlng)))
    }
    leaflet.map.on('click', onClick)
    return () => leaflet.map.off('click', onClick)
  }, [avoidClick, dispatch, leaflet])

  // Set the center point on initial load
  useOnMount(() => {
    if (markerPosition) {
      if (!leaflet.map.getBounds().contains(markerPosition)) {
        leaflet.map.panTo(markerPosition)
      }
    }
  })

  /**
   * Set the origin and fetch if ready.
   */
  const dragMarker = useCallback(
    (e) => {
      setAvoidClick(true)
      setTimeout(() => {
        setAvoidClick(false)
      }, 50)

      setOrigin(lonlat(e.target.getLatLng()))
    },
    [setAvoidClick, setOrigin]
  )

  return (
    <Marker
      draggable={!isDisabled}
      opacity={isDisabled ? 0.5 : 1.0}
      onDragEnd={dragMarker}
      position={markerPosition}
    >
      {markerTooltip && (
        <Tooltip permanent>
          <span>{markerTooltip}</span>
        </Tooltip>
      )}
    </Marker>
  )
}

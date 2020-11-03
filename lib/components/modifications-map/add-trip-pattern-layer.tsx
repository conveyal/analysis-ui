import lonlat from '@conveyal/lonlat'
import React from 'react'
import {Marker, Polyline, useLeaflet} from 'react-leaflet'

import {NEW_LINE_WEIGHT} from 'lib/constants'
import colors from 'lib/constants/colors'
import getStops from 'lib/utils/get-stops'

import {
  getNewStopIconForZoom,
  getSnappedStopIconForZoom
} from '../map/circle-icons'
import DirectionalMarkers from '../directional-markers'

function getCoordinatesFromSegments(segments) {
  if (segments.length === 0 || segments[0].geometry.type === 'Point') return []

  // smoosh all segments together
  const coordinates = [].concat(
    ...segments.map(({geometry}) => geometry.coordinates.slice(0, -1))
  )
  // add last coordinate
  coordinates.push(segments.slice(-1)[0].geometry.coordinates.slice(-1)[0])

  return coordinates
}

function getIconsForZoom(z) {
  return {
    newStop: getNewStopIconForZoom(z),
    newSnappedStop: getSnappedStopIconForZoom(z)
  }
}

/**
 * A layer to display (not edit) an added trip pattern
 */
export default function AddTripPatternLayer(p) {
  const leaflet = useLeaflet()
  const [icons, setIcons] = React.useState(() =>
    getIconsForZoom(leaflet.map.getZoom())
  )

  React.useEffect(() => {
    function onZoom() {
      setIcons(getIconsForZoom(leaflet.map.getZoom()))
    }

    leaflet.map.on('zoomend', onZoom)
    return () => leaflet.map.off('zoomend', onZoom)
  }, [leaflet, setIcons])

  const {segments} = p
  const [directionalMarkers, segmentPolylines, stops] = React.useMemo(() => {
    const coordinates = getCoordinatesFromSegments(segments)
    return [
      [{geometry: {coordinates}}],
      coordinates.map(lonlat.toLeaflet),
      getStops(segments)
    ]
  }, [segments])

  return (
    <>
      <Polyline
        color={colors.ADDED}
        opacity={p.dim ? 0.5 : 1}
        positions={segmentPolylines}
        weight={NEW_LINE_WEIGHT}
      />
      {!p.bidirectional && !p.dim && (
        <DirectionalMarkers
          color={colors.ADDED}
          patterns={directionalMarkers}
        />
      )}
      {stops.map((s, i) => (
        <Marker
          icon={s.stopId ? icons.newSnappedStop : icons.newStop}
          key={`stop-${i}`}
          opacity={p.dim ? 0.5 : 1}
          position={s}
        />
      ))}
    </>
  )
}

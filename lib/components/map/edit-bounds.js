import lonlat from '@conveyal/lonlat'
import React from 'react'
import {Marker, Rectangle, withLeaflet} from 'react-leaflet'

import L from 'lib/leaflet'
import {fromLatLngBounds, toLatLngBounds} from 'lib/utils/bounds'
import reprojectCoordinates from 'lib/utils/reproject-coordinates'

// Zoom to bounds, but don't zoom in too much.
const DEFAULT_MAX_ZOOM = 13

/**
 * Edit bounds on a map. Input/outputs: `bounds { north, south, east, west }`
 */
export function EditBounds(p) {
  // On initial load, fit the bounds
  React.useEffect(() => {
    p.leaflet.map.fitBounds(toLatLngBounds(p.bounds), {
      maxZoom: DEFAULT_MAX_ZOOM
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Use leaflet utilities to generate a new set of boundaries
  const onDragEnd = oppositeCorner => e => {
    p.save(
      fromLatLngBounds(
        new L.LatLngBounds(
          lonlat.toLeaflet(reprojectCoordinates(e.target.getLatLng())),
          oppositeCorner
        )
      )
    )
  }

  if (!p.bounds) return null
  const leafletBounds = toLatLngBounds(p.bounds)
  const ne = leafletBounds.getNorthEast()
  const nw = leafletBounds.getNorthWest()
  const se = leafletBounds.getSouthEast()
  const sw = leafletBounds.getSouthWest()
  return (
    <>
      <Marker draggable onDragEnd={onDragEnd(ne)} position={sw} />
      <Marker draggable onDragEnd={onDragEnd(se)} position={nw} />
      <Marker draggable onDragEnd={onDragEnd(sw)} position={ne} />
      <Marker draggable onDragEnd={onDragEnd(nw)} position={se} />
      <Rectangle bounds={leafletBounds} weight={2} />
    </>
  )
}

// Expose Leaflet map to component
export default withLeaflet(EditBounds)

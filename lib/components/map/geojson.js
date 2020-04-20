import React from 'react'
import {GeoJSON} from 'react-leaflet'
import {v4 as uuidv4} from 'uuid'

/**
 * Wrap GeoJSON with a component that generates a new key when data changes so
 * that the underlying GeoJSON component gets remounted on data change.
 */
export default React.memo(function KeyedGeoJSON(p) {
  return <GeoJSON data={p.data || {}} key={uuidv4()} {...p} />
})

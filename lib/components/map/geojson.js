import React from 'react'
import {GeoJSON} from 'react-leaflet'
import uuid from 'uuid'

/**
 * Wrap GeoJSON with a component that generates a new key when data changes so
 * that the underlying GeoJSON component gets remounted on data change.
 */
export default React.memo(function KeyedGeoJSON(p) {
  return <GeoJSON key={uuid.v4()} {...p} />
})

import React from 'react'
import {Map as LeafletMap} from 'react-leaflet'

import MapboxGLLayer from '../map/mapbox-gl'

/**
 * A miniature map used in reports. Comes with a basemap out-of-the-box, and
 * additional react-leaflet elements may be added as children. The maps do not
 * include attribution, we put it on the report as a whole.
 */
export default function Map({bounds, children, height = 200, width = 720}) {
  return (
    <div style={{width: width, height: height}}>
      <LeafletMap
        bounds={bounds}
        zoomControl={false}
        attributionControl={false}
        keyboard={false}
        dragging={false}
        touchZoom={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        boxZoom={false}
      >
        <MapboxGLLayer />
        {children}
      </LeafletMap>
    </div>
  )
}

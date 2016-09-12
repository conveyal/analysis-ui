/**
 A miniature map used in reports.
 Comes with a basemap out-of-the-box, and additional react-leaflet elements may be added as children
 NB the maps do not include attribution, we put it on the report as a whole.
 */

import { pure } from 'recompose'
import React from 'react'
import {Map as LeafletMap, TileLayer} from 'react-leaflet'
import {Browser} from 'leaflet'

const MiniMap = pure(({width = 720, height = 200, bounds, children}) => {
  // TODO auto-rotate map when bounds are significantly north-south
  return <div style={{width: width, height: height}}>
    <LeafletMap bounds={bounds}
      zoomControl={false}
      attributionControl={false}
      keyboard={false}
      dragging={false}
      touchZoom={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      boxZoom={false}
      >
      <TileLayer
        url={Browser.retina ? process.env.LEAFLET_RETINA_URL : process.env.LEAFLET_TILE_URL}
        />
      {children}
    </LeafletMap>
  </div>
})
export default MiniMap

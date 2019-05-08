import React from 'react'
import {Map as LeafletMap, TileLayer} from 'react-leaflet'
import {Browser} from 'leaflet'

const TILE_URL =
  Browser.retina && process.env.LEAFLET_RETINA_URL
    ? process.env.LEAFLET_RETINA_URL
    : process.env.LEAFLET_TILE_URL

const LABEL_URL =
  Browser.retina && process.env.LABEL_RETINA_URL
    ? process.env.LABEL_RETINA_URL
    : process.env.LABEL_TILE_URL

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
        <TileLayer url={TILE_URL} />
        {LABEL_URL && <TileLayer url={LABEL_URL} />}
        {children}
      </LeafletMap>
    </div>
  )
}

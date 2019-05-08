import get from 'lodash/get'
import React from 'react'
import {connect} from 'react-redux'
import {Map as LeafletMap, TileLayer} from 'react-leaflet'

import Leaflet from 'lib/leaflet'
import selectModificationSaveInProgress from 'lib/selectors/modification-save-in-progress'
import selectModificationBounds from 'lib/selectors/modification-bounds'

// prefer to use canvas for rendering, improves speed significantly
// http://leafletjs.com/reference.html#global
// with this on we might be able to get rid of the stop layer
window.L_PREFER_CANVAS = true

const DEFAULT_ZINDEX = -10
const DEFAULT_ZOOM = 12
const MIN_ZOOM = 2
const MAX_BOUNDS = new Leaflet.LatLngBounds(
  new Leaflet.LatLng(90, -200),
  new Leaflet.LatLng(-90, 200)
)

const accessToken = process.env.MAPBOX_ACCESS_TOKEN
const mapboxConveyalUrl = 'https://api.mapbox.com/styles/v1/conveyal'
const tileUrl = `${mapboxConveyalUrl}/ciw804r3i000o2pw1ycgqvgfp/tiles/256/{z}/{x}/{y}`
const retinaUrl = `${mapboxConveyalUrl}/ciw804r3i000o2pw1ycgqvgfp/tiles/256/{z}/{x}/{y}@2x`

const TILE_URL = Leaflet.Browser.retina
  ? `${retinaUrl}?access_token=${accessToken}`
  : `${tileUrl}?access_token=${accessToken}`

function mapStateToProps(state, ownProps) {
  return {
    bounds: selectModificationBounds(state, ownProps),
    center: get(state, 'mapState.center'),
    disabled: selectModificationSaveInProgress(state, ownProps),
    zoom: get(state, 'mapState.zoom', DEFAULT_ZOOM)
  }
}

function Map(p) {
  return (
    <LeafletMap
      bounds={p.bounds}
      center={p.center}
      className={p.disabled ? 'disableAndDim' : ''}
      onClick={p.onClick}
      zoom={p.zoom}
      minZoom={p.minZoom || MIN_ZOOM}
      maxBounds={p.maxBounds || MAX_BOUNDS}
    >
      <TileLayer
        url={p.tileUrl || TILE_URL}
        attribution={process.env.LEAFLET_ATTRIBUTION}
        zIndex={p.zIndex || DEFAULT_ZINDEX}
      />

      {p.children}
    </LeafletMap>
  )
}

export default connect(mapStateToProps)(Map)

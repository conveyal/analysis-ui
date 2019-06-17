import get from 'lodash/get'
import React from 'react'
import {connect} from 'react-redux'
import {AttributionControl, Map as LeafletMap, ZoomControl} from 'react-leaflet'

import useRouteChanging from 'lib/hooks/use-route-changing'
import Leaflet from 'lib/leaflet'
import selectModificationSaveInProgress from 'lib/selectors/modification-save-in-progress'
import selectModificationBounds from 'lib/selectors/modification-bounds'

import MapboxGLLayer from './mapbox-gl'

// prefer to use canvas for rendering, improves speed significantly
// http://leafletjs.com/reference.html#global
// with this on we might be able to get rid of the stop layer
window.L_PREFER_CANVAS = true

const DEFAULT_ZOOM = 12
const MIN_ZOOM = 2
const MAX_BOUNDS = new Leaflet.LatLngBounds(
  new Leaflet.LatLng(90, -200),
  new Leaflet.LatLng(-90, 200)
)

function mapStateToProps(state, ownProps) {
  return {
    bounds: selectModificationBounds(state, ownProps),
    center: get(state, 'mapState.center'),
    disabled: selectModificationSaveInProgress(state, ownProps),
    zoom: get(state, 'mapState.zoom', DEFAULT_ZOOM)
  }
}

function Map(p) {
  const [routeChanging] = useRouteChanging()

  return (
    <LeafletMap
      attributionControl={false}
      bounds={p.bounds}
      center={p.center}
      className={p.disabled || routeChanging ? 'disableAndDim' : ''}
      maxBounds={p.maxBounds || MAX_BOUNDS}
      minZoom={p.minZoom || MIN_ZOOM}
      onClick={p.onClick}
      zoom={p.zoom}
      zoomControl={false}
      zoomDelta={0.5}
      zoomSnap={0.5}
    >
      <MapboxGLLayer />

      <AttributionControl position='bottomright' prefix={false} />
      <ZoomControl position='topright' />

      {!routeChanging && p.children}
    </LeafletMap>
  )
}

export default connect(mapStateToProps)(Map)

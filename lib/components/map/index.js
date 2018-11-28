// @flow
import lonlat from '@conveyal/lonlat'
import Leaflet from 'leaflet'
import get from 'lodash/get'
import * as React from 'react'
import {connect} from 'react-redux'
import {Map as LeafletMap, TileLayer} from 'react-leaflet'

import * as select from '../../selectors'
import type {LonLat} from '../../types'

type Props = {
  bounds: Leaflet.LatLngBounds,
  center: LonLat,
  children: React.Children,
  disabled: boolean,
  maxBounds: Leaflet.LatLngBounds,
  minZoom: number,
  onClick?: (SyntheticEvent<Leaflet.MouseEvent>) => void,
  tileUrl: string,
  zIndex: number,
  zoom: number
}

// prefer to use canvas for rendering, improves speed significantly
// http://leafletjs.com/reference.html#global
// with this on we might be able to get rid of the stop layer
window.L_PREFER_CANVAS = true

const DEFAULT_ZINDEX = -10
const DEFAULT_ZOOM = 12
const MIN_ZOOM = 2
const maxBounds = new Leaflet.LatLngBounds(new Leaflet.LatLng(90, -200), new Leaflet.LatLng(-90, 200))
const TILE_URL = Leaflet.Browser.retina && process.env.LEAFLET_RETINA_URL
  ? process.env.LEAFLET_RETINA_URL
  : process.env.LEAFLET_TILE_URL

function mapStateToProps (state, ownProps) {
  return {
    bounds: select.modificationBounds(state, ownProps),
    center: get(state, 'mapState.center'),
    disabled: select.modificationSaveInProgress(state, ownProps),
    zoom: get(state, 'mapState.zoom', DEFAULT_ZOOM)
  }
}

class Map extends React.PureComponent {
  static defaultProps = {
    tileUrl: TILE_URL,
    zIndex: DEFAULT_ZINDEX,
    minZoom: MIN_ZOOM,
    maxBounds: maxBounds
  }

  props: Props

  state = {
    center: this.props.center
  }

  componentWillReceiveProps (nextProps: Props) {
    if (!lonlat.isEqual(nextProps.center, this.props.center)) {
      this.setState({
        center: nextProps.center
      })
    }
  }

  render () {
    const p = this.props
    return (
      <LeafletMap
        bounds={p.bounds}
        center={this.state.center}
        className={p.disabled ? 'disableAndDim' : ''}
        onClick={p.onClick}
        zoom={p.zoom}
        minZoom={p.minZoom}
        maxBounds={p.maxBounds}
      >
        <TileLayer
          url={p.tileUrl}
          attribution={process.env.LEAFLET_ATTRIBUTION}
          zIndex={p.zIndex}
        />

        {p.children}
      </LeafletMap>
    )
  }
}

export default connect(mapStateToProps)(Map)

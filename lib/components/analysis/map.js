import lonlat from '@conveyal/lonlat'
import memoize from 'memoize-one'
import React from 'react'
import {GeoJSON, Marker, Rectangle, Tooltip} from 'react-leaflet'
import uuid from 'uuid'

import colors from 'lib/constants/colors'
import ModificationsMap from 'lib/containers/modifications-map'
import OpportunityDatasets from 'lib/modules/opportunity-datasets'
import {
  fromLatLngBounds,
  toLatLngBounds,
  reprojectBounds
} from 'lib/utils/bounds'

import DestinationTravelTimeDistribution from '../map/destination-travel-time-distribution'
import EditBounds from '../map/edit-bounds'
import Map from '../map'

const isochroneStyle = fillColor => ({
  fillColor,
  opacity: 0.65,
  pointerEvents: 'none',
  stroke: false
})

const mainIsochroneStyle = isochroneStyle(colors.PROJECT_ISOCHRONE_COLOR)
const compIsochroneStyle = isochroneStyle(colors.COMPARISON_ISOCHRONE_COLOR)
const staleIsochroneStyle = isochroneStyle(colors.STALE_PERCENTILE_COLOR)

const getMainIsochroneKey = memoize(() => uuid.v4())
const getCompIsochroneKey = memoize(() => uuid.v4())

export default class AnalysisMap extends React.Component {
  state = {}

  static getDerivedStateFromProps(props) {
    const isCurrent = props.displayedDataIsCurrent
    return {
      mainIsochroneKey: getMainIsochroneKey(props.isochrone, isCurrent),
      compIsochroneKey: getCompIsochroneKey(
        props.comparisonIsochrone,
        isCurrent
      )
    }
  }

  // Leaflet bug that causes a map click when dragging a marker fast:
  // https://github.com/Leaflet/Leaflet/issues/4457#issuecomment-351682174
  _avoidClick = false

  /**
   * Set the destination if a `DragEndEvent` has not occured too recently.
   */
  _clickMap = e => {
    if (!this._avoidClick) {
      this.props.setDestination(lonlat(e.latlng))
    }
  }

  /**
   * Set hte origin and fetch if ready.
   */
  _dragMarker = e => {
    this._avoidClick = true
    setTimeout(() => {
      this._avoidClick = false
    }, 50)

    this.props.setOrigin(lonlat(e.target.getLatLng()))
  }

  _setBounds = bounds => this.props.setBounds(fromLatLngBounds(bounds))

  render() {
    const p = this.props
    const s = this.state
    return (
      <Map onClick={this._clickMap}>
        <OpportunityDatasets.components.DotMap />

        <Rectangle
          bounds={reprojectBounds(toLatLngBounds(p.analysisBounds))}
          dashArray='3 8'
          fillOpacity={0}
          pointerEvents='none'
          weight={1}
        />

        <ModificationsMap />

        {p.isochrone && (
          <GeoJSON
            data={p.isochrone}
            key={s.mainIsochroneKey}
            style={
              p.displayedDataIsCurrent
                ? mainIsochroneStyle
                : staleIsochroneStyle
            }
          />
        )}

        {p.comparisonIsochrone && (
          <GeoJSON
            data={p.comparisonIsochrone}
            key={s.compIsochroneKey}
            style={
              p.displayedDataIsCurrent
                ? compIsochroneStyle
                : staleIsochroneStyle
            }
          />
        )}

        <Marker
          draggable={!p.disableMarker}
          opacity={p.disableMarker ? 0.5 : 1.0}
          onDragEnd={this._dragMarker}
          position={p.markerPosition}
        >
          {p.markerTooltip && (
            <Tooltip permanent>
              <span>{p.markerTooltip}</span>
            </Tooltip>
          )}
        </Marker>

        {p.displayedDataIsCurrent && p.destination && (
          <DestinationTravelTimeDistribution
            key={lonlat.toString(p.destination)}
            comparisonDistribution={p.comparisonDistribution}
            destination={p.destination}
            distribution={p.distribution}
            remove={p.removeDestination}
            setDestination={p.setDestination}
          />
        )}

        {p.showBoundsEditor && (
          <EditBounds bounds={p.analysisBounds} save={this._setBounds} />
        )}
      </Map>
    )
  }
}

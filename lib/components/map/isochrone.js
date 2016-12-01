import lonlng from 'lonlng'
import React, {Component, PropTypes} from 'react'
import {Marker} from 'react-leaflet'

import GeoJson from './geojson'

export default class Isochrone extends Component {
  static propTypes = {
    bundleId: PropTypes.string.isRequired,
    workerVersion: PropTypes.string.isRequired,
    fetchIsochrone: PropTypes.func.isRequired,
    isochroneLatLng: PropTypes.object.isRequired,
    isochrone: PropTypes.object,
    modifications: PropTypes.array.isRequired,
    remove: PropTypes.func.isRequired,
    scenarioId: PropTypes.string.isRequired,
    currentIndicator: PropTypes.string.isRequired,
    doingComparison: PropTypes.bool.isRequired,
    comparisonScenarioId: PropTypes.string,
    comparisonVariant: PropTypes.number,
    comparisonModifications: PropTypes.array,
    comparisonBundleId: PropTypes.string
  }

  render () {
    const {isochrone, isochroneCutoff, isochroneLatLng} = this.props
    return (
      <g>
        <Marker
          draggable
          onDblclick={this._handleDblclick}
          onDragend={this._handleDragend}
          position={isochroneLatLng}
          />
        {isochrone &&
          <GeoJson
            data={isochrone}
            key={`isochrone-${isochroneCutoff}-${lonlng.toString(isochroneLatLng)}`}
            style={{
              fillColor: '#2389c9',
              pointerEvents: 'none',
              stroke: false
            }}
            />}
      </g>
    )
  }

  _fetchIsochrone = (latlng) => {
    const {bundleId, fetchIsochrone, modifications, scenarioId, isochroneCutoff, currentIndicator, workerVersion, comparisonScenarioId, comparisonVariant, comparisonBundleId, comparisonModifications, doingComparison} = this.props

    // leave comparison params undefined unless we're doing a comparison
    const comparisonParams = doingComparison
      ? {
        comparisonScenarioId: `${comparisonScenarioId}_${comparisonVariant}`,
        comparisonModifications: comparisonModifications,
        comparisonBundleId: comparisonBundleId
      }
      : {}

    fetchIsochrone({
      bundleId,
      workerVersion,
      origin: latlng,
      modifications,
      scenarioId,
      isochroneCutoff,
      indicator: currentIndicator,
      ...comparisonParams
    })
  }

  _handleDragend = (e) => {
    this._fetchIsochrone(e.target._latlng)
  }

  _handleDblclick = (e) => {
    this.props.remove()
  }
}

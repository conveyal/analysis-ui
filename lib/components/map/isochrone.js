import lonlng from 'lonlng'
import React, {Component, PropTypes} from 'react'
import {Marker} from 'react-leaflet'

import GeoJson from './geojson'
import colors from '../../constants/colors'

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
    variantIndex: PropTypes.number.isRequired,
    currentIndicator: PropTypes.string.isRequired,
    comparisonInProgress: PropTypes.bool.isRequired,
    comparisonScenarioId: PropTypes.string,
    comparisonVariant: PropTypes.number,
    comparisonModifications: PropTypes.array,
    comparisonIsochrone: PropTypes.object,
    comparisonBundleId: PropTypes.string,
    isFetchingIsochrone: PropTypes.bool.isRequired
  }

  render () {
    const {isochrone, isochroneCutoff, isochroneLatLng, comparisonIsochrone, isFetchingIsochrone, comparisonInProgress} = this.props
    return (
      <g>
        <Marker
          draggable
          onDblclick={this._handleDblclick}
          onDragend={this._handleDragend}
          position={isochroneLatLng}
          />

        {comparisonInProgress && comparisonIsochrone &&
          <GeoJson
            data={comparisonIsochrone}
            key={`isochrone-comparison-${isochroneCutoff}-${lonlng.toString(isochroneLatLng)}${isFetchingIsochrone ? '-dim' : ''}`}
            style={{
              fillColor: isFetchingIsochrone
                ? colors.STALE_ISOCHRONE_COLOR
                : colors.COMPARISON_ISOCHRONE_COLOR,
              opacity: 0.65,
              pointerEvents: 'none',
              stroke: false
            }}
          />}

        {isochrone &&
          <GeoJson
            data={isochrone}
            key={`isochrone-${isochroneCutoff}-${lonlng.toString(isochroneLatLng)}${isFetchingIsochrone ? '-dim' : ''}`}
            style={{
              fillColor: isFetchingIsochrone
                ? colors.STALE_ISOCHRONE_COLOR
                : colors.SCENARIO_ISOCHRONE_COLOR,
              opacity: 0.65,
              pointerEvents: 'none',
              stroke: false
            }}
            />}
      </g>
    )
  }

  _fetchIsochrone = (latlng) => {
    const {bundleId, fetchIsochrone, modifications, scenarioId, variantIndex, isochroneCutoff, currentIndicator, workerVersion, comparisonScenarioId, comparisonVariant, comparisonBundleId, comparisonModifications, comparisonInProgress} = this.props

    // leave comparison params undefined unless we're doing a comparison
    const comparisonParams = comparisonInProgress
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
      scenarioId: `${scenarioId}_${variantIndex}`,
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

// @flow
import lonlat from '@conveyal/lonlat'
import {MapEvent} from 'leaflet'
import React, {Component} from 'react'
import {Marker, withLeaflet} from 'react-leaflet'

import colors from '../../constants/colors'
import type {LonLat} from '../../types'

import GeoJSON from './geojson'

type Props = {
  addDestinationTravelTimeDistributionComponentToMap: () => void,
  comparisonInProgress: boolean,
  comparisonIsochrone: any,
  isDestinationTravelTimeDistributionComponentOnMap: boolean,
  isochrone: any,
  isochroneCutoff: number,
  isochroneIsStale: boolean,

  // actions
  isochroneLonLat: any,
  remove: () => void,
  removeDestinationTravelTimeDistributionComponentFromMap: () => void,
  setDestination: () => void,
  setIsochroneLonLat: (lonlat: LonLat) => void
}

export class Isochrone extends Component {
  props: Props

  componentDidMount () {
    const {map} = this.props.leaflet
    map.on('click', this.onMapClick)
  }

  componentWillUnmount () {
    const {
      isDestinationTravelTimeDistributionComponentOnMap,
      removeDestinationTravelTimeDistributionComponentFromMap
    } = this.props
    const {map} = this.props.leaflet
    map.off('click', this.onMapClick)
    if (isDestinationTravelTimeDistributionComponentOnMap) {
      // don't leave dest travel time distribution on map when exiting analysis mode
      removeDestinationTravelTimeDistributionComponentFromMap()
    }
  }

  onMapClick = (e: MapEvent) => {
    const {
      setDestination,
      isDestinationTravelTimeDistributionComponentOnMap,
      addDestinationTravelTimeDistributionComponentToMap
    } = this.props
    // if the destination component is already on the map, don't add it - change destination by
    // dragging destination marker
    if (!isDestinationTravelTimeDistributionComponentOnMap) {
      setDestination(lonlat(e.latlng))
      addDestinationTravelTimeDistributionComponentToMap()
    }
  }

  render () {
    const {
      isochrone,
      isochroneCutoff,
      isochroneLonLat,
      isochroneIsStale,
      comparisonIsochrone,
      comparisonInProgress
    } = this.props
    return (
      <>
        {isochroneLonLat &&
          <Marker
            draggable
            onDblclick={this._handleDblclick}
            onDragend={this._handleDragend}
            position={isochroneLonLat}
          />}

        {comparisonInProgress &&
          comparisonIsochrone &&
          <GeoJSON
            data={comparisonIsochrone}
            key={`isochrone-comparison-${isochroneCutoff}-${lonlat.toString(isochroneLonLat)}${isochroneIsStale ? '-dim' : ''}`}
            style={{
              fillColor: isochroneIsStale
                ? colors.STALE_ISOCHRONE_COLOR
                : colors.COMPARISON_ISOCHRONE_COLOR,
              opacity: 0.65,
              pointerEvents: 'none',
              stroke: false
            }}
          />}

        {isochrone &&
          <GeoJSON
            data={isochrone}
            key={`isochrone-${isochroneCutoff}-${lonlat.toString(isochroneLonLat)}${isochroneIsStale ? '-dim' : ''}`}
            style={{
              fillColor: isochroneIsStale
                ? colors.STALE_ISOCHRONE_COLOR
                : colors.PROJECT_ISOCHRONE_COLOR,
              opacity: 0.65,
              pointerEvents: 'none',
              stroke: false
            }}
          />}
      </>
    )
  }

  _handleDragend = (e: Event & {target: MapEvent}) => {
    this.props.setIsochroneLonLat(lonlat(e.target._latlng))
  }

  _handleDblclick = () => {
    this.props.remove()
  }
}

// Add leaflet to the props
export default withLeaflet(Isochrone)

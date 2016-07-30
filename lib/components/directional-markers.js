import React from 'react'

import DeepEqual from './deep-equal'
import DirectionIcon from './direction-icon'
import {getBearingAndCoordinatesAlongLine} from '../utils/markers'

export default class DirectionalMarkers extends DeepEqual {
  state = {
    markers: patternsToMarkers(this.props.patterns)
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      markers: patternsToMarkers(nextProps.patterns)
    })
  }

  render () {
    const {color} = this.props
    const {markers} = this.state
    return <g>
      {markers.map((marker, i) =>
        <DirectionIcon
          bearing={marker.bearing}
          color={color}
          coordinates={marker.coordinates}
          key={`direction-icon-${marker.coordinates[0]}-${marker.coordinates[1]}-${marker.bearing}-${i}`} // TODO: i shouldn't be necessary?
          />)}
    </g>
  }
}

function patternsToMarkers (patterns) {
  return patterns.reduce((markers, pattern) =>
    [...markers, ...getBearingAndCoordinatesAlongLine({coordinates: pattern.geometry.coordinates})], [])
}

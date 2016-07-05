/** Display patterns on the map */

import Color from 'color'
import React, {PropTypes} from 'react'
import {MapComponent} from 'react-leaflet'

import colors from '../colors'
import DirectionalMarkers from '../components/directional-markers'
import {Patterns as PatternGeometry} from '../components/geojson'
import {getPatternsForModification} from '../utils/patterns'

export default class PatternLayer extends MapComponent {
  static defaultProps = {
    color: colors.NEUTRAL
  }

  static propTypes = {
    activeTrips: PropTypes.array,
    color: PropTypes.string.isRequired,
    feeds: PropTypes.object.isRequired,
    dim: PropTypes.bool,
    layerContainer: PropTypes.object,
    map: PropTypes.object,
    modification: PropTypes.object.isRequired
  }

  render () {
    let {color, dim, layerContainer, map} = this.props
    const patterns = getPatternsForModification(this.props)

    if (dim) {
      color = Color(color).alpha(0.2).hslString()
    }

    if (patterns && patterns.length > 0) {
      return (
        <span>
          <PatternGeometry
            color={color}
            layerContainer={layerContainer}
            map={map}
            patterns={patterns}
            />
          <DirectionalMarkers
            color={color}
            layerContainer={layerContainer}
            map={map}
            patterns={patterns}
            />
        </span>
      )
    } else {
      return <span></span>
    }
  }
}

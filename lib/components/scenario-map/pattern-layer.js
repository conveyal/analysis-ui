/** Display patterns on the map */

import {color as parseColor} from 'd3-color'
import React, {PropTypes} from 'react'

import colors from '../../constants/colors'
import DeepEqual from '../deep-equal'
import DirectionalMarkers from '../directional-markers'
import PatternGeometry from '../map/geojson-patterns'
import {getPatternsForModification} from '../../utils/patterns'

export default class PatternLayer extends DeepEqual {
  static defaultProps = {
    color: colors.NEUTRAL
  }

  static propTypes = {
    activeTrips: PropTypes.array,
    color: PropTypes.string.isRequired,
    dim: PropTypes.bool,
    feed: PropTypes.object,
    modification: PropTypes.object.isRequired
  }

  state = getStateFromProps(this.props)

  componentWillReceiveProps (nextProps) {
    this.setState(getStateFromProps(nextProps))
  }

  render () {
    const {color, patterns} = this.state

    if (patterns && patterns.length > 0) {
      return (
        <g>
          <PatternGeometry
            color={color}
            patterns={patterns}
            />
          <DirectionalMarkers
            color={color}
            patterns={patterns}
            />
        </g>
      )
    } else {
      return <g />
    }
  }
}

function getStateFromProps (props) {
  let color = parseColor(props.color)
  if (props.dim) color.opacity = 0.2
  return {
    color: color + '',
    patterns: getPatternsForModification(props)
  }
}

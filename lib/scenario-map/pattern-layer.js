/** Display patterns on the map */

import Color from 'color'
import React, {PropTypes} from 'react'

import colors from '../colors'
import DeepEqual from '../components/deep-equal'
import DirectionalMarkers from '../components/directional-markers'
import {Patterns as PatternGeometry} from '../components/geojson'
import {getPatternsForModification} from '../utils/patterns'

export default class PatternLayer extends DeepEqual {
  static defaultProps = {
    color: colors.NEUTRAL
  }

  static propTypes = {
    activeTrips: PropTypes.array,
    color: PropTypes.string.isRequired,
    dim: PropTypes.bool,
    feed: PropTypes.object.isRequired,
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
      return <g></g>
    }
  }
}

function getStateFromProps (props) {
  return {
    color: props.dim ? Color(props.color).alpha(0.2).hslString() : props.color,
    patterns: getPatternsForModification(props)
  }
}

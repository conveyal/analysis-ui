// @flow
import {color as parseColor} from 'd3-color'
import React, {PureComponent} from 'react'

import colors from '../../constants/colors'
import DirectionalMarkers from '../directional-markers'
import PatternGeometry from '../map/geojson-patterns'
import {getPatternsForModification} from '../../utils/patterns'

type Props = {
  color: string,
  dim?: boolean
}

/**
 * Display patterns on the map
 */
export default class PatternLayer extends PureComponent {
  props: Props

  static defaultProps = {
    color: colors.NEUTRAL
  }

  state = getStateFromProps(this.props)

  componentWillReceiveProps (nextProps: Props) {
    this.setState(getStateFromProps(nextProps))
  }

  render () {
    const {color, patterns} = this.state

    if (patterns && patterns.length > 0) {
      return (
        <g>
          <PatternGeometry color={color} patterns={patterns} />
          <DirectionalMarkers color={color} patterns={patterns} />
        </g>
      )
    } else {
      return <g />
    }
  }
}

function getStateFromProps (props) {
  const color = parseColor(props.color)
  if (props.dim) color.opacity = 0.2
  return {
    color: color + '',
    patterns: getPatternsForModification(props)
  }
}

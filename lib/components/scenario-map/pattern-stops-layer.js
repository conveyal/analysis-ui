/** Show patterns and (some) stops on that pattern */

import React, { Component } from 'react'

import colors from '../../constants/colors'
import PatternLayer from './pattern-layer'
import StopLayer from './stop-layer'

export default class PatternStopsLayer extends Component {
  static defaultProps = {
    selectedStopColor: colors.NEUTRAL,
    unselectedStopColor: colors.NEUTRAL,
    patternColor: colors.NEUTRAL
  }

  render () {
    const { patternColor, selectedStopColor, unselectedStopColor, ...rest } = this.props
    return <g>
      <PatternLayer color={patternColor} {...rest} />
      <StopLayer selectedColor={selectedStopColor} unselectedColor={unselectedStopColor} {...rest} />
    </g>
  }
}

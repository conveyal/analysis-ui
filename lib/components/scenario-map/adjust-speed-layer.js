/** A layer for an adjust speed modification */

import React, { Component } from 'react'
import {FeatureGroup} from 'react-leaflet'
import PatternLayer from './pattern-layer'
import HopLayer from './hop-layer'
import colors from '../../constants/colors'

export default class AdjustSpeedLayer extends Component {
  render () {
    let { modification, feed, ...rest } = this.props
    if (modification.hops) {
      return (
        <FeatureGroup>
          <PatternLayer
            color={colors.NEUTRAL}
            feed={feed}
            modification={modification}
            {...rest}
            />
          <HopLayer
            color={colors.MODIFIED}
            feed={feed}
            modification={modification}
            {...rest}
            />
        </FeatureGroup>
      )
    } else {
      return (
        <PatternLayer
          color={colors.MODIFIED}
          feed={feed}
          modification={modification}
          {...rest}
          />
      )
    }
  }
}

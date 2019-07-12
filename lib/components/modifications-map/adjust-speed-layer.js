/** A layer for an adjust speed modification */
import React from 'react'

import colors from '../../constants/colors'

import PatternLayer from './pattern-layer'
import HopLayer from './hop-layer'

export default function AdjustSpeedLayer(props) {
  const {modification, feed, dim} = props
  if (modification.hops) {
    return (
      <>
        <PatternLayer
          color={colors.NEUTRAL}
          dim={dim}
          feed={feed}
          modification={modification}
        />
        <HopLayer
          color={colors.MODIFIED}
          dim={dim}
          feed={feed}
          modification={modification}
        />
      </>
    )
  } else {
    return (
      <PatternLayer
        color={colors.MODIFIED}
        dim={dim}
        feed={feed}
        modification={modification}
      />
    )
  }
}

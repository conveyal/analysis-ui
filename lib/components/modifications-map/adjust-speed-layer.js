/** A layer for an adjust speed modification */
import React from 'react'
import {Pane} from 'react-leaflet'

import colors from 'lib/constants/colors'

import PatternLayer from './pattern-layer'
import HopLayer from './hop-layer'

export default function AdjustSpeedLayer(p) {
  if (p.modification.hops) {
    return (
      <>
        <Pane zIndex={500}>
          <PatternLayer
            color={colors.NEUTRAL}
            dim={p.dim}
            feed={p.feed}
            modification={p.modification}
          />
        </Pane>
        <Pane zIndex={501}>
          <HopLayer
            color={colors.MODIFIED}
            dim={p.dim}
            feed={p.feed}
            modification={p.modification}
          />
        </Pane>
      </>
    )
  } else {
    return (
      <PatternLayer
        color={colors.MODIFIED}
        dim={p.dim}
        feed={p.feed}
        modification={p.modification}
      />
    )
  }
}

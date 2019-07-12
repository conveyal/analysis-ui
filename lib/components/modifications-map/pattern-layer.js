import {color as parseColor} from 'd3-color'
import React from 'react'

import colors from 'lib/constants/colors'
import {getPatternsForModification} from 'lib/utils/patterns'

import DirectionalMarkers from '../directional-markers'
import PatternGeometry from '../map/geojson-patterns'

/**
 * Display patterns on the map
 */
export default React.memo(function PatternLayer(p) {
  const color = parseColor(p.color || colors.NEUTRAL)
  if (p.dim) color.opacity = 0.2
  const patterns = getPatternsForModification(p)

  if (patterns && patterns.length > 0) {
    return (
      <>
        <PatternGeometry color={color + ''} patterns={patterns} />
        <DirectionalMarkers color={color + ''} patterns={patterns} />
      </>
    )
  } else {
    return null
  }
})

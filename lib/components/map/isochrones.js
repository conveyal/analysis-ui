import React from 'react'

import colors from 'lib/constants/colors'

import GeoJSON from './geojson'

const isochroneStyle = (fillColor) => ({
  fillColor,
  opacity: 0.65,
  pointerEvents: 'none',
  stroke: false
})

const mainIsochroneStyle = isochroneStyle(colors.PROJECT_ISOCHRONE_COLOR)
const compIsochroneStyle = isochroneStyle(colors.COMPARISON_ISOCHRONE_COLOR)
const staleIsochroneStyle = isochroneStyle(colors.STALE_PERCENTILE_COLOR)

export default function Isochrones(p) {
  return (
    <>
      {p.isochrone && (
        <GeoJSON
          data={p.isochrone}
          style={p.isCurrent ? mainIsochroneStyle : staleIsochroneStyle}
        />
      )}

      {p.comparison && (
        <GeoJSON
          data={p.comparison}
          style={p.isCurrent ? compIsochroneStyle : staleIsochroneStyle}
        />
      )}
    </>
  )
}

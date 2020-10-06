import {useSelector} from 'react-redux'

import colors from 'lib/constants/colors'
import selectComparisonIsochrone from 'lib/selectors/comparison-isochrone'
import selectIsochrone from 'lib/selectors/isochrone'

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
  const isochrone = useSelector(selectIsochrone)
  const comparisonIsochrone = useSelector(selectComparisonIsochrone)

  return (
    <>
      {isochrone && (
        <GeoJSON
          data={isochrone}
          style={p.isCurrent ? mainIsochroneStyle : staleIsochroneStyle}
        />
      )}

      {comparisonIsochrone && (
        <GeoJSON
          data={comparisonIsochrone}
          style={p.isCurrent ? compIsochroneStyle : staleIsochroneStyle}
        />
      )}
    </>
  )
}

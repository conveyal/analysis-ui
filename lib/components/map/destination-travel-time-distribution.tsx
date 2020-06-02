import lonlat from '@conveyal/lonlat'
import {scaleLinear} from 'd3-scale'
import {useState} from 'react'
import {Popup} from 'react-leaflet'

import colors from 'lib/constants/colors'
import message from 'lib/message'

import Boxplot from '../analysis/boxplot'
import MinuteTicks from '../analysis/minute-ticks'

import OpenMarker from './open-marker'

const WIDTH = 450
const HEIGHT = 50
const LEGEND_HEIGHT = 0.2
const MAX_TRIP_DURATION = 120
const SCALE = scaleLinear().domain([0, MAX_TRIP_DURATION]).range([0, WIDTH])
const FONT_SIZE = 10
const BOXPLOT_HEIGHT = HEIGHT * (1 - LEGEND_HEIGHT)

/**
 * Show a popup with the travel time distribution from the origin to a location
 * @author mattwigway
 */
export default function DestinationTravelTimeDistribution(p) {
  const [dragging, setDragging] = useState(false)
  const fullHeight = p.comparisonDistribution ? HEIGHT * 2 : HEIGHT
  return (
    <OpenMarker
      draggable
      position={lonlat.toLeaflet(p.destination)}
      onDragEnd={(e) => p.setDestination(lonlat(e.target.getLatLng()))}
      onMouseDown={() => setDragging(true)}
      onMouseUp={() => setDragging(false)}
    >
      <Popup
        maxWidth={WIDTH + 10}
        onClose={() => {
          if (!dragging) p.remove()
        }}
      >
        <figure>
          <figcaption>{message('analysis.travelTime')}</figcaption>
          <svg width={WIDTH} height={fullHeight} style={{fontSize: FONT_SIZE}}>
            <g transform={`translate(0 ${fullHeight})`}>
              <MinuteTicks scale={SCALE} textHeight={FONT_SIZE} />
            </g>

            <g transform={`translate(0 ${BOXPLOT_HEIGHT}) rotate(-90)`}>
              <Boxplot
                color={colors.PROJECT_PERCENTILE_COLOR}
                positions={p.distribution}
                scale={SCALE}
                width={BOXPLOT_HEIGHT}
              />
            </g>

            {p.comparisonDistribution && (
              <g transform={`translate(0 ${BOXPLOT_HEIGHT}) rotate(-90)`}>
                <Boxplot
                  color={colors.COMPARISON_PERCENTILE_COLOR}
                  positions={p.comparisonDistribution}
                  scale={SCALE}
                  width={BOXPLOT_HEIGHT}
                />
              </g>
            )}
          </svg>
        </figure>
      </Popup>
    </OpenMarker>
  )
}

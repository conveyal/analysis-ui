import {Box, Heading, Stack} from '@chakra-ui/core'
import lonlat from '@conveyal/lonlat'
import {scaleLinear} from 'd3-scale'
import fpGet from 'lodash/fp/get'
import {useDispatch, useSelector} from 'react-redux'
import {Marker} from 'react-leaflet'
import MapControl from 'react-leaflet-control'

import {setDestination} from 'lib/actions/analysis'
import colors from 'lib/constants/colors'
import selectDTTD from 'lib/selectors/destination-travel-time-distribution'
import selectDTTDComparison from 'lib/selectors/comparison-destination-travel-time-distribution'

import Boxplot from '../analysis/boxplot'
import MinuteTicks from '../analysis/minute-ticks'

const WIDTH = 300
const HEIGHT = 50
const LEGEND_HEIGHT = 0.2
const MAX_TRIP_DURATION = 120
const SCALE = scaleLinear().domain([0, MAX_TRIP_DURATION]).range([0, WIDTH])
const FONT_SIZE = 10
const BOXPLOT_HEIGHT = HEIGHT * (1 - LEGEND_HEIGHT)

const selectDestination = fpGet('analysis.destination')

/**
 * Show a popup with the travel time distribution from the origin to a location
 * @author mattwigway
 */
export default function DestinationTravelTimeDistribution() {
  const dispatch = useDispatch()
  const destination = useSelector(selectDestination)
  const distribution = useSelector(selectDTTD)
  const comparisonDistribution = useSelector(selectDTTDComparison)

  if (!destination) return null

  const fullHeight = comparisonDistribution ? HEIGHT * 2 : HEIGHT

  return (
    <>
      <Marker
        draggable
        position={lonlat.toLeaflet(destination)}
        onDrag={(e) => dispatch(setDestination(lonlat(e.target.getLatLng())))}
        ondblclick={() => dispatch(setDestination())}
      />
      <MapControl position='bottomleft'>
        <Stack backgroundColor='white' boxShadow='lg' rounded='md' p={3}>
          <Heading size='sm'>Travel time distribution (minutes)</Heading>
          <Box>
            <figure>
              <svg
                width={WIDTH}
                height={fullHeight}
                style={{fontSize: FONT_SIZE}}
              >
                <g transform={`translate(0 ${fullHeight})`}>
                  <MinuteTicks
                    label={false}
                    textHeight={FONT_SIZE}
                    scale={SCALE}
                  />
                </g>

                <g transform={`translate(0 ${BOXPLOT_HEIGHT}) rotate(-90)`}>
                  <Boxplot
                    color={colors.PROJECT_PERCENTILE_COLOR}
                    positions={distribution}
                    scale={SCALE}
                    width={BOXPLOT_HEIGHT}
                  />
                </g>

                {comparisonDistribution && (
                  <g
                    transform={`translate(0 ${BOXPLOT_HEIGHT * 2}) rotate(-90)`}
                  >
                    <Boxplot
                      color={colors.COMPARISON_PERCENTILE_COLOR}
                      positions={comparisonDistribution}
                      scale={SCALE}
                      width={BOXPLOT_HEIGHT}
                    />
                  </g>
                )}
              </svg>
            </figure>
          </Box>
        </Stack>
      </MapControl>
    </>
  )
}

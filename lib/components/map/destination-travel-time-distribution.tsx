import {Alert, AlertIcon, Box, Heading, Stack} from '@chakra-ui/core'
import lonlat from '@conveyal/lonlat'
import fpGet from 'lodash/fp/get'
import {scaleLinear} from 'd3-scale'
import {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {useLeaflet} from 'react-leaflet'
import MapControl from 'react-leaflet-control'

import colors from 'lib/constants/colors'

import Boxplot from '../analysis/boxplot'
import MinuteTicks from '../analysis/minute-ticks'

const WIDTH = 300
const HEIGHT = 50
const LEGEND_HEIGHT = 0.2
const MAX_TRIP_DURATION = 120
const SCALE = scaleLinear().domain([0, MAX_TRIP_DURATION]).range([0, WIDTH])
const FONT_SIZE = 10
const BOXPLOT_HEIGHT = HEIGHT * (1 - LEGEND_HEIGHT)

function createDistribution(destination, travelTimeSurface) {
  const pixel = lonlat.toPixel(destination, travelTimeSurface.zoom)
  // floor them to get top left of cell the point is a part of (TODO correct?)
  const x = Math.floor(pixel.x - travelTimeSurface.west)
  const y = Math.floor(pixel.y - travelTimeSurface.north)

  if (
    travelTimeSurface.contains(x, y, 0) &&
    travelTimeSurface.contains(x, y, 1) &&
    travelTimeSurface.contains(x, y, 2) &&
    travelTimeSurface.contains(x, y, 3) &&
    travelTimeSurface.contains(x, y, 4)
  ) {
    return [
      travelTimeSurface.get(x, y, 0),
      travelTimeSurface.get(x, y, 1),
      travelTimeSurface.get(x, y, 2),
      travelTimeSurface.get(x, y, 3),
      travelTimeSurface.get(x, y, 4)
    ]
  } else {
    return null
  }
}

// Select surfaces
const selectSurface = fpGet('analysis.travelTimeSurface')
const selectComparisonSurface = fpGet('analysis.comparisonTravelTimeSurface')

/**
 * Show a popup with the travel time distribution from the origin to a location
 * @author mattwigway
 */
export default function DestinationTravelTimeDistribution() {
  const [destination, setDestination] = useState()
  const [distribution, setDistribution] = useState<void | number[]>()
  const [comparisonDistribution, setComparisonDistribution] = useState<
    void | number[]
  >()
  const surface = useSelector(selectSurface)
  const comparisonSurface = useSelector(selectComparisonSurface)
  const leaflet = useLeaflet()

  // Calculate the distributions when the destination or surface changes
  useEffect(() => {
    if (destination && surface) {
      setDistribution(createDistribution(destination, surface))
    } else {
      setDistribution(null)
    }
  }, [destination, surface])
  useEffect(() => {
    if (destination && comparisonSurface) {
      setComparisonDistribution(
        createDistribution(destination, comparisonSurface)
      )
    } else {
      setComparisonDistribution(null)
    }
  }, [destination, comparisonSurface])

  // Set the destination on mouse move
  useEffect(() => {
    function onMove(e) {
      setDestination(lonlat.fromLeaflet(e.latlng))
    }
    leaflet.map.on('mousemove', onMove)
    return () => leaflet.map.off('mousemove', onMove)
  }, [leaflet])

  const fullHeight = comparisonDistribution ? HEIGHT * 2 : HEIGHT

  return (
    <MapControl position='bottomleft'>
      <Stack backgroundColor='white' boxShadow='lg' rounded='md' pt={3}>
        <Heading size='sm' px={3}>
          Travel time distribution (minutes)
        </Heading>
        {distribution ? (
          <Box p={3}>
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
        ) : (
          <Alert status='info'>
            <AlertIcon /> Mouse over the isochrone to calculate.
          </Alert>
        )}
      </Stack>
    </MapControl>
  )
}

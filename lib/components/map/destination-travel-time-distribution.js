// @flow
import lonlat from '@conveyal/lonlat'
import {scaleLinear} from 'd3-scale'
import {Marker as LeafletMarker} from 'leaflet'
import React, {PureComponent} from 'react'

import DraggablePopup from './draggable-popup'
import Boxplot from '../analysis/boxplot'
import MinuteTicks from '../analysis/minute-ticks'
import {
  SCENARIO_PERCENTILE_COLOR,
  COMPARISON_PERCENTILE_COLOR,
  STALE_PERCENTILE_COLOR
} from '../../constants/colors'
import messages from '../../utils/messages'

import type {LonLat, Quintiles} from '../../types'

const WIDTH = 450
const HEIGHT = 100
const LEGEND_HEIGHT = 0.2
const MAX_TRIP_DURATION = 120
const SCALE = scaleLinear().domain([0, MAX_TRIP_DURATION]).range([0, WIDTH])
const FONT_SIZE = 10

type Props = {
  destination: LonLat,
  destinationTravelTimeDistribution: Quintiles,
  comparisonDestinationTravelTimeDistribution: ?Quintiles,
  isFetchingIsochrone: boolean,
  remove(): void,
  setDestination(LonLat): void
}

/**
 * Show a popup with the travel time distribution from the origin to a location
 * @author mattwigway
 */
export default class DestinationTravelTimeDistribution
  extends PureComponent<void, Props, void> {
  render () {
    const {
      destination,
      destinationTravelTimeDistribution,
      comparisonDestinationTravelTimeDistribution,
      isFetchingIsochrone,
      remove
    } = this.props
    if (!destination) return null // TODO don't display this component if it's

    // if comparison we are showing two side-by-side boxplots
    let boxplotHeight = HEIGHT * (1 - LEGEND_HEIGHT)
    if (comparisonDestinationTravelTimeDistribution) boxplotHeight /= 2

    // TODO probably shouldn't have a span here but markers inside a feature group don't show
    // popups
    return (
      <DraggablePopup
        position={destination}
        maxWidth={WIDTH + 10}
        drag={this.drag}
        remove={remove}
      >
        <figure>
          <figcaption>
            {messages.analysis.travelTime}
          </figcaption>
          <svg width={WIDTH} height={HEIGHT} style={{fontSize: FONT_SIZE}}>
            <g transform={`translate(0 ${HEIGHT})`}>
              <MinuteTicks scale={SCALE} textHeight={FONT_SIZE} />
            </g>
            {/* CSS transforms are evaluated right to left
            first rotate ccw so that the boxplot is horizontal
            it will then be sitting "on top" of the svg because the default rotation origin is
            0, 0 - the top left of the svg. Translate it down (positive y) to compensate.
             */}
            <g transform={`translate(0 ${boxplotHeight}) rotate(-90)`}>
              <Boxplot
                width={boxplotHeight}
                scale={SCALE}
                {...destinationTravelTimeDistribution}
                color={
                  isFetchingIsochrone
                    ? STALE_PERCENTILE_COLOR
                    : SCENARIO_PERCENTILE_COLOR
                }
              />
            </g>

            {comparisonDestinationTravelTimeDistribution &&
              <g transform={`translate(0 ${boxplotHeight * 2}) rotate(-90)`}>
                <Boxplot
                  width={boxplotHeight}
                  scale={SCALE}
                  {...comparisonDestinationTravelTimeDistribution}
                  color={
                    isFetchingIsochrone
                      ? STALE_PERCENTILE_COLOR
                      : COMPARISON_PERCENTILE_COLOR
                  }
                />
              </g>}
          </svg>
        </figure>
      </DraggablePopup>
    )
  }

  drag = (e: Event & {target: LeafletMarker}): void => {
    this.props.setDestination(lonlat(e.target.getLatLng()))
  }
}

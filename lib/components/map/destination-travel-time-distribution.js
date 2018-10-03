// @flow
import message from '@conveyal/woonerf/message'
import lonlat from '@conveyal/lonlat'
import {scaleLinear} from 'd3-scale'
import Leaflet from 'leaflet'
import React from 'react'
import {Popup} from 'react-leaflet'

import Boxplot from '../analysis/boxplot'
import MinuteTicks from '../analysis/minute-ticks'
import OpenMarker from './open-marker'
import colors from '../../constants/colors'

import type {LonLat, Quintiles} from '../../types'

const WIDTH = 450
const HEIGHT = 100
const LEGEND_HEIGHT = 0.2
const MAX_TRIP_DURATION = 120
const SCALE = scaleLinear().domain([0, MAX_TRIP_DURATION]).range([0, WIDTH])
const FONT_SIZE = 10

type Props = {
  destination: LonLat,
  distribution: Quintiles,
  comparisonDistribution?: Quintiles,
  isFetchingIsochrone: boolean,
  remove: () => void,
  setDestination: (LonLat) => void
}

/**
 * CSS transforms are evaluated right to left first rotate ccw so that the
 * boxplot is horizontal it will then be sitting "on top" of the svg because
 * the default rotation origin is 0, 0 - the top left of the svg. Translate it
 * down (positive y) to compensate.
 */
const Plot = (p) =>
  <g transform={`translate(0 ${p.height}) rotate(-90)`}>
    <Boxplot
      width={p.height}
      scale={SCALE}
      color={p.color}
      {...p}
    />
  </g>

const Plots = (p) =>
  <figure>
    <figcaption>
      {message('analysis.travelTime')}
    </figcaption>
    <svg width={WIDTH} height={HEIGHT} style={{fontSize: FONT_SIZE}}>
      <g transform={`translate(0 ${HEIGHT})`}>
        <MinuteTicks scale={SCALE} textHeight={FONT_SIZE} />
      </g>
      <Plot
        color={p.stale
          ? colors.STALE_PERCENTILE_COLOR
          : colors.PROJECT_PERCENTILE_COLOR}
        height={p.height}
        {...p.distribution}
      />

      {p.comparisonDistribution &&
        <Plot
          color={p.stale
            ? colors.STALE_PERCENTILE_COLOR
            : colors.PROJECT_PERCENTILE_COLOR}
          height={p.height}
          {...p.comparisonDistribution}
        />}
    </svg>
  </figure>

/**
 * Show a popup with the travel time distribution from the origin to a location
 * @author mattwigway
 */
export default class DestinationTravelTimeDistribution extends React.Component {
  props: Props
  _dragging = false

  _onMouseDown = () => {
    this._dragging = true
  }

  _onMouseUp = () => {
    this._dragging = false
  }

  _dragEnd = (e: Leaflet.DrageEndEvent): void => {
    this.props.setDestination(lonlat(e.target.getLatLng()))
  }

  _remove = (): void => {
    if (!this._dragging) this.props.remove()
  }

  render () {
    const p = this.props
    // if comparison we are showing two side-by-side boxplots
    let boxplotHeight = HEIGHT * (1 - LEGEND_HEIGHT)
    if (p.comparisonDistribution) boxplotHeight /= 2

    return (
      <OpenMarker
        draggable
        position={lonlat.toLeaflet(p.destination)}
        onDragEnd={this._dragEnd}
        onMouseDown={this._onMouseDown}
        onMouseUp={this._onMouseUp}
      >
        <Popup
          maxWidth={WIDTH + 10}
          onClose={this._remove}
        >
          <Plots
            comparisonDistribution={p.comparisonDistribution}
            distribution={p.distribution}
            height={boxplotHeight}
            stale={p.isFetchingIsochrone}
          />
        </Popup>
      </OpenMarker>
    )
  }
}

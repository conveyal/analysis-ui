// @flow
/** Displays the bootstrap sampling distribution for a selected point */

import React from 'react'
import {stats} from 'science'
import {line} from 'd3-shape'
import {scaleLinear} from 'd3-scale'
import {format} from 'd3-format'
import range from 'lodash.range'
import lonlat from '@conveyal/lonlat'

import DeepEqualComponent from '../deep-equal'
import DraggablePopup from './draggable-popup'

import type {LonLat} from '../../types'

const WIDTH = 400
const HEIGHT = 200
const SCALE_HEIGHT = 15

type Props = {
  samplingDistribution: number[],
  id: string,
  origin: LonLat,
  remove: () => void,
  setOrigin: () => void
}

export default class RegionalAnalysisSamplingDistribution extends DeepEqualComponent<void, Props, void> {
  render () {
    this.computeXScale()

    const {origin, remove} = this.props
    return <DraggablePopup position={origin} dragEnd={this.dragEnd} remove={remove} minWidth={WIDTH}>
      <svg width={WIDTH} height={HEIGHT}>
        {this.renderKernelDensity()}
        {this.renderPointEstimate()}
        {this.renderScale()}
      </svg>
    </DraggablePopup>
  }

  renderPointEstimate () {
    const {samplingDistribution} = this.props
    // the 0th item is the point est, the rest are bootstrap estimates
    const x = this.xScale(samplingDistribution[0])
    return <line
      x1={x}
      x2={x}
      y1={0}
      y2={HEIGHT - SCALE_HEIGHT}
      style={{ stroke: '#000', strokeWidth: 0.3 }} />
  }

  /** Render the kernel density estimate of the sampling distribution */
  renderKernelDensity () {
    const {samplingDistribution} = this.props

    // if there's no variation, don't render the distribution
    if (Math.max(...samplingDistribution) - Math.min(...samplingDistribution) < 0.0001) return

    const estimate = stats.kde()
      .sample(samplingDistribution)(range(WIDTH).map(this.xScale.invert))

    const yScale = scaleLinear()
      // make the peak a little below the top of the graph
      .domain([0, Math.max(...estimate.map(x => x[1])) * 1.1])
      .range([HEIGHT - SCALE_HEIGHT, 0]) // reverse because +y is down in SVG

    const kdeLine = line()
      .x(([x, y]) => this.xScale(x))
      .y(([x, y]) => yScale(y))

    return <g>
      <path d={kdeLine(estimate)} style={{strokeWidth: 0.5, stroke: '#000', fillOpacity: 0}} />
    </g>
  }

  renderScale () {
    const fmt = format(',')
    return <g transform={`translate(0 ${HEIGHT - SCALE_HEIGHT / 4})`}>
      {this.xScale.ticks(5)
        .map(tick =>
          <text
            x={this.xScale(tick)}
            y={0}
            style={{fontSize: SCALE_HEIGHT * 0.8}}
            alignmentBaseline='baseline'
            textAnchor='middle'>
            {fmt(tick)}
          </text>)}
    </g>
  }

  computeXScale (): void {
    const {samplingDistribution} = this.props
    this.xScale = scaleLinear()
      .domain([Math.min(...samplingDistribution) * 0.97, Math.max(...samplingDistribution) * 1.03])
      .range([0, WIDTH])
  }

  dragEnd = (e): void => {
    const {setRegionalAnalysisOrigin, id} = this.props
    setRegionalAnalysisOrigin({ regionalAnalysisId: id, latlon: lonlat(e.target.getLatLng()) })
  }
}

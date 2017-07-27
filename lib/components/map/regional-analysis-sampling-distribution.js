// @flow
/** Displays the bootstrap sampling distribution for a selected point */

import React from 'react'
import {stats} from 'science'
import {line} from 'd3-shape'
import {scaleLinear} from 'd3-scale'
import {format} from 'd3-format'
import range from 'lodash/range'
import lonlat from '@conveyal/lonlat'

import DeepEqualComponent from '../deep-equal'
import DraggablePopup from './draggable-popup'
import * as colors from '../../constants/colors'

import type {LonLat, LeafletMarker} from '../../types'

const WIDTH = 400
const HEIGHT = 200
const SCALE_HEIGHT = 15

type Props = {
  samplingDistribution: number[],
  comparisonSamplingDistribution: ?number[],
  id: string,
  comparisonId: ?string,
  origin: LonLat,
  remove: () => void,
  setOrigin: () => void
}

export default class RegionalAnalysisSamplingDistribution extends DeepEqualComponent<void, Props, void> {
  render () {
    const {samplingDistribution, comparisonSamplingDistribution} = this.props
    this.computeXScale()

    const estimate = stats.kde()
      .sample(samplingDistribution)(range(WIDTH).map(this.xScale.invert))

    const comparisonEstimate = comparisonSamplingDistribution
      ? stats.kde().sample(comparisonSamplingDistribution)(range(WIDTH).map(this.xScale.invert))
      : null

    // make flow happy
    if (comparisonSamplingDistribution && comparisonEstimate == null) {
      throw new Error('Kernel density estimate is null!')
    }

    this.computeYScale(estimate, comparisonEstimate)

    const {origin, remove} = this.props
    return <DraggablePopup position={origin} dragEnd={this.dragEnd} remove={remove} minWidth={WIDTH}>
      <svg width={WIDTH} height={HEIGHT}>
        {this.renderKernelDensity({ estimate, color: colors.SCENARIO_PERCENTILE_COLOR })}
        {this.renderPointEstimate({ samplingDistribution, color: colors.SCENARIO_PERCENTILE_COLOR })}

        {comparisonSamplingDistribution && comparisonEstimate &&
          this.renderKernelDensity({ estimate: comparisonEstimate, color: colors.COMPARISON_PERCENTILE_COLOR })}
        {comparisonSamplingDistribution &&
          this.renderPointEstimate({ samplingDistribution: comparisonSamplingDistribution, color: colors.COMPARISON_PERCENTILE_COLOR })}
        {this.renderScale()}
      </svg>
    </DraggablePopup>
  }

  renderPointEstimate ({ samplingDistribution, color }: {
    samplingDistribution: number[],
    color: string
  }) {
    // the 0th item is the point est, the rest are bootstrap estimates
    const x = this.xScale(samplingDistribution[0])
    return <line
      x1={x}
      x2={x}
      y1={0}
      y2={HEIGHT - SCALE_HEIGHT}
      style={{ stroke: color, strokeWidth: 0.3 }} />
  }

  /** Render the kernel density estimate of the sampling distribution */
  renderKernelDensity ({estimate, color}: {
    estimate: number[][],
    color: string
  }) {
    const kdeLine = line()
      .x(([x, y]) => this.xScale(x))
      .y(([x, y]) => this.yScale(y))

    return <g>
      <path d={kdeLine(estimate)} style={{strokeWidth: 0.5, stroke: color, fillOpacity: 0}} />
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
    const {samplingDistribution, comparisonSamplingDistribution} = this.props

    let min = Math.min(...samplingDistribution)
    let max = Math.max(...samplingDistribution)

    if (comparisonSamplingDistribution) {
      min = Math.min(Math.min(min, ...comparisonSamplingDistribution))
      max = Math.max(Math.max(max, ...comparisonSamplingDistribution))
    }

    this.xScale = scaleLinear()
      .domain([min * 0.97, max * 1.03])
      .range([0, WIDTH])
  }

  /**
   * Compute the Y scale given KDE estimates of the sampling distribution and optionally the
   * comparison sampling distribution
   */
  computeYScale (estimate: number[][], comparisonEstimate: ?number[][]): void {
    let max = Math.max(...estimate.map(i => i[1]))

    if (comparisonEstimate) {
      max = Math.max(Math.max(max, ...comparisonEstimate.map(i => i[1])))
    }

    this.yScale = scaleLinear()
      .domain([0, max * 1.1])
      .range([HEIGHT - SCALE_HEIGHT, 0]) // +y is down in SVG, flip the y axis
  }

  dragEnd = (e: Event & { target: LeafletMarker }): void => {
    const {setRegionalAnalysisOrigin, comparisonId, id} = this.props
    setRegionalAnalysisOrigin({
      regionalAnalysisId: id,
      comparisonRegionalAnalysisId: comparisonId,
      latlon: lonlat(e.target.getLatLng())
    })
  }
}

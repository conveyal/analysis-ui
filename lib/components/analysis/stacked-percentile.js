// @flow

/**
 * Display a stacked percentile chart.
 */

import React from 'react'
import DeepEqualComponent from '../deep-equal'
import {scalePow, scaleLinear} from 'd3-scale'
import {format} from 'd3-format'
import {area} from 'd3-shape'
import Boxplot from './boxplot'

const BOX_PLOT_WIDTH = 0.1
// reversed because 5th percentile travel time has the highest accessibility
// TODO this is premised on the assumption that accessibility is done in 5-percentile steps on the backend
// That could change at some point.
const BOX_PLOT_ITEMS = [18, 14, 9, 4, 0]

const TEXT_HEIGHT = 10
const MAX_OPACITY = 0.5
const MAX_TRIP_DURATION = 120

type Props = {
  percentileCurves: number[][],
  isochroneCutoff: number,
  width: number,
  height: number,
  maxAccessibility: number
}

export default class StackedPercentile extends DeepEqualComponent<void, Props, void> {
  render () {
    const {width, height} = this.props

    this.yScale = this.createYScale()
    this.xScale = this.createXScale()

    return <svg style={{width, height}}>
      <g>
        {this.renderBoxPlot()}
        {this.renderCurves()}
        {this.renderYAxis()}
        {this.renderSliceLine()}
      </g>
    </svg>
  }

  renderBoxPlot () {
    const {percentileCurves, isochroneCutoff, width, color} = this.props
    const [low, iqrLow, med, iqrHigh, high] = BOX_PLOT_ITEMS
      .map(i => percentileCurves[i][isochroneCutoff - 1])

    return <Boxplot
      low={low}
      iqrLow={iqrLow}
      med={med}
      iqrHigh={iqrHigh}
      high={high}
      width={width * BOX_PLOT_WIDTH}
      scale={this.yScale}
      color={color}
      />
  }

  renderYAxis () {
    const {indicator, width} = this.props
    const tickFormat = format('.3s')

    // y scale
    const yTicks = this.yScale.ticks(5)

    const toRender = yTicks.map((tick, i, arr) => {
      const yoff = this.yScale(tick)

      const valueText = tickFormat(tick)

      // highest valued tick gets label, move ticks down a little so the middle of the text is on
      // the line.
      const tickText = i === arr.length - 1 ? `${valueText} ${indicator}` : valueText

      return [yoff, tickText]
    })

    return <g transform={`translate(${BOX_PLOT_WIDTH * width})`} style={{fontSize: TEXT_HEIGHT}}>
      {toRender.map(([off, text], i, arr) =>
        <text
          style={{ alignmentBaseline: i === 0 ? 'baseline' : 'middle' }}
          y={off}
          >
          {text}
        </text>)}
    </g>
  }

  // TODO put this in its own DeepEqualComponent so it is not re-rendered when the cutoff changes
  renderCurves () {
    const {percentileCurves, color} = this.props

    const sliceArea = area()
      .x1((d, i) => this.xScale(i))
      .x0((d, i) => this.xScale(i))
      .y0(d => this.yScale(d[0]))
      .y1(d => this.yScale(d[1]))

    // a "slice" is the segment between two percentile curves
    const slices = []
    for (let slice = 1; slice < percentileCurves.length; slice++) {
      // slice - 1 has a higher accessibility value because it is from a less reliable travel time
      const combinedValues = percentileCurves[slice].map((d, i) => ([d, percentileCurves[slice - 1][i]]))
      slices.push(combinedValues)
    }

    return <g>
      {slices.map((d, i, a) => {
        const opacity = i * MAX_OPACITY / a.length
        return <path
          d={sliceArea(d)}
          style={{fill: color, fillOpacity: opacity}}
        />
      })}
    </g>
  }

  renderSliceLine () {
    const {height, isochroneCutoff} = this.props
    return <line
      x1={this.xScale(isochroneCutoff)}
      x2={this.xScale(isochroneCutoff)}
      y1={0}
      y2={height}
      style={{
        stroke: '#555',
        strokeWidth: 0.5
      }} />
  }

  createYScale () {
    const {height, maxAccessibility} = this.props
    return scalePow()
      .exponent(0.5)
      .domain([0, maxAccessibility])
      .range([height, 0])
  }

  createXScale () {
    const {width} = this.props
    return scaleLinear()
      .domain([0, MAX_TRIP_DURATION - 1])
      .range([BOX_PLOT_WIDTH * width, width])
  }
}

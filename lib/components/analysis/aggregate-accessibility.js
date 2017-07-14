// @flow
/**
 * This component renders the aggregate accessibility display (histograms and percentiles).
 */

import React from 'react'
import {scaleLinear} from 'd3-scale'
import {format as d3Format} from 'd3-format'

import DeepEqualComponent from '../deep-equal'
import colors from '../../constants/colors'
import messages from '../../utils/messages'

const WIDTH = 300
const HEIGHT = 225
const X_SCALE_HEIGHT = 30
const Y_SCALE_WIDTH = 30
const FONT_SIZE = 10

export default class AggregateAccessibility extends DeepEqualComponent {
  render () {
    return <div>
      {this.renderPlot()}
    </div>
  }

  renderPlot () {
    const {aggregateAccessibility, comparisonAggregateAccessibility} = this.props

    const minAccessibility = comparisonAggregateAccessibility
      ? Math.min(comparisonAggregateAccessibility.minAccessibility, aggregateAccessibility.minAccessibility)
      : aggregateAccessibility.minAccessibility

    const maxAccessibility = comparisonAggregateAccessibility
      ? Math.max(comparisonAggregateAccessibility.maxAccessibility, aggregateAccessibility.maxAccessibility)
      : aggregateAccessibility.maxAccessibility

    const maxCount = comparisonAggregateAccessibility
      ? Math.max(...[
        ...aggregateAccessibility.bins.map(b => b.value),
        ...comparisonAggregateAccessibility.bins.map(b => b.value)
      ])
      : Math.max(...aggregateAccessibility.bins.map(b => b.value))

    this.xScale = scaleLinear()
      .domain([minAccessibility, maxAccessibility])
      .range([Y_SCALE_WIDTH, WIDTH])

    this.yScale = scaleLinear()
      .domain([0, maxCount])
      .range([HEIGHT - X_SCALE_HEIGHT, 0]) // invert y, +y is down in SVG

    return <svg width={WIDTH} height={HEIGHT}>
      {this.renderBins(aggregateAccessibility.bins, colors.SCENARIO_PERCENTILE_COLOR)}
      {this.renderXScale()}
      {this.renderYScale()}
    </svg>
  }

  renderBins (bins: { value: number, min: number, max: number }[], color: string) {
    return <g>
      {bins.map(({min, max, value}, i) => <rect
        x={this.xScale(min)}
        width={this.xScale(max) - this.xScale(min)}
        y={this.yScale(value)}
        height={this.yScale(0) - this.yScale(value)}
        style={{fill: color, fillOpacity: 0.5}}
        key={`bin-${i}`}
        />)}
    </g>
  }

  renderXScale () {
    const fmt = d3Format('.3s')
    return <g>
      {this.xScale.ticks(4).map((t, i) => <text
        x={this.xScale(t)}
        y={HEIGHT - FONT_SIZE * 1.5}
        style={{textAnchor: 'middle', alignmentBaseline: 'baseline', fontSize: FONT_SIZE}}
        key={`x-label-${i}`}>
        {fmt(t)}
      </text>)}
      <text
        x={WIDTH / 2}
        y={HEIGHT}
        style={{textAnchor: 'middle', alignmentBaseline: 'ideographic', fontSize: FONT_SIZE}} >
        {messages.analysis.accessibility}
      </text>
    </g>
  }

  renderYScale () {
    const {weightByName} = this.props
    const fmt = d3Format('.3s')
    return <g>
      {this.yScale.ticks(4).map((t, i) => <text
        y={0}
        x={0}
        key={`y-label-${i}`}
        style={{textAnchor: 'right', alignmentBaseline: 'middle', fontSize: FONT_SIZE}}
        transform={`translate(${Y_SCALE_WIDTH} ${this.yScale(t)}) rotate(-30)`}>
        {fmt(t)}
      </text>)
      }
      <text
        x={0}
        y={0}
        transform={`translate(${FONT_SIZE * 0.75} ${HEIGHT / 2}) rotate(-90)`}
        style={{textAnchor: 'middle', alignmentBaseline: 'middle', fontSize: FONT_SIZE}} >
        {weightByName}
      </text>
    </g>
  }
}

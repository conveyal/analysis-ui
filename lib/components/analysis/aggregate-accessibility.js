// @flow
/**
 * This component renders the aggregate accessibility display (histograms and percentiles).
 */

import React from 'react'
import {scaleLinear} from 'd3-scale'
import {format as d3Format} from 'd3-format'
import {sprintf} from 'sprintf-js'

import DeepEqualComponent from '../deep-equal'
import colors from '../../constants/colors'
import {Slider, Group} from '../input'
import messages from '../../utils/messages'

const WIDTH = 300
const HEIGHT = 225
const X_SCALE_HEIGHT = 30
const Y_SCALE_WIDTH = 30
const FONT_SIZE = 10

export default class AggregateAccessibility extends DeepEqualComponent {
  state = {
    /**
    * Percentile of aggregate accessibility to display. Note that this is inverted from what most
    * people might expect; the 90th percentile of accessibility means that 10% of the population
    * has access to this mean jobs (assuming you are using population-weighted job accessibility).
    */
    percentileOfAccessibility: 10
  }

  setPercentileOfAccessibility = (e) => {
    this.setState({ percentileOfAccessibility: e.target.value })
  }

  render () {
    return <div>
      {this.renderPlot()}
      {this.renderPercentileSlider()}
      {this.renderPercentileReadout()}
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
      {this.renderBins(aggregateAccessibility.bins, aggregateAccessibility.percentiles, colors.SCENARIO_PERCENTILE_COLOR)}
      {this.renderXScale()}
      {this.renderYScale()}
      {this.renderPercentileLine(aggregateAccessibility.percentiles, colors.SCENARIO_PERCENTILE_COLOR)}
      {comparisonAggregateAccessibility && <g>
        {this.renderBins(comparisonAggregateAccessibility.bins, comparisonAggregateAccessibility.percentiles, colors.COMPARISON_PERCENTILE_COLOR)}
        {this.renderPercentileLine(comparisonAggregateAccessibility.percentiles, colors.COMPARISON_PERCENTILE_COLOR)}
      </g>}
    </svg>
  }

  renderBins (bins: { value: number, min: number, max: number }[], percentiles: number[], color: string) {
    const {percentileOfAccessibility} = this.state
    const breakPoint = percentiles[percentileOfAccessibility] // where we break between the gray and colored plot
    return <g>
      {bins.map(({min, max, value}, i) => {
        if (max < breakPoint || min > breakPoint) {
          // normal bar, all one color
          return <rect
            x={this.xScale(min)}
            width={this.xScale(max) - this.xScale(min)}
            y={this.yScale(value)}
            height={this.yScale(0) - this.yScale(value)}
            style={{fill: min > breakPoint ? color : colors.STALE_PERCENTILE_COLOR, fillOpacity: 0.5}}
            key={`bin-${i}`} />
        } else {
          // part of this bar is above the cutoff percentile, part below, so render two bars
          return <g key={`bin-${i}.`}>
            <rect
              x={this.xScale(min)}
              width={this.xScale(breakPoint) - this.xScale(min)}
              y={this.yScale(value)}
              height={this.yScale(0) - this.yScale(value)}
              style={{fill: colors.STALE_PERCENTILE_COLOR, fillOpacity: 0.5}}
              />
            <rect
              x={this.xScale(breakPoint)}
              width={this.xScale(max) - this.xScale(breakPoint)}
              y={this.yScale(value)}
              height={this.yScale(0) - this.yScale(value)}
              style={{fill: color, fillOpacity: 0.5}}
              />)}
          </g>
        }
      })}
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

  /** Render a vertical line at the chosen percentile of accessibility */
  renderPercentileLine (percentiles: number[], color: string) {
    const {percentileOfAccessibility} = this.state
    return <line
      x1={this.xScale(percentiles[percentileOfAccessibility])}
      x2={this.xScale(percentiles[percentileOfAccessibility])}
      y1={0}
      y2={HEIGHT - X_SCALE_HEIGHT}
      style={{ stroke: color, strokeWidth: 0.5 }}
    />
  }

  renderPercentileSlider () {
    const {percentileOfAccessibility} = this.state
    return <Group label={messages.analysis.selectPercentileOfAccessibility} >
      <Slider
        width={WIDTH - Y_SCALE_WIDTH}
        min={1}
        max={99}
        step={1}
        value={percentileOfAccessibility}
        onChange={this.setPercentileOfAccessibility}
        style={{ left: Y_SCALE_WIDTH }} />
    </Group>
  }

  renderPercentileReadout () {
    const {percentileOfAccessibility} = this.state
    const {aggregateAccessibility, comparisonAggregateAccessibility, weightByName, accessToName, regionalAnalysisName, comparisonAccessToName, comparisonRegionalAnalysisName} = this.props

    const fmt = d3Format(',')

    return <div>
      {sprintf(messages.analysis.percentileOfAccessibility, {
        name: regionalAnalysisName,
        weightByName,
        accessToName,
         // invert: 90th percentile of accessibility means accessibility that high or greater is
         // experienced by 10% of the population
        percentage: 100 - percentileOfAccessibility,
        accessibility: fmt(Math.round(aggregateAccessibility.percentiles[percentileOfAccessibility]))
      })}
      <br />
      {comparisonAggregateAccessibility && sprintf(messages.analysis.percentileOfAccessibility, {
        name: comparisonRegionalAnalysisName,
        weightByName, // weighting is same for comparison
        accessToName: comparisonAccessToName,
         // invert: 90th percentile of accessibility means accessibility that high or greater is
         // experienced by 10% of the population
        percentage: 100 - percentileOfAccessibility,
        accessibility: fmt(Math.round(comparisonAggregateAccessibility.percentiles[percentileOfAccessibility]))
      })}
    </div>
  }
}

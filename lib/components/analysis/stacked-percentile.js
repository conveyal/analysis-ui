// @flow

/**
 * Display a stacked percentile chart.
 */

import React from 'react'
import {sprintf} from 'sprintf-js'
import DeepEqualComponent from '../deep-equal'
import {scalePow, scaleLinear} from 'd3-scale'
import {format} from 'd3-format'
import {line, area} from 'd3-shape'
import Boxplot from './boxplot'
import {SCENARIO, BASE, COMPARISON} from './spectrogram-selector'
import messages from '../../utils/messages'

import type {Component, Element} from 'react'

const BOX_PLOT_WIDTH = 0.1
// reversed because 5th percentile travel time has the highest accessibility
// TODO this is premised on the assumption that accessibility is done in 5-percentile steps on the backend
// That could change at some point.
// These are also used for the breaks when viewing a single scenario
const BOX_PLOT_ITEMS = [18, 14, 9, 4, 0]
const BOX_PLOT_PERCENTILES = [95, 75, 50, 25, 5]

// The plot gets too busy if we overlay two four-band plots. Instead, use a one-band plot (25th/75th pctiles)
const COMPARISON_BAND = [14, 4]
const COMPARISON_BAND_PERCENTILES = [75, 25]

const TEXT_HEIGHT = 10
const MAX_OPACITY = 0.5
const MAX_TRIP_DURATION = 120

type Props = {
  percentileCurves: number[][],
  comparisonPercentileCurves: number[][],
  isochroneCutoff: number,
  width: number,
  height: number,
  maxAccessibility: number,
  color: any,
  comparisonColor: any,
  selected: string,
  label: string,
  comparisonLabel: string
}

export default class StackedPercentile extends DeepEqualComponent<void, Props, void> {
  render (): Element {
    const {width, height, percentileCurves, color, comparisonPercentileCurves, comparisonColor, selected} = this.props

    this.yScale = this.createYScale()
    this.xScale = this.createXScale()

    const boxPlotWidth = comparisonPercentileCurves
      ? BOX_PLOT_WIDTH * width / 2
      : BOX_PLOT_WIDTH * width

    return <svg style={{width, height}}>
      <g>
        {<g transform={`translate(${comparisonPercentileCurves ? boxPlotWidth : 0})`}>
          {this.renderBoxPlot({
            percentileCurves,
            color,
            width: boxPlotWidth
          })}
        </g>}

        {comparisonPercentileCurves && this.renderBoxPlot({
          percentileCurves: comparisonPercentileCurves,
          color: comparisonColor,
          width: boxPlotWidth
        })}

        {this.renderMainPlot()}

        {selected !== BASE && this.renderCumulativeLine({
          curve: percentileCurves[9],
          color
        })}

        {selected !== SCENARIO && this.renderCumulativeLine({
          curve: comparisonPercentileCurves[9],
          color: comparisonColor
        })}

        {this.renderYAxis()}
        {this.renderXAxis()}
        {selected === COMPARISON ? this.renderComparisonLegend() : this.renderLegend()}
        {this.renderSliceLine()}
      </g>
    </svg>
  }

  /*
   * Render the curves as filled slices or as discrete curves depending on whether we're doing a
   * comparison. Filled slices are too busy when doing a comparison.
   */
  renderMainPlot () {
    const {percentileCurves, comparisonPercentileCurves, color, comparisonColor, selected} = this.props
    switch (selected) {
      case SCENARIO:
        return this.renderSlices({
          percentileCurves,
          color,
          breaks: BOX_PLOT_ITEMS
        })
      case BASE:
        return this.renderSlices({
          percentileCurves: comparisonPercentileCurves,
          color: comparisonColor,
          breaks: BOX_PLOT_ITEMS
        })
      case COMPARISON:
        return <g>
          {this.renderSlices({
            percentileCurves,
            color,
            breaks: COMPARISON_BAND
          })}
          {this.renderSlices({
            percentileCurves: comparisonPercentileCurves,
            color: comparisonColor,
            breaks: COMPARISON_BAND
          })}
        </g>
    }
  }

  renderBoxPlot ({ percentileCurves, color, width }: {
    percentileCurves: number[][],
    color: any,
    width: number
  }): Component {
    const {isochroneCutoff} = this.props
    const [low, iqrLow, med, iqrHigh, high] = BOX_PLOT_ITEMS
      .map(i => percentileCurves[i][isochroneCutoff - 1])

    return <Boxplot
      low={low}
      iqrLow={iqrLow}
      med={med}
      iqrHigh={iqrHigh}
      high={high}
      width={width}
      scale={this.yScale}
      color={color}
      />
  }

  renderYAxis (): Element {
    const {indicator, width, height} = this.props
    const tickFormat = format('.3s')

    // make sure that the top tick is not off the screen
    const maxYValueWithTextOnScreen = this.yScale.invert(TEXT_HEIGHT / 2)
    const trimmedYScale = scalePow()
      .exponent(0.5)
      .domain([0, maxYValueWithTextOnScreen])
      .range([height, TEXT_HEIGHT / 2])

    // y scale
    const yTicks = trimmedYScale.ticks(5)

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
          key={`y-tick-${text}`}
          y={off}
          >
          {text}
        </text>)}
    </g>
  }

  renderXAxis (): Element {
    const {height} = this.props
    return <g transform={`translate(0 ${height})`}>
      {/* We don't explicitly center the '15 minutes' text; fudge the left side a bit so that the 15 appears centered */}
      {[15, 30, 45, 60, 75, 90, 105, 120].map(v => <text
        x={v === 15 ? this.xScale(v) - TEXT_HEIGHT / 2 : this.xScale(v)}
        y={0}
        key={`x-tick-${v}`}
        style={{
          textAnchor: v === 120
            ? 'end' // don't run off end, fudge position of 120 a bit
            : v === 15
            ? 'start' // don't center the whole '15 minutes' text
            : 'middle'
        }}
        >
        {/* label first minute */}
        {v === 15 ? sprintf(messages.analysis.minutes, v) : v}
      </text>
      )}
    </g>
  }

  // TODO put this in its own DeepEqualComponent so it is not re-rendered when the cutoff changes
  /** boundaries are the boundaries between slices, as array indices in percentileCurves */
  renderSlices ({ percentileCurves, color, breaks }: {
    percentileCurves: number[][],
    color: any,
    breaks: number[]
  }): Element {
    const sliceArea = area()
      .x1((d, i) => this.xScale(i + 1))
      .x0((d, i) => this.xScale(i + 1))
      .y0(d => this.yScale(d[0]))
      .y1(d => this.yScale(d[1]))

    // a "slice" is the segment between two percentile curves
    const slices = []
    for (let slice = breaks.length - 1; slice > 0; slice--) {
      // slice - 1 has a higher accessibility value because it is from a less reliable travel time
      const combinedValues = percentileCurves[breaks[slice]].map((d, i) => ([d, percentileCurves[breaks[slice - 1]][i]]))
      slices.push(combinedValues)
    }

    return <g>
      {slices.map((d, i, a) => {
        const opacity = (i + 1) * MAX_OPACITY / (a.length + 1)
        return <path
          key={`slice-${i}`}
          d={sliceArea(d)}
          style={{fill: color, fillOpacity: opacity}}
        />
      })}
    </g>
  }

  renderCumulativeLine ({ curve, color }: {
    curve: number[],
    color: any
  }): Element {
    const percentileLine = line()
      .x((d, i) => this.xScale(i + 1))
      .y(d => this.yScale(d))

    return <path
      d={percentileLine(curve)}
      style={{
        stroke: color,
        strokeWidth: 0.5,
        fill: 'none'
      }}
    />
  }

  renderSliceLine (): Element {
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

  renderLegend (): Element {
    const {selected, color, width, height, comparisonColor} = this.props

    const currentColor = selected === SCENARIO ? color : comparisonColor
    const squareSize = TEXT_HEIGHT * 1.5
    const textOffset = squareSize * 1.5

    return <g transform={`translate(${width * 0.9} ${height * 0.7})`}>
      <text x={textOffset + TEXT_HEIGHT * 2} y={0} style={{textAnchor: 'end'}}>
        {messages.analysis.travelTimePercentile}
      </text>
      {/* Colors */}
      {BOX_PLOT_PERCENTILES.slice(1).map((d, i, a) => <rect
        x={0}
        y={i * squareSize + TEXT_HEIGHT * 1.5}
        width={squareSize}
        height={squareSize}
        key={`legend-${i}`}
        style={{
          fill: currentColor,
          fillOpacity: (i + 1) * MAX_OPACITY / (a.length + 1)
        }}
        />)}
      {/* labels, subtract i from length because 95th percentile travel time should be at the bottom */}
      {BOX_PLOT_PERCENTILES.map((d: number, i: number, a: number[]) => <text
        x={textOffset}
        y={(a.length - 1 - i) * squareSize + TEXT_HEIGHT * 1.5}
        key={`legend-text-${i}`}
        style={{
          alignmentBaseline: 'middle'
        }}
        >
        {d}
      </text>)
      }
    </g>
  }

  renderComparisonLegend (): Element {
    const { color, comparisonColor, label, width, height, comparisonLabel } = this.props
    const squareSize = TEXT_HEIGHT * 1.5
    const textOffset = squareSize * 1.5
    const titleOffset = TEXT_HEIGHT * 1.5

    return <g transform={`translate(${width * 0.9} ${height * 0.7})`}>
      <text x={textOffset + TEXT_HEIGHT * 2} y={0} style={{textAnchor: 'end'}}>
        {messages.analysis.travelTimePercentile}
      </text>

      <rect
        x={0}
        y={titleOffset}
        width={squareSize}
        height={squareSize}
        style={{
          fill: color,
          fillOpacity: 0.5 * MAX_OPACITY // value when there is only one band
        }}
      />

      <text x={textOffset} y={titleOffset} style={{alignmentBaseline: 'middle'}}>
        {/* [1] because travel time percentiles are reversed in accessibility */}
        {COMPARISON_BAND_PERCENTILES[1]}
      </text>

      <text x={textOffset} y={titleOffset + squareSize} style={{alignmentBaseline: 'middle'}}>
        {/* [1] because travel time percentiles are reversed in accessibility */}
        {COMPARISON_BAND_PERCENTILES[0]}
      </text>

      {/* variant label */}
      <text
        x={-1 * (textOffset - squareSize)}
        y={titleOffset + squareSize / 2}
        style={{
          alignmentBaseline: 'middle',
          textAnchor: 'end'
        }} >
        {label}
      </text>

      <rect
        x={0}
        y={titleOffset + squareSize * 3}
        width={squareSize}
        height={squareSize}
        style={{
          fill: comparisonColor,
          fillOpacity: 0.5 * MAX_OPACITY // value when there is only one band
        }}
      />

      <text x={textOffset} y={titleOffset + squareSize * 3} style={{alignmentBaseline: 'middle'}}>
        {/* [1] because travel time percentiles are reversed in accessibility */}
        {COMPARISON_BAND_PERCENTILES[1]}
      </text>

      <text x={textOffset} y={titleOffset + squareSize * 4} style={{alignmentBaseline: 'middle'}}>
        {/* [1] because travel time percentiles are reversed in accessibility */}
        {COMPARISON_BAND_PERCENTILES[0]}
      </text>

      {/* variant label */}
      <text
        x={-1 * (textOffset - squareSize)}
        y={titleOffset + squareSize * 3 + squareSize / 2}
        style={{
          alignmentBaseline: 'middle',
          textAnchor: 'end'
        }} >
        {comparisonLabel}
      </text>
    </g>
  }

  createYScale (): (number) => number {
    const {height, maxAccessibility} = this.props
    return scalePow()
      .exponent(0.5)
      .domain([0, maxAccessibility])
      .range([height, 0])
  }

  createXScale (): (number) => number {
    const {width} = this.props
    return scaleLinear()
      .domain([1, MAX_TRIP_DURATION])
      .range([BOX_PLOT_WIDTH * width, width])
  }
}

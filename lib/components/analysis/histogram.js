/**
 * Display a histogram, i.e. a slice of the spectrogram
 */

import {parseColor} from 'd3-color'
import {format} from 'd3-format'
import {scaleLinear} from 'd3-scale'
import React, { Component, PropTypes } from 'react'

import colors from '../../constants/colors'

// TODO constants copied from spectrogram.js
const BINS = 100
const MINUTES = 120

export default class Histogram extends Component {
  static propTypes = {
    data: PropTypes.array,
    isochroneCutoff: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number
  }

  render () {
    const { data, comparisonData, isochroneCutoff, width, height, isFetchingIsochrone } = this.props

    const maxAccessibility = comparisonData
     ? computeMaxAccessibility(data, comparisonData)
     : computeMaxAccessibility(data)

    const chartData = computeChartData(data, maxAccessibility, isochroneCutoff)

    const comparisonChartData = comparisonData ? computeChartData(comparisonData, maxAccessibility, isochroneCutoff) : null

    const maxBarHeight = height * 0.75

    const barWidth = width / BINS

    const scenarioColor = isFetchingIsochrone
      ? colors.STALE_ISOCHRONE_COLOR
      : colors.SCENARIO_ISOCHRONE_COLOR
    const comparisonColor = isFetchingIsochrone
      ? colors.STALE_ISOCHRONE_COLOR
      : colors.COMPARISON_ISOCHRONE_COLOR

    return <svg
      width={width}
      height={height}
      >
      <g>
        {comparisonChartData &&
          this.renderBars(comparisonChartData, barWidth, maxBarHeight, comparisonColor)}
        {this.renderBars(chartData, barWidth, maxBarHeight, scenarioColor)}
        {this.renderLabels(barWidth, maxBarHeight, maxAccessibility)}
      </g>
    </svg>
  }

  renderBars (chartData, barWidth, maxBarHeight, color) {
    let rgba = parseColor(color)
    rgba.opacity = 0.4
    rgba += ''

    // separate yScale for each dataset because there can be a different number of iterations but
    // the sum of the bar areas should still be the same
    const yScale = scaleLinear()
      .domain([0, Math.max(...chartData)])
      .range([0, maxBarHeight])

    return <g>
      {Array.prototype.map.call(chartData, (val, idx) => {
        const height = yScale(val)
        return <rect
          x={barWidth * idx}
          y={maxBarHeight - height}
          width={barWidth}
          height={height}
          style={{fill: rgba}}
          key={`${color}-bar-${idx}`} // using color as key as it identifies datasets
          />
      })}
    </g>
  }

  renderLabels (barWidth, barHeight, maxAccessibility) {
    const humanFormat = format('.3s')

    const xScale = scaleLinear()
      .domain([0, maxAccessibility])
      .range([0, barWidth * BINS])

    const labels = xScale.ticks(5).map((tick, i) => {
      // NB labels are for the left side of the bar
      const x = xScale(tick)
      const y = barHeight + 10
      return <text
        key={`label-${i}`}
        x={x}
        y={y}
        transform={`rotate(45 ${x} ${y})`}
        style={{fontSize: '12px'}}
        >{humanFormat(tick)}</text>
    })

    return <g>
      {labels}
    </g>
  }
}

/** compute the maximum accessibility in any of the spectrogram data objects */
function computeMaxAccessibility (...datasets) {
  let maxAccessibility = 0
  for (const data of datasets) {
    for (let iteration = 0; iteration < data.length; iteration++) {
      const marginals = data[iteration]
      let val = 0
      for (let minute = 0; minute < MINUTES; minute++) {
        val += marginals[minute]
        // don't stop at isochrone cutoff, keep x scale consistent as we change the cutoff
      }
      if (val > maxAccessibility) maxAccessibility = val
    }
  }

  return maxAccessibility
}

/** Compute chart data from spectrogram data */
function computeChartData (data, maxAccessibility, isochroneCutoff) {
  // compute chart data
  let chartData = new Uint16Array(BINS)

  const accessibilityPerIteration = []

  // compute accessibility
  // NB we compute the max accessibility _for the entire time range_ so the scale remains constant
  // TODO all of this code needs to be checked for off-by-one errors
  for (let iteration = 0; iteration < data.length; iteration++) {
    const marginals = data[iteration]
    let val = 0
    for (let minute = 0; minute < MINUTES; minute++) {
      val += marginals[minute]

      if (minute === isochroneCutoff) {
        accessibilityPerIteration.push(val)
      }
    }
  }

  const binWidth = maxAccessibility / BINS

  for (let access of accessibilityPerIteration) {
    chartData[(access / binWidth) | 0]++
  }

  return chartData
}

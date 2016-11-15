/**
 * Display a histogram, i.e. a slice of the spectrogram
 */

import React, { Component, PropTypes } from 'react'
import {Bar as BarChart} from 'react-chartjs'

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
    let { data, isochroneCutoff, width, height } = this.props

    // compute chart data
    let chartData = new Uint16Array(BINS)

    let maxAccessibility = 0
    let accessibilityPerIteration = []

    // compute accessibility
    // NB we compute the max accessibility _for the entire time range_ so the scale remains constant
    // TODO all of this code needs to be checked for off-by-one errors
    for (let iteration = 0; iteration < data.length; iteration++) {
      let marginals = data[iteration]
      let val = 0
      for (let minute = 0; minute < MINUTES; minute++) {
        val += marginals[minute]

        if (minute === isochroneCutoff) {
          accessibilityPerIteration.push(val)
        }
      }

      if (val > maxAccessibility) maxAccessibility = val
    }

    let binWidth = maxAccessibility / BINS

    for (let access of accessibilityPerIteration) {
      chartData[(access / binWidth) | 0]++
    }

    let labels = []

    for (let i = 0; i < BINS; i++) {
      if (i % 20 === 0) {
        labels.push('' + Math.round((i + 0.5) * binWidth))
      } else {
        labels.push('')
      }
    }

    return <BarChart
      width={width}
      height={height}
      data={{
        labels,
        datasets: [{
          data: chartData
        }]
      }}
      options={{ animation: false }} /* Things change smoothly anyhow, make it fast */
      />
  }
}

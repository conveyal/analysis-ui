/** The spectrogram component showing a detailed accessibility plot */

import {format} from 'd3-format'
import {interpolateLab} from 'd3-interpolate'
import {scaleLinear, scaleLog, scalePow} from 'd3-scale'
import {color as parseColor} from 'd3-color'
import React, { Component, PropTypes } from 'react'

const MINUTES = 120
const TEXT_HEIGHT = 12 // height of text in pixels

export const LINEAR = 'linear'
export const LOG = 'log'
export const SQUARE_ROOT = 'square root'

export default class Spectrogram extends Component {
  static propTypes = {
    scale: PropTypes.string,
    data: PropTypes.array,
    isochroneCutoff: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    indicator: PropTypes.string,
    positiveColors: PropTypes.array,
    // stops for above colors in terms of probability
    positiveColorStops: PropTypes.array,
    /** as above, but for probabilities of differences < 0 */
    negativeColors: PropTypes.array,
    negativeColorStops: PropTypes.array,
    backgroundColor: PropTypes.string,
    textColor: PropTypes.string,
    bins: PropTypes.number,
    difference: PropTypes.bool,
    maxAccessibility: PropTypes.number
  }

  static defaultProps = {
    scale: SQUARE_ROOT,
    positiveColors: ['black', 'blue', 'orange', 'white'],
    positiveColorStops: [0, 0.01, 0.1, 1],
    textColor: '#7fabd9',
    bins: 100,
    difference: false
  }

  state = getStateFromProps(this.props)

  componentWillReceiveProps (nextProps) {
    this.setState(getStateFromProps(nextProps))
  }

  componentDidMount () {
    this.draw()
  }

  componentDidUpdate () {
    this.draw()
  }

  render () {
    const { width, height, bins } = this.props
    return <canvas
      ref={(canvas) => { this.canvas = canvas }}
      width={width - width % MINUTES}
      height={height - height % bins}
      />
  }

  draw = () => {
    let {
      data,
      isochroneCutoff,
      scale,
      width,
      height,
      indicator,
      positiveColorStops,
      negativeColorStops,
      textColor,
      bins,
      difference,
      maxAccessibility
    } = this.props

    width = width - width % MINUTES // make nice integer divisors
    height = height - height % bins

    let scaleX = width / MINUTES
    let scaleY = height / bins

    let iterations = data.length

    // make data cumulative
    let cumulative = []

    for (let i = 0; i < iterations; i++) cumulative.push([data[i][0]])

    // make all values cumulative first
    for (let minute = 1; minute < MINUTES; minute++) {
      for (let iteration = 0; iteration < iterations; iteration++) {
        let val = cumulative[iteration][minute - 1] + data[iteration][minute]
        cumulative[iteration].push(val)
      }
    }

    if (maxAccessibility == null) {
      maxAccessibility = Math.max(...cumulative.map((arr) => Math.max(...arr)))
      if (difference) {
        // if it's a difference, find the largest magnitude value
        maxAccessibility = Math.max(maxAccessibility, -Math.min(...cumulative.map(arr => Math.min(...arr))))
      }
    }

    iterations = cumulative.length

    // grid is row-major order, with columns indicating a particular minute of the cumulative accessibiltiy graph
    // and rows indicating the number of iterations having the given accessibility value. So row 0 has the highest recorded accessibility of any iteration
    // at 120 minutes, and so on
    this.grid = new Uint16Array(MINUTES * bins)

    let maxPixelValue = 0

    let yScale

    const range = difference
      // if we're doing a difference we split the range in half, map positive to rows 0 - 49 if there are 100 bins
      ? [bins / 2 - 1, 0]
      : [bins - 1, 0]

    if (scale === LINEAR) {
      yScale = scaleLinear()
        .domain([0, maxAccessibility])
        .range(range)
    } else if (scale === LOG) {
      yScale = scaleLog()
        .domain([1, maxAccessibility])
        // clamp because log(0) = -Infinity, this is fine as long as maxAccessibility is large
        .clamp(true)
        .range(range)
    } else if (scale === SQUARE_ROOT) {
      yScale = scalePow()
        .exponent(0.5) // x^0.5 is sqrt(x)
        .domain([0, maxAccessibility])
        .range(range)
    }

    for (let iteration = 0; iteration < iterations; iteration++) {
      for (let minute = 0; minute < MINUTES; minute++) {
        let yPixel
        let val = cumulative[iteration][minute]
        if (difference) {
          if (val >= 0) {
            yPixel = Math.round(yScale(val))
          } else {
            // yScale is 0 - 49 if there are 100 bins, so map to rows 50 - 99
            yPixel = bins - 1 - Math.round(yScale(-val))
          }
        } else {
          yPixel = Math.round(yScale(val))
        }
        this.grid[yPixel * MINUTES + minute] += 1

        if (this.grid[yPixel * MINUTES + minute] === undefined) {
          console.log('undefined!!')
        }

        maxPixelValue = Math.max(maxPixelValue, this.grid[yPixel * MINUTES + minute])
      }
    }

    const colorScale = this.state.colorScale
      .copy()
      .domain(positiveColorStops.map((i) => i * maxPixelValue))

    const negativeColorScale = this.state.negativeColorScale
      .copy()
      .domain(negativeColorStops.map((i) => i * maxPixelValue))

    // draw the canvas
    let ctx = this.canvas.getContext('2d')
    let id = ctx.createImageData(MINUTES * scaleX, bins * scaleY)

    for (let gridx = 0; gridx < MINUTES; gridx++) {
      for (let gridy = 0; gridy < bins; gridy++) {
        let cell = gridy * MINUTES + gridx

        // if we're doing a difference and we're showing the probability of a negative number,
        // use the appropriate color scale
        const pixelColorString = difference && gridy > bins / 2
          ? negativeColorScale(this.grid[cell])
          : colorScale(this.grid[cell])

        const parsedPixelColor = parseColor(pixelColorString)

        for (let xoff = 0; xoff < scaleX; xoff++) {
          for (let yoff = 0; yoff < scaleY; yoff++) {
            let pixel = (gridy * scaleY + yoff) * MINUTES * scaleX + gridx * scaleX + xoff
            // set to correct color, fully opaque
            id.data.set([parsedPixelColor.r, parsedPixelColor.g, parsedPixelColor.b, 255], pixel * 4)
          }
        }
      }
    }

    ctx.putImageData(id, 0, 0)

    ctx.font = `${TEXT_HEIGHT}px "Helvetica Neue", sans-serif `
    ctx.fillStyle = textColor

    // draw vertical line at isochrone cutoff
    let x = isochroneCutoff * scaleX
    ctx.strokeStyle = textColor
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, bins * scaleY)
    ctx.stroke()

    // draw scales on top
    // x scale
    let offset = bins * scaleY - TEXT_HEIGHT / 1.75
    for (let minute = 15; minute < 121; minute += 15) {
      const {width} = ctx.measureText(minute)
      ctx.fillText(minute, minute * scaleX - (minute === 120 ? width + 3 : width / 2), offset)
    }

    // clamp back y scale for ticks, so they do not run off the top
    const textHeightInBins = TEXT_HEIGHT / height / bins / 2

    // We reduce domain and range equally, setting the top of the domain to be the place that is
    // mapped to the top of the range in the existing scale (hence the invert call)
    const newMax = yScale.invert(textHeightInBins)
    yScale = yScale
      .domain([0, newMax])
      .range([yScale.range()[0], textHeightInBins])

    const tickFormat = format('.3s')

    // y scale
    const yTicks = yScale.ticks(5)

    yTicks.forEach((tick, i, arr) => {
      let yoff = yScale(tick) * scaleY

      // don't draw a label on top of the x axis labels
      if (yoff > offset - TEXT_HEIGHT) return

      const tickText = tickFormat(tick)

      // highest valued tick gets label, move ticks down a little so the middle of the text is on
      // the line.
      ctx.fillText(i === arr.length - 1 ? `${tickText} ${indicator}` : tickText, 0, yoff + TEXT_HEIGHT / 2)
    })

    // if it's a difference draw the negative scale as well
    if (difference) {
      // skip first tick, generally will be zero and will wind up atop positive tick
      yTicks.slice(1).forEach((tick, i, arr) => {
        let yoff = (bins - 1 - yScale(tick)) * scaleY

        // don't draw a label on top of the x axis labels
        if (yoff > offset - TEXT_HEIGHT) return

        const tickText = tickFormat(-tick)

        // highest valued tick gets label, move ticks down a little so the middle of the text is on
        // the line.
        ctx.fillText(i === arr.length - 1 ? `${tickText} ${indicator}` : tickText, 0, yoff + TEXT_HEIGHT / 2)
      })
    }

    // color scale
    let colorOffsetX = scaleX * (MINUTES - 5)
    let textOffsetX = colorOffsetX - 45
    let offsetY = bins * scaleY - 150

    ctx.strokeStyle = '#fff'

    for (let p of [...positiveColorStops, 1].reverse()) {
      ctx.fillText(p, textOffsetX, offsetY + TEXT_HEIGHT)
      let oldFillStyle = ctx.fillStyle
      ctx.fillStyle = colorScale(p * maxPixelValue)
      ctx.fillRect(colorOffsetX, offsetY, TEXT_HEIGHT * 2, TEXT_HEIGHT)
      ctx.strokeRect(colorOffsetX, offsetY, TEXT_HEIGHT * 2, TEXT_HEIGHT)
      ctx.fillStyle = oldFillStyle
      offsetY += TEXT_HEIGHT * 1.5
    }
  }
}

function getStateFromProps ({
  negativeColors,
  positiveColors
}) {
  return {
    colorScale: scaleLinear()
      .interpolate(interpolateLab)
      .range(positiveColors),
    negativeColorScale: scaleLinear()
      .interpolate(interpolateLab)
      .range(negativeColors)
  }
}

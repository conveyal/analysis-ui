/** The spectrogram component showing a detailed accessibility plot */

import React, { Component, PropTypes } from 'react'
import chroma from 'chroma-js'
import {scaleLinear, scaleLog, scalePow} from 'd3-scale'

const STEPS = 100
const MINUTES = 120
const TEXT_HEIGHT = 10 // height of text in canvas scales
const TEXT_COLOR = '#7fabd9'

export default class Spectrogram extends Component {
  static LINEAR = 'linear'
  static LOG = 'log'
  static SQUARE_ROOT = 'square root'

  static propTypes = {
    scale: PropTypes.string,
    data: PropTypes.array,
    isochroneCutoff: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    indicator: PropTypes.string
  }

  static defaultProps = {
    scale: Spectrogram.SQUARE_ROOT
  }

  render () {
    let { width, height } = this.props
    return <canvas
      ref={(canvas) => { this.canvas = canvas }}
      width={width - width % MINUTES}
      height={height - height % STEPS}
      />
  }

  componentDidMount () {
    this.draw()
  }

  componentDidUpdate () {
    this.draw()
  }

  draw = () => {
    let { data, isochroneCutoff, scale, width, height, indicator } = this.props

    width = width - width % MINUTES // make nice integer divisors
    height = height - height % STEPS

    let scaleX = width / MINUTES
    let scaleY = height / STEPS

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

    let maxAccessibility = Math.max(...cumulative.map((arr) => Math.max(...arr)))
    iterations = cumulative.length

    // grid is row-major order, with columns indicating a particular minute of the cumulative accessibiltiy graph
    // and rows indicating the number of iterations having the given accessibility value. So row 0 has the highest recorded accessibility of any iteration
    // at 120 minutes, and so on
    this.grid = new Uint16Array(MINUTES * STEPS)

    let maxPixelValue = 0

    let yScale

    if (scale === Spectrogram.LINEAR) {
      yScale = scaleLinear()
        .domain([0, maxAccessibility])
        .range([STEPS - 1, 0])
    } else if (scale === Spectrogram.LOG) {
      yScale = scaleLog()
        .domain([1, maxAccessibility])
        // clamp because log(0) = -Infinity, this is fine as long as maxAccessibility is large
        .clamp(true)
        .range([STEPS - 1, 0])
    } else if (scale === Spectrogram.SQUARE_ROOT) {
      yScale = scalePow()
        .exponent(0.5) // x^0.5 is sqrt(x)
        .domain([0, maxAccessibility])
        .range([STEPS - 1, 0])
    }

    for (let iteration = 0; iteration < iterations; iteration++) {
      for (let minute = 0; minute < MINUTES; minute++) {
        let yPixel = Math.floor(yScale(cumulative[iteration][minute]))
        this.grid[yPixel * MINUTES + minute] += 1

        if (this.grid[yPixel * MINUTES + minute] === undefined) {
          console.log('undefined!!')
        }

        maxPixelValue = Math.max(maxPixelValue, this.grid[yPixel * MINUTES + minute])
      }
    }

    const colorScale = chroma
      .scale(['black', 'blue', 'orange', 'white'])
      .mode('lab')
      .domain([0, 0.01, 0.1, 1].map((i) => i * maxPixelValue))

    // draw the canvas
    let ctx = this.canvas.getContext('2d')
    let id = ctx.createImageData(MINUTES * scaleX, STEPS * scaleY)

    for (let gridx = 0; gridx < MINUTES; gridx++) {
      for (let gridy = 0; gridy < STEPS; gridy++) {
        let cell = gridy * MINUTES + gridx
        let col = colorScale(this.grid[cell]).rgb()

        for (let xoff = 0; xoff < scaleX; xoff++) {
          for (let yoff = 0; yoff < scaleY; yoff++) {
            let pixel = (gridy * scaleY + yoff) * MINUTES * scaleX + gridx * scaleX + xoff
            id.data.set(col, pixel * 4)
            id.data[pixel * 4 + 3] = 255 // opaque
          }
        }
      }
    }

    ctx.putImageData(id, 0, 0)

    ctx.font = `${TEXT_HEIGHT}px monospace`
    ctx.fillStyle = TEXT_COLOR

    // draw vertical line at isochrone cutoff
    let x = isochroneCutoff * scaleX
    ctx.strokeStyle = '#fff'
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, STEPS * scaleY)
    ctx.stroke()

    // draw scales on top
    // x scale
    let offset = STEPS * scaleY - TEXT_HEIGHT / 1.75
    for (let minute = 0, i = 0; minute < 121; minute += 15, i++) {
      ctx.fillText(i === 0 ? `${minute} minutes` : minute, minute * scaleX - (minute === 120 ? 30 : 0), offset)
    }

    // y scale
    yScale.ticks(5).forEach((tick, i, arr) => {
      let yoff = yScale(tick) * scaleY

      // don't draw a label on top of the x axis labels
      if (yoff > offset - TEXT_HEIGHT) return

      let tickText = tick.toExponential()

      // highest valued tick gets label
      ctx.fillText(i === arr.length - 1 ? `${tickText} ${indicator}` : tickText, 0, yoff)
    })

    // color scale
    let colorOffsetX = scaleX * (MINUTES - 5)
    let textOffsetX = colorOffsetX - 45
    let offsetY = STEPS * scaleY - 150

    ctx.strokeStyle = '#fff'

    for (let p of [1, 0.1, 0.05, 0.01, 0]) {
      ctx.fillText(p, textOffsetX, offsetY + TEXT_HEIGHT)
      let oldFillStyle = ctx.fillStyle
      ctx.fillStyle = colorScale(p * maxPixelValue).hex()
      ctx.fillRect(colorOffsetX, offsetY, TEXT_HEIGHT * 2, TEXT_HEIGHT)
      ctx.strokeRect(colorOffsetX, offsetY, TEXT_HEIGHT * 2, TEXT_HEIGHT)
      ctx.fillStyle = oldFillStyle
      offsetY += TEXT_HEIGHT * 1.5
    }
  }
}

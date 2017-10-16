// @flow
import React, {PureComponent} from 'react'
import {format} from 'd3-format'
import {color as parseColor} from 'd3-color'

/** Display a map legend */
export default class Legend extends PureComponent {
  props: {
    breaks: number[],
    colors: string[],
    min: number
  }

  render () {
    const {breaks, colors, min} = this.props
    return (
      <ul className='Legend'>
        {breaks.map((br, i) => (
          <Break
            bottom={i === 0 ? min : breaks[i - 1]} // special case, lower end of first class not in breaks
            color={colors[i]}
            key={`break-${i}`}
            top={br}
          />
        ))}
      </ul>
    )
  }
}

function Break ({
  bottom,
  color,
  top
}: {
  bottom: number,
  color: string,
  top: number
}) {
  const textFormat = format(',.0f')
  // using color below in key because top/bottom may not be unique if there are, say, no values below
  // zero and multiple classes are 0-0
  // remove opacity variation in colors
  const parsedColor = parseColor(color)
  parsedColor.opacity = 1
  return (
    <li key={`break-${parsedColor}`}>
      <div
        className='Legend-Item'
        style={{
          backgroundColor: parsedColor + ''
        }}
      />
      {textFormat(bottom)}–{textFormat(top)}
    </li>
  )
}

//
import React, {PureComponent} from 'react'
import {format} from 'd3-format'
import {color as parseColor} from 'd3-color'

import {isLight} from '../../utils/rgb-color-contrast'

/** Display a map legend */
export default class Legend extends PureComponent {
  render() {
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

function Break(props) {
  const textFormat = format(',.0f')
  // using color below in key because top/bottom may not be unique if there are, say, no values below
  // zero and multiple classes are 0-0
  // remove opacity variation in colors
  const parsedColor = parseColor(props.color)
  parsedColor.opacity = 1
  return (
    <li
      key={`break-${parsedColor}`}
      className='Legend-Item'
      style={{
        backgroundColor: parsedColor + '',
        color: isLight(parsedColor) ? '#000' : '#fff'
      }}
    >
      {textFormat(props.bottom)} to {textFormat(props.top)}
    </li>
  )
}

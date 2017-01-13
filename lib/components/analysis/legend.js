/** Display a map legend */

import React, { Component, PropTypes } from 'react'
import {format} from 'd3-format'
import {color as d3Color} from 'd3-color'

export default class Legend extends Component {
  static propTypes = {
    // the breaks (tops of each category)
    breaks: PropTypes.array.isRequired,
    // colors
    colors: PropTypes.array.isRequired,
    // the lowest value (not included in breaks)
    min: PropTypes.number.isRequired
  }

  render () {
    const { breaks, colors, min } = this.props
    return <ul className='Legend'>
      {breaks.map((br, i) => this.renderBreak({
        top: br,
        bottom: i === 0 ? min : breaks[i - 1], // special case, lower end of first class not in breaks
        color: colors[i]
      }))}
    </ul>
  }

  renderBreak ({ top, bottom, color }) {
    const textFormat = format(',.0f')
    // using color below in key because top/bottom may not be unique if there are, say, no values below
    // zero and multiple classes are 0-0
    // remove opacity variation in colors
    const parsedColor = d3Color(color)
    parsedColor.opacity = 1
    return <li key={`break-${parsedColor}`}>
      <div style={{ width: 50, height: 25, backgroundColor: parsedColor + '', border: '1px solid #000' }} />
      {textFormat(bottom)}&ndash;{textFormat(top)}
    </li>
  }
}

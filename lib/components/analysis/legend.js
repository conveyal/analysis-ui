/** Display a map legend */

import React, { Component, PropTypes } from 'react'

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
    return <li>
      <div style={{ width: 50, height: 25, backgroundColor: color, border: '1px solid #000' }} />
      {bottom}&ndash;{top}
    </li>
  }
}

// @flow
import _max from 'lodash/max'
import React from 'react'
import {Sparklines} from 'react-sparklines'

const COLOR = '#fff'
const HEIGHT = 15
const MARGIN = 1
const OPACITY = 0.3
const WIDTH = 190

class SparklinesLine extends React.Component {
  render() {
    const {data, points, width, height, margin}  = this.props
    const linePoints = points.map(p => [p.x, p.y]).reduce((a, b) => a.concat(b))

    const closePolyPoints = [
      points[points.length - 1].x,
      height - margin,
      margin,
      height - margin,
      margin,
      points[0].y
    ]

    const fillPoints = linePoints.concat(closePolyPoints)

    const lineStyle = {
      stroke: COLOR,
      strokeWidth: '1',
      strokeLinejoin: 'round',
      strokeLinecap: 'round',
      fill: 'none'
    }
    const fillStyle = {
      stroke: 'none',
      strokeWidth: '0',
      fillOpacity: OPACITY,
      fill: COLOR,
      pointerEvents: 'auto'
    }

    return (
      <g>
        <polyline points={fillPoints.join(' ')} style={fillStyle} />
        <polyline points={linePoints.join(' ')} style={lineStyle} />
      </g>
    )
  }
}

export default function Sparkline ({data, max}) {
  return <Sparklines
    data={data}
    margin={MARGIN}
    max={max || _max(data)}
    height={HEIGHT}
    width={WIDTH}>
    <SparklinesLine />
  </Sparklines>
}

import React from 'react'
import uuid from 'uuid'

import GeoJsonMousedown from './geojson-mousedown'

export default function Segments ({onMousedown, segments}) {
  return (
    <g>
      {segments
        .filter(segment => segment.geometry.type !== 'Point') // if there's just a single stop, don't render an additional marker
        .map(segment => {
          return {
            type: 'Feature',
            properties: {},
            geometry: segment.geometry
          }
        })
        .map((feature, index) => (
          <GeoJsonMousedown
            data={feature}
            key={uuid.v4()} // GeoJSON layers don't update on props change, so use a UUID as key to force replacement on redraw
            onMousedown={e => onMousedown(e, index)}
          />
        ))}
    </g>
  )
}

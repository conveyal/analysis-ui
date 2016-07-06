import React from 'react'

import DirectionIcon from './direction-icon'
import {getBearingAndCoordinatesAlongLine} from '../utils/markers'

const DirectionalMarkers = ({
  color,
  patterns
}) => {
  return <span>
    {patterns.map((pattern, i) => {
      return getBearingAndCoordinatesAlongLine({coordinates: pattern.geometry.coordinates})
        .map((m, j) => {
          return <DirectionIcon
            bearing={m.bearing}
            color={color}
            coordinates={m.coordinates}
            key={`direction-icon-${i}-${j}-${m.coordinates[0]}-${m.coordinates[1]}-${m.bearing}`}
            />
        })
    })}
  </span>
}

export default DirectionalMarkers

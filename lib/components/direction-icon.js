/** an icon that is an arrow pointing in a particular direction */

import {DivIcon, point} from 'leaflet'
import React from 'react'
import {Marker} from 'react-leaflet'

import {pure} from './deep-equal'

class LeafletDirectionIcon extends DivIcon {
  // NB nonstandard constructor name for Leaflet
  initialize ({bearing, color = '#000', iconSize = 16}) {
    super.initialize({
      html: `<i class="fa fa-arrow-up" style="font-size: ${iconSize}px; color: ${color}; transform: rotate(${bearing}deg)"></i>`,
      iconSize: point(iconSize, iconSize),
      className: 'DirectionIcon'
    })
  }
}

// in typical leaflet fashion, make a function to create the class
const DirectionIcon = pure(function DirectionIcon ({
  bearing,
  clickable,
  color,
  coordinates,
  iconSize
}) {
  return <Marker
    clickable={clickable}
    icon={new LeafletDirectionIcon({bearing, color, iconSize})}
    position={[coordinates[1], coordinates[0]]}
    />
})

export default DirectionIcon

import {DivIcon, point} from 'leaflet'
import React from 'react'
import {Marker} from 'react-leaflet'

// in typical leaflet fashion, make a function to create the class
class LeafletDirectionIcon extends DivIcon {
  // NB nonstandard constructor name for Leaflet
  initialize({bearing, color = '#000', iconSize = 16}) {
    super.initialize({
      html: `<i class="fa fa-arrow-up" style="font-size: ${iconSize}px; color: ${color}; transform: rotate(${bearing}deg)"></i>`,
      iconSize: point(iconSize, iconSize),
      className: 'DirectionIcon'
    })
  }
}

/**
 * An icon that is an arrow pointing in a particular direction.
 */
export default React.memo(function DirectionIcon(p) {
  return (
    <Marker
      clickable={p.clickable}
      icon={new LeafletDirectionIcon(p)}
      position={[p.coordinates[1], p.coordinates[0]]}
    />
  )
})

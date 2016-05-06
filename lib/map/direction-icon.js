/** an icon that is an arrow pointing in a particular direction */

import { DivIcon, point } from 'leaflet'

class DirectionIcon extends DivIcon {
  // NB nonstandard constructor name for Leaflet
  initialize ({ iconSize = 16, color = '#000', bearing }) {
    super.initialize({
      html: `<i class="fa fa-arrow-up" style="font-size: ${iconSize}px; color: ${color}; transform: rotate(${bearing}deg)"></i>`,
      iconSize: point(iconSize, iconSize),
      className: 'DirectionIcon'
    })
  }
}

// in typical leaflet fashion, make a function to create the class
export default function directionIcon (opts) {
  return new DirectionIcon(opts)
}

/** render fontawesome icons as icons on a leaflet map. If a bearing is specified, will add a direction indicator. */

import { DivIcon, point } from 'leaflet'

class FontawesomeIcon extends DivIcon {
  // NB nonstandard constructor name for Leaflet
  initialize ({ icon, iconSize = 24, color = '#000', bearing = false }) {
    super.initialize({
      html: bearing === false
       ? `<i class="fa fa-${icon}" style="font-size: ${iconSize}px; color: ${color}"></i>`
       : `
       	  <i class="fa fa-${icon}" style="font-size: ${iconSize}px; color: ${color}"></i>
       	  <i class="fa fa-caret-up" style="font-size: ${iconSize}px; color: ${color}; transform-origin: 60% 135%; transform: translateY(-${iconSize * 1.75}px) rotate(${bearing}deg)"></i>
       `,
      iconSize: point(iconSize * 1.5, iconSize * 1.5),
      className: 'FontawesomeIcon'
    })
  }
}

// in typical leaflet fashion, make a function to create the class
export default function fontawesomeIcon (opts) {
  return new FontawesomeIcon(opts)
}

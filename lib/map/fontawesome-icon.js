/** render fontawesome icons as icons on a leaflet map */

import { DivIcon, point } from 'leaflet'

class FontawesomeIcon extends DivIcon {
  // NB nonstandard constructor name for Leaflet
  initialize ({ icon, iconSize = 24, color = '#000' }) {
    super.initialize({
      html: `<i class="fa fa-${icon}" style="font-size: ${iconSize}px; color: ${color}"></i>`,
      iconSize: point(iconSize, iconSize),
      className: 'FontawesomeIcon'
    })
  }
}

// in typical leaflet fashion, make a function to create the class
export default function fontawesomeIcon (opts) {
  return new FontawesomeIcon(opts)
}

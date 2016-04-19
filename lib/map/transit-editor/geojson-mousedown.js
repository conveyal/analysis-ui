/** A GeoJSON layer that has an onmousedown event that gets added to all layers */

import { GeoJson } from 'react-leaflet'

export default class GeoJsonMousedown extends GeoJson {
  componentDidMount () {
    super.componentDidMount()
    this.leafletElement.getLayers().forEach((l) => l.on('mousedown', this.props.onMousedown))
  }

  componentWillUnmount () {
    super.componentWillUnmount()
    this.leafletElement.getLayers().forEach((l) => l.off('mousedown', this.props.onMousedown))
  }
}

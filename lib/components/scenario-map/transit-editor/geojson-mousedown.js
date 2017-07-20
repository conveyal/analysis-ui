// @flow
import GeoJSON from 'react-leaflet/lib/GeoJSON'

/**
 * A GeoJSON layer that has an onmousedown event that gets added to all layers
 */
export default class GeoJSONMousedown extends GeoJSON {
  componentDidMount () {
    super.componentDidMount()
    this.leafletElement.getLayers().forEach((l) => l.on('mousedown', this.props.onMousedown))
  }

  componentWillUnmount () {
    super.componentWillUnmount()
    this.leafletElement.getLayers().forEach((l) => l.off('mousedown', this.props.onMousedown))
  }
}

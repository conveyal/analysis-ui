import RLGeoJSON from 'react-leaflet/lib/GeoJSON'

export default class GeoJSON extends RLGeoJSON {
  componentWillReceiveProps (prevProps) {
    if (prevProps.data !== this.props.data) {
      this.leafletElement.clearLayers()
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.data !== this.props.data) {
      this.leafletElement.addData(this.props.data)
    }
  }
}

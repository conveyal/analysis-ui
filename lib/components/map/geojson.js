import {GeoJson as RLGeoJson} from 'react-leaflet'

export default class GeoJson extends RLGeoJson {
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

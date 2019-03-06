import {GeoJSON as RLGeoJSON} from 'react-leaflet'

export default class GeoJSON extends RLGeoJSON {
  componentDidUpdate (prevProps) {
    if (prevProps.data !== this.props.data) {
      this.leafletElement.clearLayer()
      this.leafletElement.addData(this.props.data)
    }
  }
}

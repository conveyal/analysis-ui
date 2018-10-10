// @flow
import {Marker} from 'react-leaflet'

export default class OpenMarker extends Marker {
  componentDidMount () {
    super.componentDidMount()
    this.leafletElement.openPopup()
  }
}

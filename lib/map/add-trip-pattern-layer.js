/** the layer for an add trip pattern modification, pass in an already-constructed leaflet-transit-editor instance */

import { Path } from 'react-leaflet'
import { PropTypes } from 'react'

export default class AddTripPatternLayer extends Path {
  static propTypes = {
    leafletTransitEditor: PropTypes.object.isRequired
  }

  componentWillMount () {
    super.componentWillMount()
    this.leafletElement = this.props.leafletTransitEditor
  }
}

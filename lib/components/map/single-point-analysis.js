import omit from 'lodash.omit'
import React, {Component, PropTypes} from 'react'
import {Marker} from 'react-leaflet'

const OMIT_MODIFICATION_FIELDS = ['expanded', 'dwell', 'feed', 'id', 'name', 'scenario', 'segments', 'showOnMap', 'speed', 'trips', 'variants']

export default class SinglePointAnalysis extends Component {
  static propTypes = {
    bundleId: PropTypes.string.isRequired,
    fetchIsochrone: PropTypes.func.isRequired,
    initialLatLng: PropTypes.object.isRequired,
    modifications: PropTypes.array.isRequired,
    remove: PropTypes.func.isRequired,
    scenarioId: PropTypes.string.isRequired
  }

  state = {
    latlng: this.props.initialLatLng
  }

  componentDidMount () {
    this._fetchIsochrone(this.state.latlng)
  }

  render () {
    const {latlng} = this.state
    return (
      <g>
        <Marker
          draggable
          onDblclick={this._handleDblclick}
          onDragend={this._handleDragend}
          position={latlng}
          />
      </g>
    )
  }

  _fetchIsochrone = (latlng) => {
    const {bundleId, fetchIsochrone, modifications, scenarioId} = this.props
    fetchIsochrone({
      bundleId,
      latlng,
      modifications: modifications.map((modification) => omit(modification, OMIT_MODIFICATION_FIELDS)),
      scenarioId
    })
  }

  _handleDragend = (e) => {
    const latlng = e.target._latlng
    this.setState({latlng})
    this._fetchIsochrone(latlng)
  }

  _handleDblclick = (e) => {
    this.props.remove()
  }
}

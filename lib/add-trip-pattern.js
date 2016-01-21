/** display an add trip pattern modification */

import React, { Component, PropTypes } from 'react'
import uuid from 'uuid'
import linestring from 'turf-linestring'

import DrawNewLine from './draw-new-line'

export default class AddTripPattern extends Component {
  static propTypes = {
    modification: PropTypes.object.isRequired,
    replaceModification: PropTypes.func.isRequired,
    addLayer: PropTypes.func.isRequired,
    removeLayer: PropTypes.func.isRequired,
    addControl: PropTypes.func.isRequired,
    removeControl: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props)
    this.onNameChange = this.onNameChange.bind(this)
    this.onSelect = this.onSelect.bind(this)
  }

  onNameChange(e) {
    this.props.replaceModification(Object.assign({}, this.props.modification, { name: e.target.value }))
  }

  onSelect (e) {
    if (e.target.checked) this.editOnMap()
    else this.stopEditing()
  }

  /** edit this modification on the map */
  editOnMap () {
    if (this.props.modification.geometry && this.props.modification.geometry.coordinates) {
      // TODO edit existing geometry
    }

    this.control = new DrawNewLine(layer => {
      let geom = linestring(layer.getLatLngs().map(latLng => [latLng.lng, latLng.lat]))
      this.props.replaceModification(Object.assign({}, this.props.modification, { geometry: geom }))

      // call this after updating props, we need to have access to the new geometry below
      this.stopEditing()
    })

    this.props.addControl(this.props.modification.id, this.control)
  }

  stopEditing () {
    this.props.removeControl(this.props.modification.id)
    this.control = null
    this.showOnMap()
  }

  /** show this modification on the map */
  showOnMap () {
    // create the layer on the map
    if (this.props.modification.geometry != null) {
      this.layer = L.geoJson({
        type: 'FeatureGroup',
        features: [ this.props.modification.geometry ]
      }, {
        style: {
          color: '#777',
          weight: 3
        }
      })
      this.props.addLayer(this.props.modification.id, this.layer)
    }
  }

  render () {
    return (
      <li>
        <input type='radio' name='add-trip-pattern' value={this.props.modification.id} onChange={this.onSelect} />
        <input type='text' placeholder='name' value={this.props.modification.name} onChange={this.onNameChange} />
      </li>
      )
  }

  componentDidMount () {
    this.showOnMap()
  }

  componentWillUnmount () {
    // clean up after ourselves
    if (this.layer) this.props.removeLayer(this.modification.id)
    if (this.control) this.props.removeControl(this.modification.id)
  }
}

/** Create a new, blank add trip pattern modification */
export function create() {
  return {
    name: '',
    type: 'add-trip-pattern',
    id: uuid.v4() // random uuid
  }
}
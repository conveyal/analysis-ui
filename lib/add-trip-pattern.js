/** display an add trip pattern modification */

import React, { Component, PropTypes } from 'react'
import uuid from 'uuid'
import linestring from 'turf-linestring'

import DrawNewLine from './draw-new-line'
import EditLine from './edit-line'

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
    this.editOnMap = this.editOnMap.bind(this)
    this.setHeadway = this.setHeadway.bind(this)
  }

  onNameChange(e) {
    this.props.replaceModification(Object.assign({}, this.props.modification, { name: e.target.value }))
  }

  /** set a particular day of the week as having or not having service */
  setDay (day, value) {
    let modification = Object.assign({}, this.props.modification)
    modification.timetables = [...modification.timetables]
    modification.timetables[0] = Object.assign({}, modification.timetables[0])
    modification.timetables[0].days = [...modification.timetables[0].days]
    modification.timetables[0].days[day] = value
    this.props.replaceModification(modification)
  }

  /** set the headway of the modification */
  setHeadway (e) {
    let modification = Object.assign({}, this.props.modification)
    modification.timetables = [...modification.timetables]
    modification.timetables[0] = Object.assign({}, modification.timetables[0])
    modification.timetables[0].headwaySecs = Number(e.target.value) * 60
    this.props.replaceModification(modification)
  }

  /** edit this modification on the map */
  editOnMap () {
    this.props.removeLayer(this.props.modification.id)

    if (this.props.modification.geometry) {
      // edit existing geometry
      this.control = new EditLine(this.props.modification.geometry, layer => {
        let geom = linestring(layer.getLatLngs().map(latLng => [latLng.lng, latLng.lat]))
        this.props.replaceModification(Object.assign({}, this.props.modification, { geometry: geom }))

        // call this after updating props, we need to have access to the new geometry below
        this.stopEditing()
      })
    } else {
      // create new geometry
      this.control = new DrawNewLine(layer => {
        let geom = linestring(layer.getLatLngs().map(latLng => [latLng.lng, latLng.lat]))
        this.props.replaceModification(Object.assign({}, this.props.modification, { geometry: geom }))

        // call this after updating props, we need to have access to the new geometry below
        this.stopEditing()
      })
    }

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
        <div>
          <input type='text' placeholder='name' value={this.props.modification.name} onChange={this.onNameChange} /><a  href='#' onClick={this.editOnMap}>edit route geometry</a>
        </div>
        <div>
          {/* TODO multiple timetables */}
          <input type='checkbox' checked={this.props.modification.timetables[0].days[0]} onChange={e => this.setDay(0, e.target.checked)} />Monday<br/>
          <input type='checkbox' checked={this.props.modification.timetables[0].days[1]} onChange={e => this.setDay(1, e.target.checked)} />Tuesday<br/>
          <input type='checkbox' checked={this.props.modification.timetables[0].days[2]} onChange={e => this.setDay(2, e.target.checked)} />Wednesday<br/>
          <input type='checkbox' checked={this.props.modification.timetables[0].days[3]} onChange={e => this.setDay(3, e.target.checked)} />Thursday<br/>
          <input type='checkbox' checked={this.props.modification.timetables[0].days[4]} onChange={e => this.setDay(4, e.target.checked)} />Friday<br/>
          <input type='checkbox' checked={this.props.modification.timetables[0].days[5]} onChange={e => this.setDay(5, e.target.checked)} />Saturday<br/>
          <input type='checkbox' checked={this.props.modification.timetables[0].days[6]} onChange={e => this.setDay(6, e.target.checked)} />Sunday<br/>

          Frequency: <input type='text' value={this.props.modification.timetables[0].headwaySecs / 60} onChange={this.setHeadway} />
        </div>
      </li>
      )
  }

  componentDidMount () {
    this.showOnMap()
  }

  componentWillUnmount () {
    // clean up after ourselves
    if (this.layer) this.props.removeLayer(this.props.modification.id)
    if (this.control) this.props.removeControl(this.props.modification.id)
  }
}

/** Create a new, blank add trip pattern modification */
export function create() {
  return {
    name: '',
    type: 'add-trip-pattern',
    id: uuid.v4(), // random uuid
    timetables: [{
      days: [true, true, true, true, true, true, true], // active every day
      frequency: true, // frequency based
      startTime: 3 * 3600, // run all day
      endTime: 22 * 3600,
      headwaySecs: 600 // ten minutes
    }]
  }
}
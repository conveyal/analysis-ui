/** display an add trip pattern modification */

import React, { Component, PropTypes } from 'react'
import uuid from 'uuid'

import LeafletTransitEditor from 'leaflet-transit-editor'

import Timetable, { create as createTimetable, updateTimes } from './timetable'

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
    this.stopEditing = this.stopEditing.bind(this)
    this.newTimetable = this.newTimetable.bind(this)
    this.onTimetableChange = this.onTimetableChange.bind(this)
    this.onBidirectionalChange = this.onBidirectionalChange.bind(this)
    this.state = { editing: false }
  } 

  onNameChange(e) {
    this.props.replaceModification(Object.assign({}, this.props.modification, { name: e.target.value }))
  }

  /** edit this modification on the map */
  editOnMap () {
    this.props.removeLayer(this.props.modification.id)

    this.layer = new LeafletTransitEditor(this.props.modification)
    this.props.addLayer(this.props.modification.id, this.layer)
    //this.props.addControl(this.props.modification.id, this.layer.getControl())

    this.setState(Object.assign({}, this.state, { editing: true }))
  }

  /** add a timetable */
  newTimetable () {
    let tt = createTimetable(this.props.modification)
    let mod = Object.assign({}, this.props.modification)
    mod.timetables = [...mod.timetables]
    mod.timetables.push(tt)
    this.props.replaceModification(mod)
  }

  /** update a timetable */
  onTimetableChange (index, newTimetable) {
    let mod = Object.assign({}, this.props.modification)
    mod.timetables = [...mod.timetables]
    mod.timetables[index] = newTimetable
    this.props.replaceModification(mod)
  }

  /** toggle whether a pattern is bidirectional */
  onBidirectionalChange (e) {
    this.props.replaceModification(Object.assign({}, this.props.modification, { bidirectional: e.target.checked }))
  }

  stopEditing () {
    this.props.removeLayer(this.props.modification.id)
    this.props.removeControl(this.props.modification.id)

    let modification = Object.assign({}, this.props.modification, this.layer.getModification())
    modification.timetables = modification.timetables.map(t => Object.assign({}, t))
    modification.timetables.forEach(tt => updateTimes(tt, modification))
    this.props.replaceModification(modification)
    this.setState(Object.assign({}, this.state, { editing: false }))

    // do this last so we don't overwrite the layer
    //this.showOnMap()
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.modification.geometry !== this.props.modification.geometry)
      this.showOnMap()
  }

  /** show this modification on the map */
  showOnMap () {
    console.log(`display trip pattern ${this.props.modification.id} on map`)
    // create the layer on the map
    this.layer = L.geoJson({
      type: 'Feature',
      geometry: this.props.modification.geometry
    },
    {
      style: {
        // blue for routes being added (not green, red/green color blindness is very common)
        color: '#55b',
        weight: 3
      }
    })
    this.props.addLayer(this.props.modification.id, this.layer)
  }

  render () {
    return (
      <li>
        <div>
          <input type='text' placeholder='name' value={this.props.modification.name} onChange={this.onNameChange} />
          { this.state.editing ? 
            <a href='#' onClick={this.stopEditing}>stop editing</a> :
            <a  href='#' onClick={this.editOnMap}>edit route geometry</a> }<br/>
          <label>bidirectional <input type='checkbox' checked={this.props.modification.bidirectional} onChange={this.onBidirectionalChange} /></label>
        </div>
        <div>
          { this.props.modification.timetables.map((tt, i) => <Timetable timetable={tt} key={i} modification={this.props.modification} onChange={this.onTimetableChange.bind(this, i)} />) }
          <button onClick={this.newTimetable}>Add timetable</button>
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
    //if (this.control) this.props.removeControl(this.props.modification.id)
  }
}

/** Create a new, blank add trip pattern modification */
export function create() {
  return {
    name: '',
    type: 'add-trip-pattern',
    id: uuid.v4(), // random uuid
    geometry: { type: 'LineString', coordinates: [] },
    controlPoints: [],
    stops: [],
    timetables: []
  }
}
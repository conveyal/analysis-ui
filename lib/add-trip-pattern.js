/** display an add trip pattern modification */

import React, { Component, PropTypes } from 'react'
import uuid from 'uuid'
import linestring from 'turf-linestring'

import DrawNewLine from './draw-new-line'
import EditLine from './edit-line'

import { snapStops, coordDistancesForGeometry } from './snap-stops'

import LeafletTransitEditor from 'leaflet-transit-editor'

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
    this.stopEditing = this.stopEditing.bind(this)
    this.state = { editing: false }
  } 

  onNameChange(e) {
    this.props.replaceModification(Object.assign({}, this.props.modification, { name: e.target.value }))
  }

  /** set a particular day of the week as having or not having service */
  setDay (day, value) {
    let modification = Object.assign({}, this.props.modification)
    modification.timetables = modification.timetables.map(t => Object.assign({}, t))
    modification.timetables[0].days = [...modification.timetables[0].days]
    modification.timetables[0].days[day] = value
    this.props.replaceModification(modification)
  }

  /** set the headway of the modification */
  setHeadway (e) {
    let modification = Object.assign({}, this.props.modification)
    modification.timetables = modification.timetables.map(t => Object.assign({}, t))
    modification.timetables[0].headwaySecs = Number(e.target.value) * 60
    this.props.replaceModification(modification)
  }

  /** set the speed of the modification (km/h) */
  setSpeed (e) {
    let modification = Object.assign({}, this.props.modification)
    modification.timetables = modification.timetables.map(t => Object.assign({}, t))
    modification.timetables[0].speed = Number(e.target.value)
    this.updateHopTimes(modification)
    this.props.replaceModification(modification)
  }

  /** update hop times based on changed speed and/or stop alignments. expects a modification with timetables that have already been cloned. */
  updateHopTimes (modification) {
    // snap all the stops to the geometry, getting the distances along the geometry between each
    // map them to distances traveled
    let snapped = snapStops(modification.geometry, modification.stops)

    let coordDistancesTraveled = coordDistancesForGeometry(modification.geometry)
    let distances = snapped.map(s => coordDistancesTraveled[s[0]] + (coordDistancesTraveled[s[0] + 1] - coordDistancesTraveled[s[0]]) * s[1])

    // convert to deltas from previous stop
    for (let i = 1; i < distances.length; i++) distances[i] -= distances[i - 1]

    modification.timetables.forEach(tt => {
      // slice(1) to convert to hops
      tt.hopTimes = distances.slice(1).map(d => Math.round(d / tt.speed * 3600))
    })
  }

  /** edit this modification on the map */
  editOnMap () {
    this.props.removeLayer(this.props.modification.id)

    this.layer = new LeafletTransitEditor(this.props.modification)
    this.props.addLayer(this.props.modification.id, this.layer)

    this.setState(Object.assign({}, this.state, { editing: true }))
  }

  stopEditing () {
    this.props.removeLayer(this.props.modification.id)

    let modification = Object.assign({}, this.props.modification, this.layer.getModification())
    modification.timetables = modification.timetables.map(t => Object.assign({}, t))
    this.updateHopTimes(modification)
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
          <input type='text' placeholder='name' value={this.props.modification.name} onChange={this.onNameChange} />
          { this.state.editing ? 
            <a href='#' onClick={this.stopEditing}>stop editing</a> :
            <a  href='#' onClick={this.editOnMap}>edit route geometry</a> }
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
          Speed: <input type='text' value={this.props.modification.timetables[0].speed} onChange={this.setSpeed} />
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
    geometry: {
      type: 'LineString',
      coordinates: []
    },
    stops: [],
    controlPoints: [],
    timetables: [{
      days: [true, true, true, true, true, true, true], // active every day
      frequency: true, // frequency based
      startTime: 3 * 3600, // run all day
      endTime: 22 * 3600,
      headwaySecs: 600, // ten minutes
      speed: 25 // kilometers per hour
    }]
  }
}
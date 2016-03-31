/** the layer for an add trip pattern modification, pass in an already-constructed leaflet-transit-editor instance */

import { MapControl } from 'react-leaflet'
import { PropTypes } from 'react'
import { updateTimes as updateTimetable } from '../timetable'
import dbg from 'debug'

const debug = dbg('scenario-editor:add-trip-pattern-control')

export default class AddTripPatternControl extends MapControl {
  static propTypes = {
    leafletTransitEditor: PropTypes.object.isRequired,
    setMapState: PropTypes.func.isRequired,
    replaceModification: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.close = this.close.bind(this)
    this.saveEdits = this.saveEdits.bind(this)
  }

  componentWillMount () {
    this.leafletElement = this.props.leafletTransitEditor.getControl({ save: this.saveEdits, close: this.close })
  }

  saveEdits (atp) {
    let modification = Object.assign({}, this.props.modification, this.props.leafletTransitEditor.getModification())

    let len = modification.stops.length

    if (modification.stopIds.length !== len || modification.controlPoints.length !== len || modification.geometry.coordinates.length !== len) {
      throw new Error('Invalid add trip pattern modification')
    }

    if (modification.type === 'add-trip-pattern') {
      modification.timetables = modification.timetables.map((t) => Object.assign({}, t))
      modification.timetables.forEach((tt) => updateTimetable(tt, modification))
    }

    this.props.replaceModification(modification)
  }

  close () {
    this.props.setMapState({})
  }
}

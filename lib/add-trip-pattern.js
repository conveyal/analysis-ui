/** display an add trip pattern modification */

import React, { Component, PropTypes } from 'react'
import uuid from 'uuid'

import {Button} from './components/buttons'
import Icon from './components/icon'
import {Checkbox, Text, Number} from './components/input'
import Timetable, { create as createTimetable } from './timetable'
import messages from './messages'

export default class AddTripPattern extends Component {
  static propTypes = {
    modification: PropTypes.object.isRequired,
    replaceModification: PropTypes.func.isRequired,
    setMapState: PropTypes.func,
    mapState: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props)
    this.state = this.getStateFromProps(props)
  }

  /** extract current stop spacing from a modification */
  getStateFromProps (props) {
    let { modification, mapState } = props
    return {
      followRoad: mapState.followRoad,
      spacing: modification.segments.length > 0 ? modification.segments[0].spacing : 400,
      extendFromEnd: mapState && mapState.modificationId === modification.id ? mapState.extendFromEnd : true
    }
  }

  componentWillReceiveProps (newProps) {
    this.setState(Object.assign({}, this.state, this.getStateFromProps(newProps)))
  }

  onNameChange = (e) => {
    this.props.replaceModification(Object.assign({}, this.props.modification, { name: e.target.value }))
  }

  /** edit this modification on the map */
  editOnMap = () => {
    this.props.setMapState({
      followRoad: this.state.followRoad,
      state: 'add-trip-pattern',
      extendFromEnd: this.state.extendFromEnd,
      allowExtend: true,
      modificationId: this.props.modification.id
    })
  }

  stopEditingOnMap = () => {
    this.props.setMapState({})
  }

  onExtendFromEndChange = (e) => {
    this.props.setMapState({
      followRoad: this.state.followRoad,
      state: 'add-trip-pattern',
      extendFromEnd: e.target.checked,
      allowExtend: true,
      modificationId: this.props.modification.id
    })
  }

  onFollowRoadChange = (e) => {
    this.props.setMapState({
      allowExtend: true,
      extendFromEnd: this.state.extendFromEnd,
      followRoad: e.target.checked,
      modificationId: this.props.modification.id,
      state: 'add-trip-pattern'
    })
  }

  /** add a timetable */
  newTimetable = () => {
    let tt = createTimetable(this.props.modification)
    let mod = Object.assign({}, this.props.modification)
    mod.timetables = [...mod.timetables]
    mod.timetables.push(tt)
    this.props.replaceModification(mod)
  }

  /** update a timetable */
  onTimetableChange = (index, newTimetable) => {
    let mod = Object.assign({}, this.props.modification)
    mod.timetables = [...mod.timetables]
    mod.timetables[index] = newTimetable
    this.props.replaceModification(mod)
  }

  removeTimetable = (index) => {
    let timetables = [...this.props.modification.timetables]
    timetables.splice(index, 1)
    this.props.replaceModification(Object.assign({}, this.props.modification, { timetables }))
  }

  /** toggle whether a pattern is bidirectional */
  onBidirectionalChange = (e) => {
    this.props.replaceModification(Object.assign({}, this.props.modification, { bidirectional: e.target.checked }))
  }

  /** toggle whether stops should be created automatically */
  onAutoCreateStopsChange = (e) => {
    let spacing = e.target.checked ? 400 : 0
    this.setState(Object.assign({}, this.state, { spacing }))

    let segments = this.props.modification.segments
      // TODO store spacing in modification separately from per-segment spacing?
      .map((s) => Object.assign({}, s, { spacing }))

    this.props.replaceModification(Object.assign({}, this.props.modification, { segments }))
  }

  /** set stop spacing */
  onStopSpacingChange = (e) => {
    let segments = this.props.modification.segments

    let spacing = parseInt(e.target.value, 10)

    this.setState(Object.assign({}, this.state, { spacing }))

    if (spacing == null || isNaN(spacing) || spacing < 50) return // user likely still typing

    // only set stop spacing if current spacing is not zero
    if (segments.length > 0 && segments[0].spacing > 0) {
      segments = segments.map((s) => Object.assign({}, s, { spacing }))
      this.props.replaceModification(Object.assign({}, this.props.modification, { segments }))
    }
  }

  render () {
    const {modification, mapState} = this.props
    // not using state here as otherwise checkbox would toggle on and off as you're editing the stop spacing
    let autoCreateStops = modification.segments.length > 0 ? modification.segments[0].spacing > 0 : true
    return (
      <div>
        <Text
          name='Name'
          onChange={this.onNameChange}
          value={modification.name}
          />
        {mapState.modificationId !== modification.id
          ? <Button
            block
            onClick={this.editOnMap}
            style='warning'
            ><Icon type='pencil' /> Edit route geometry
          </Button>
          : <Button
            block
            onClick={this.stopEditingOnMap}
            style='warning'
            ><Icon type='times-circle' /> Stop editing
          </Button>}

        {mapState.modificationId === modification.id
          ? <Checkbox
            checked={this.state.extendFromEnd}
            label={messages.transitEditor.extendFromEnd}
            onChange={this.onExtendFromEndChange}
            />
          : []}

        {mapState.modificationId === modification.id
          ? <Checkbox
            checked={this.state.followRoad}
            label={messages.transitEditor.followRoad}
            onChange={this.onFollowRoadChange}
            />
          : []}

        <Checkbox
          checked={autoCreateStops}
          label={messages.transitEditor.autoCreateStops}
          onChange={this.onAutoCreateStopsChange}
          />

        {autoCreateStops
          ? <Number
            value={this.state.spacing}
            label={messages.transitEditor.stopSpacingMeters}
            onChange={this.onStopSpacingChange}
            />
          : []}

        <Checkbox
          checked={modification.bidirectional}
          label='Bidirectional'
          onChange={this.onBidirectionalChange}
          />

        {modification.timetables.map((tt, i) => {
          return <Timetable
            index={i + 1}
            key={i}
            modification={modification}
            replaceTimetable={this.onTimetableChange.bind(this, i)}
            removeTimetable={this.removeTimetable.bind(this, i)}
            timetable={tt}
            />
        })}
        <Button
          block
          onClick={this.newTimetable}
          style='success'
          ><Icon type='plus' /> Add timetable
        </Button>
      </div>
    )
  }
}

/** Create a new, blank add trip pattern modification */
export function create () {
  return {
    name: '',
    type: 'add-trip-pattern',
    id: uuid.v4(), // random uuid
    segments: [],
    timetables: [],
    expanded: true,
    showOnMap: true
  }
}

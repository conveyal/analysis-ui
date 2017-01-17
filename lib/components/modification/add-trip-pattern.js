/** display an add trip pattern modification */

import React, {PropTypes} from 'react'

import {DEFAULT_STOP_SPACING_METERS} from '../../constants'
import {Button} from '../buttons'
import DeepEqual from '../deep-equal'
import Icon from '../icon'
import {Checkbox, Number} from '../input'
import Timetables from './timetables'
import {ADD_TRIP_PATTERN} from '../../utils/modification-types'
import messages from '../../utils/messages'

export default class AddTripPattern extends DeepEqual {
  static propTypes = {
    mapState: PropTypes.object.isRequired,
    modification: PropTypes.object.isRequired,
    numberOfStops: PropTypes.number.isRequired,
    segmentDistances: PropTypes.array.isRequired,

    // actions
    setMapState: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired
  }

  state = getStateFromProps(this.props)

  componentWillReceiveProps (newProps) {
    this.setState({
      ...this.state,
      ...getStateFromProps(newProps)
    })
  }

  /** edit this modification on the map */
  editOnMap = () => {
    const {modification, setMapState} = this.props
    const {extendFromEnd, followRoad, spacing} = this.state
    setMapState({
      allowExtend: true,
      extendFromEnd,
      followRoad,
      modificationId: modification.id,
      spacing,
      state: ADD_TRIP_PATTERN
    })
  }

  stopEditingOnMap = () => {
    this.props.setMapState({
      modificationId: null,
      state: null
    })
  }

  _updateMapState (props) {
    const {mapState, setMapState} = this.props
    if (mapState.state === ADD_TRIP_PATTERN) {
      setMapState({
        ...mapState,
        ...props
      })
    }
  }

  onExtendFromEndChange = (e) => {
    this._updateMapState({extendFromEnd: e.target.checked})
  }

  onFollowRoadChange = (e) => {
    this._updateMapState({followRoad: e.target.checked})
  }

  /** toggle whether a pattern is bidirectional */
  onBidirectionalChange = (e) => {
    this.props.update({bidirectional: e.target.checked})
  }

  /** toggle whether stops should be created automatically */
  onAutoCreateStopsChange = (e) => {
    const {modification, update} = this.props
    const spacing = e.target.checked ? DEFAULT_STOP_SPACING_METERS : 0

    this._updateMapState({spacing})
    this.setState({...this.state, spacing})

    update({
      segments: modification.segments.map((segment) => ({...segment, spacing}))
    })
  }

  /** set stop spacing */
  onStopSpacingChange = (e) => {
    const {modification, update} = this.props
    const {segments} = modification
    const spacing = parseInt(e.target.value, 10)

    this._updateMapState({spacing})
    this.setState({...this.state, spacing})

    if (spacing !== null && !isNaN(spacing) && spacing >= 50) {
      // only set stop spacing if current spacing is not zero
      if (segments.length > 0 && segments[0].spacing > 0) {
        update({segments: segments.map((segment) => ({...segment, spacing}))})
      }
    }
  }

  render () {
    const {modification, mapState, numberOfStops, segmentDistances, update} = this.props
    const {createStopsAutomatically, extendFromEnd, followRoad, spacing} = this.state
    // not using state here as otherwise checkbox would toggle on and off as you're editing the stop spacing
    // const autoCreateStops = modification.segments.length > 0 ? modification.segments[0].spacing > 0 : true
    const isEditing = mapState.modificationId === modification.id
    return (
      <div>
        {!isEditing
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

        {isEditing &&
          <Checkbox
            defaultChecked={extendFromEnd}
            label={messages.transitEditor.extendFromEnd}
            onChange={this.onExtendFromEndChange}
            />}

        {isEditing &&
          <Checkbox
            defaultChecked={followRoad}
            label={messages.transitEditor.followRoad}
            onChange={this.onFollowRoadChange}
            />}

        <Checkbox
          defaultChecked={createStopsAutomatically}
          label={messages.transitEditor.autoCreateStops}
          onChange={this.onAutoCreateStopsChange}
          />

        {createStopsAutomatically &&
          <Number
            value={spacing}
            label={messages.transitEditor.stopSpacingMeters}
            onChange={this.onStopSpacingChange}
            units='meters'
            />}

        <Checkbox
          checked={modification.bidirectional}
          label='Bidirectional'
          onChange={this.onBidirectionalChange}
          />

        <Timetables
          numberOfStops={numberOfStops}
          segmentDistances={segmentDistances}
          timetables={modification.timetables}
          update={update}
          />
      </div>
    )
  }
}

function getStateFromProps ({
  mapState,
  modification
}) {
  return {
    extendFromEnd: mapState && mapState.modificationId === modification.id ? mapState.extendFromEnd : true,
    followRoad: mapState.followRoad,
    spacing: modification.segments.length > 0 ? modification.segments[0].spacing : DEFAULT_STOP_SPACING_METERS
  }
}

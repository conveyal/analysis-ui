import React, {PropTypes} from 'react'

import {
  DEFAULT_STOP_SPACING_METERS,
  MAP_STATE_TRANSIT_EDITOR,
  REROUTE
} from '../../constants'
import messages from '../../utils/messages'

import {Button} from '../buttons'
import DeepEqual from '../deep-equal'
import Icon from '../icon'
import {Checkbox, Number} from '../input'

export default class EditAlignment extends DeepEqual {
  static propTypes = {
    extendFromEnd: PropTypes.bool.isRequired,
    mapState: PropTypes.object.isRequired,
    modification: PropTypes.object.isRequired,

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

  /**
   * Edit this modification on the map
   */
  _editOnMap = () => {
    const {extendFromEnd, modification, setMapState} = this.props
    const {allowExtend, followRoad, spacing} = this.state
    setMapState({
      allowExtend,
      extendFromEnd,
      followRoad,
      modificationId: modification.id,
      spacing,
      state: MAP_STATE_TRANSIT_EDITOR
    })
  }

  _stopEditingOnMap = () => {
    this.props.setMapState({
      modificationId: null,
      state: null
    })
  }

  _updateMapState (props) {
    const {mapState, setMapState} = this.props
    if (mapState.state === MAP_STATE_TRANSIT_EDITOR) {
      setMapState({
        ...mapState,
        ...props
      })
    }
  }

  _onExtendFromEndChange = (e) => {
    this._updateMapState({extendFromEnd: e.target.checked})
  }

  _onFollowRoadChange = (e) => {
    this._updateMapState({followRoad: e.target.checked})
  }

  /**
   * Toggle whether a pattern is bidirectional.
   */
  _onBidirectionalChange = (e) => {
    this.props.update({bidirectional: e.target.checked})
  }

  /**
   * Toggle whether stops should be created automatically.
   */
  _onAutoCreateStopsChange = (e) => {
    const {mapState, modification, update} = this.props
    const spacing = e.target.checked ? DEFAULT_STOP_SPACING_METERS : 0

    if (mapState.state === MAP_STATE_TRANSIT_EDITOR) {
      this._updateMapState({spacing})
    } else {
      this.setState({
        ...this.state,
        createStopsAutomatically: spacing > 0,
        spacing
      })
    }

    if (modification.segments.length > 0) {
      update({
        segments: modification.segments.map((segment) => ({...segment, spacing}))
      })
    }
  }

  /**
   * Set stop spacing
   */
  _onStopSpacingChange = (e) => {
    const {modification, update} = this.props
    const {segments} = modification
    const spacing = parseInt(e.target.value, 10)

    this._updateMapState({spacing})

    if (spacing !== null && !isNaN(spacing) && spacing >= 50) {
      // only set stop spacing if current spacing is not zero
      if (segments.length > 0 && segments[0].spacing > 0) {
        update({segments: segments.map((segment) => ({...segment, spacing}))})
      }
    }
  }

  render () {
    const {extendFromEnd, modification} = this.props
    const {createStopsAutomatically, followRoad, isEditing, spacing} = this.state

    const hasAnyPhasing = modification.timetables.findIndex(t => t.phaseAtStop != null) != -1

    return (
      <div>
        {!isEditing
          ? <Button
            block
            onClick={this._editOnMap}
            style='warning'
            ><Icon type='pencil' /> {messages.transitEditor.startEdit}
          </Button>
          : <Button
            block
            onClick={this._stopEditingOnMap}
            style='warning'
            ><Icon type='stop-circle' /> {messages.transitEditor.stopEdit}
          </Button>}

        <Checkbox
          defaultChecked={createStopsAutomatically}
          label={messages.transitEditor.autoCreateStops}
          onChange={this._onAutoCreateStopsChange}
          />

        {createStopsAutomatically &&
          <Number
            value={spacing}
            label={messages.transitEditor.stopSpacingMeters}
            onChange={this._onStopSpacingChange}
            units='meters'
            />}

        {modification.type !== REROUTE &&
          <Checkbox
            checked={modification.bidirectional}
            label={messages.transitEditor.bidirectional}
            onChange={this._onBidirectionalChange}
            disabled={hasAnyPhasing}
            />}

        {hasAnyPhasing &&
          <div className='alert alert-info' role='alert'>{messages.transitEditor.bidirectionalWarning}</div>}

        {modification.type !== REROUTE && isEditing &&
          <Checkbox
            defaultChecked={extendFromEnd}
            label={messages.transitEditor.extendFromEnd}
            onChange={this._onExtendFromEndChange}
            />}

        {isEditing &&
          <Checkbox
            defaultChecked={followRoad}
            label={messages.transitEditor.followRoad}
            onChange={this._onFollowRoadChange}
            />}
      </div>
    )
  }
}

/**
  * Extract current stop spacing from a modification
  */
function getStateFromProps ({
  mapState,
  modification
}) {
  const isEditingAlignment = mapState && mapState.modificationId === modification.id && mapState.state === MAP_STATE_TRANSIT_EDITOR
  const spacing = modification.segments.length > 0 ? modification.segments[0].spacing : DEFAULT_STOP_SPACING_METERS

  return {
    allowExtend: modification.toStop == null || modification.fromStop == null,
    createStopsAutomatically: spacing > 0,
    followRoad: mapState.followRoad,
    isEditing: mapState.modificationId === modification.id,
    isEditingAlignment,
    spacing
  }
}

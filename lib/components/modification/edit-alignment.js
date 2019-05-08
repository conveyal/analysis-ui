import {
  faCircle,
  faExclamationCircle,
  faPencilAlt,
  faStopCircle
} from '@fortawesome/free-solid-svg-icons'
import {faCircle as faCircleO} from '@fortawesome/free-regular-svg-icons'
import React, {PureComponent} from 'react'

import message from 'lib/message'

import {
  ADD_TRIP_PATTERN,
  DEFAULT_STOP_SPACING_METERS,
  MINIMUM_STOP_SPACING,
  MAP_STATE_TRANSIT_EDITOR,
  REROUTE
} from 'lib/constants'
import colors from 'lib/constants/colors'
import {Button} from '../buttons'
import Icon from '../icon'
import {Checkbox, Number} from '../input'
import * as Panel from '../panel'
import getExistingStopsAlongPattern from 'lib/utils/get-existing-stops-along-pattern'

export default class EditAlignment extends PureComponent {
  state = {}

  componentWillUnmount() {
    this._stopEditingOnMap()
  }

  /**
   * Edit this modification on the map
   */
  _editOnMap = () => {
    const {modification, extendFromEnd, setMapState} = this.props
    const {followRoad, spacing} = this.state
    const allowExtend =
      modification.type === REROUTE ? this.state.allowExtend : true
    setMapState({
      allowExtend,
      extendFromEnd,
      followRoad,
      spacing,
      state: MAP_STATE_TRANSIT_EDITOR
    })
  }

  _getSegments() {
    return [...(this.props.modification.segments || [])]
  }

  _autoGen = () => {
    const newSegments = getExistingStopsAlongPattern(
      this._getSegments(),
      this.props.allStops
    )
    this.props.update({segments: newSegments})
  }

  _stopEditingOnMap = () => {
    this.props.setMapState({
      state: null
    })
  }

  _updateMapState(props: any) {
    const {mapState, setMapState} = this.props
    if (mapState.state === MAP_STATE_TRANSIT_EDITOR) {
      setMapState({
        ...mapState,
        ...props
      })
    }
  }

  _onExtendFromEndChange = e => {
    this._updateMapState({extendFromEnd: e.target.checked})
  }

  _onAllowExtendChange = e => {
    this._updateMapState({allowExtend: e.target.checked})
  }

  _onFollowRoadChange = e => {
    this._updateMapState({followRoad: e.target.checked})
  }

  /**
   * Toggle whether a pattern is bidirectional.
   */
  _onBidirectionalChange = e => {
    this.props.update({bidirectional: e.target.checked})
  }

  /**
   * Toggle whether stops should be created automatically.
   */
  _onAutoCreateStopsChange = e => {
    const {mapState, modification, update} = this.props
    const spacing = e.target.checked ? DEFAULT_STOP_SPACING_METERS : 0

    if (mapState.state === MAP_STATE_TRANSIT_EDITOR) {
      this._updateMapState({spacing})
    } else {
      this.setState({
        createStopsAutomatically: spacing > 0,
        spacing
      })
    }

    if (modification.segments && modification.segments.length > 0) {
      update({
        segments: modification.segments.map(segment => ({...segment, spacing}))
      })
    }
  }

  /**
   * Set stop spacing
   */
  _onStopSpacingChange = e => {
    const {modification, update} = this.props
    const {segments} = modification
    const spacing = parseInt(e.target.value, 10)

    this._updateMapState({spacing})

    if (spacing !== null && !isNaN(spacing) && spacing >= 50) {
      // only set stop spacing if current spacing is not zero
      if (segments && segments.length > 0 && segments[0].spacing > 0) {
        update({segments: segments.map(segment => ({...segment, spacing}))})
      }
    }
  }

  render() {
    const {
      extendFromEnd,
      modification,
      numberOfStops,
      segmentDistances
    } = this.props
    const {
      allowExtend,
      createStopsAutomatically,
      followRoad,
      isEditing,
      spacing
    } = this.state
    const hasAnyPhasing =
      modification.timetables &&
      modification.timetables.findIndex(t => t.phaseAtStop != null) !== -1

    const distance = (segmentDistances || []).reduce(
      (accumulatedDistance, currentDistance) => {
        return accumulatedDistance + currentDistance
      },
      0
    )

    return (
      <>
        <h5>Route Geometry</h5>
        {distance > 0 &&
          modification.type === ADD_TRIP_PATTERN &&
          numberOfStops &&
          numberOfStops > 0 && (
            <p>{`${numberOfStops} stops over ${Math.round(distance * 100) /
              100} km`}</p>
          )}
        <p>
          {!isEditing ? (
            <Button
              block
              onClick={this._editOnMap}
              style='warning'
              disabled={this.props.disabled ? this.props.disabled : false}
            >
              <Icon icon={faPencilAlt} /> {message('transitEditor.startEdit')}
            </Button>
          ) : (
            <Button block onClick={this._stopEditingOnMap} style='warning'>
              <Icon icon={faStopCircle} /> {message('transitEditor.stopEdit')}
            </Button>
          )}
        </p>

        {distance === 0 && modification.type === ADD_TRIP_PATTERN && (
          <div className='alert alert-danger' role='alert'>
            <Icon icon={faExclamationCircle} /> A route geometry must have at
            least 2 stops
          </div>
        )}

        {isEditing && distance > 0 && (
          <Button block onClick={this._autoGen} style='warning'>
            <Icon icon={faCircle} /> {message('transitEditor.snap')}
          </Button>
        )}

        <Checkbox
          defaultChecked={createStopsAutomatically}
          label={message('transitEditor.autoCreateStops')}
          onChange={this._onAutoCreateStopsChange}
        />

        {createStopsAutomatically && (
          <Number
            value={spacing}
            label={`${message(
              'transitEditor.stopSpacingMeters'
            )} (minimum is ${MINIMUM_STOP_SPACING})`}
            onChange={this._onStopSpacingChange}
            units='meters'
          />
        )}
        {modification.type !== REROUTE && (
          <Checkbox
            checked={modification.bidirectional}
            label={message('transitEditor.bidirectional')}
            onChange={this._onBidirectionalChange}
            disabled={hasAnyPhasing}
          />
        )}

        {hasAnyPhasing && (
          <div className='alert alert-info' role='alert'>
            {message('transitEditor.bidirectionalWarning')}
          </div>
        )}

        {isEditing && (
          <Checkbox
            defaultChecked={followRoad}
            label={message('transitEditor.followRoad')}
            onChange={this._onFollowRoadChange}
          />
        )}

        {modification.type !== REROUTE && isEditing && (
          <Checkbox
            defaultChecked={allowExtend}
            label={message('transitEditor.extend')}
            onChange={this._onAllowExtendChange}
          />
        )}

        {modification.type !== REROUTE && isEditing && allowExtend && (
          <Checkbox
            defaultChecked={extendFromEnd}
            label={message('transitEditor.extendFromEnd')}
            onChange={this._onExtendFromEndChange}
          />
        )}

        {isEditing && (
          <Panel.Panel>
            <Panel.Heading>
              <strong>
                {message(
                  'transitEditor.instructionsTitle',
                  'Editing Instructions'
                )}
              </strong>
            </Panel.Heading>
            <Panel.Body>
              <p>{message('transitEditor.instructions')}</p>
              <p>
                <strong>Symbology</strong>
              </p>
              <p>
                <Icon
                  icon={faCircleO}
                  style={{color: colors.NEUTRAL, opacity: 0.5}}
                />{' '}
                {message('transitEditor.existingStops')}
              </p>
              <p>
                <Icon icon={faCircleO} style={{color: colors.ADDED}} />{' '}
                {message('transitEditor.newStopDescription')}
              </p>
              <p>
                <Icon
                  icon={faCircleO}
                  style={{color: colors.ADDED, opacity: 0.5}}
                />{' '}
                {message('transitEditor.autocreatedStopDescription')}
              </p>
              <p>
                <Icon icon={faCircleO} style={{color: colors.NEUTRAL}} />{' '}
                {message('transitEditor.snappedStopDescription')}
              </p>
              <span>
                <Icon icon={faCircle} style={{color: colors.ADDED}} />{' '}
                {message('transitEditor.controlPointDescription')}
              </span>
            </Panel.Body>
          </Panel.Panel>
        )}
      </>
    )
  }
}

/**
 * Extract current stop spacing from a modification
 */
EditAlignment.getDerivedStateFromProps = props => {
  const {mapState, modification} = props
  const spacing =
    modification.segments && modification.segments.length > 0
      ? modification.segments[0].spacing
      : 0

  return {
    allowExtend:
      modification.type === REROUTE
        ? modification.toStop == null || modification.fromStop == null
        : !!mapState.allowExtend,
    createStopsAutomatically: spacing > 0,
    followRoad: !!mapState.followRoad,
    isEditing: mapState.state === MAP_STATE_TRANSIT_EDITOR,
    spacing
  }
}

import {
  faCircle,
  faExclamationCircle,
  faPencilAlt,
  faStopCircle
} from '@fortawesome/free-solid-svg-icons'
import {faCircle as faCircleO} from '@fortawesome/free-regular-svg-icons'
import get from 'lodash/get'
import React from 'react'

import {
  ADD_TRIP_PATTERN,
  DEFAULT_STOP_SPACING_METERS,
  MINIMUM_STOP_SPACING,
  MAP_STATE_TRANSIT_EDITOR,
  REROUTE
} from 'lib/constants'
import colors from 'lib/constants/colors'
import message from 'lib/message'
import getExistingStopsAlongPattern from 'lib/utils/get-existing-stops-along-pattern'

import {Button} from '../buttons'
import Icon from '../icon'
import {Checkbox, NumberInput} from '../input'
import * as Panel from '../panel'

export default React.memo(function EditAlignment(p) {
  const {modification, mapState} = p

  const spacing = get(modification, 'segments[0].spacing', 0)
  const allowExtend =
    modification.type === REROUTE
      ? modification.toStop == null || modification.fromStop == null
      : !!get(mapState, 'allowExtend')
  const extendFromEnd = get(mapState, 'extendFromEnd', true)
  const createStopsAutomatically = spacing > 0
  const followRoad = !!get(mapState, 'followRoad')
  const isEditing = get(mapState, 'state') === MAP_STATE_TRANSIT_EDITOR

  /**
   * Edit this modification on the map
   */
  function editOnMap() {
    p.setMapState({
      allowExtend: modification.type === REROUTE ? allowExtend : true,
      extendFromEnd,
      followRoad,
      spacing,
      state: MAP_STATE_TRANSIT_EDITOR
    })
  }

  function getSegments() {
    return [...(modification.segments || [])]
  }

  // TODO move into an action
  function autoGen() {
    const newSegments = getExistingStopsAlongPattern(getSegments(), p.allStops)
    p.update({segments: newSegments})
  }

  function updateMapState(props) {
    p.setMapState({
      ...(mapState || {}),
      ...props
    })
  }

  const updateCheckboxFor = prop => e =>
    updateMapState({[`${prop}`]: e.target.checked})

  /**
   * Toggle whether a pattern is bidirectional.
   */
  function onBidirectionalChange(e) {
    p.update({bidirectional: e.target.checked})
  }

  /**
   * Toggle whether stops should be created automatically.
   */
  function onAutoCreateStopsChange(e) {
    const spacing = e.target.checked ? DEFAULT_STOP_SPACING_METERS : 0

    // Store in map state
    updateMapState({spacing})

    if (get(modification, 'segments.length') > 0) {
      p.update({
        segments: modification.segments.map(segment => ({...segment, spacing}))
      })
    }
  }

  /**
   * Set stop spacing
   */
  function onStopSpacingChange(e) {
    const {segments} = modification
    const spacing = parseInt(e.target.value, 10)

    updateMapState({spacing})

    // only set stop spacing if current spacing is not zero
    if (get(segments, '[0].spacing') > 0) {
      p.update({segments: segments.map(segment => ({...segment, spacing}))})
    }
  }

  const hasAnyPhasing = !!get(modification, 'timetables', []).find(
    t => t.phaseAtStop != null
  )

  const distance = (p.segmentDistances || []).reduce(
    (accumulatedDistance, currentDistance) => {
      return accumulatedDistance + currentDistance
    },
    0
  )

  return (
    <>
      <h5>Route Geometry</h5>
      {distance === 0 && modification.type === ADD_TRIP_PATTERN && (
        <div className='alert alert-danger' role='alert'>
          <Icon icon={faExclamationCircle} /> A route geometry must have at
          least 2 stops
        </div>
      )}

      {distance > 0 &&
        modification.type === ADD_TRIP_PATTERN &&
        p.numberOfStops > 0 && (
          <p>{`${p.numberOfStops} stops over ${Math.round(distance * 100) /
            100} km`}</p>
        )}

      {!isEditing ? (
        <Button
          block
          onClick={editOnMap}
          style='warning'
          disabled={!!p.disabled}
        >
          <Icon icon={faPencilAlt} /> {message('transitEditor.startEdit')}
        </Button>
      ) : (
        <Button block onClick={() => p.setMapState()} style='warning'>
          <Icon icon={faStopCircle} /> {message('transitEditor.stopEdit')}
        </Button>
      )}

      {isEditing && distance > 0 && (
        <Button block onClick={autoGen} style='warning'>
          <Icon icon={faCircle} /> {message('transitEditor.snap')}
        </Button>
      )}

      <Checkbox
        defaultChecked={createStopsAutomatically}
        label={message('transitEditor.autoCreateStops')}
        onChange={onAutoCreateStopsChange}
      />

      {createStopsAutomatically && (
        <NumberInput
          value={spacing}
          label={message('transitEditor.stopSpacingMeters')}
          min={MINIMUM_STOP_SPACING}
          onChange={onStopSpacingChange}
          units='meters'
        />
      )}
      {modification.type !== REROUTE && (
        <Checkbox
          checked={modification.bidirectional}
          label={message('transitEditor.bidirectional')}
          onChange={onBidirectionalChange}
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
          onChange={updateCheckboxFor('followRoad')}
        />
      )}

      {modification.type !== REROUTE && isEditing && (
        <Checkbox
          defaultChecked={allowExtend}
          label={message('transitEditor.extend')}
          onChange={updateCheckboxFor('allowExtend')}
        />
      )}

      {modification.type !== REROUTE && isEditing && allowExtend && (
        <Checkbox
          defaultChecked={extendFromEnd}
          label={message('transitEditor.extendFromEnd')}
          onChange={updateCheckboxFor('extendFromEnd')}
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
              <Icon icon={faCircleO} />{' '}
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
})

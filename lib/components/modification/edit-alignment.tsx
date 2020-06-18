import {
  Alert,
  AlertIcon,
  Button,
  Checkbox,
  Heading,
  Stack,
  Text
} from '@chakra-ui/core'
import {faCircle, faStopCircle} from '@fortawesome/free-solid-svg-icons'
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

import Icon from '../icon'
import NumberInput from '../number-input'
import * as Panel from '../panel'

const isValidStopSpacing = (s) => s >= MINIMUM_STOP_SPACING

export default function EditAlignment({
  allStops,
  disabled,
  mapState,
  modification,
  numberOfStops,
  segmentDistances,
  setMapState,
  update,
  ...p
}) {
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
    setMapState({
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
    const newSegments = getExistingStopsAlongPattern(getSegments(), allStops)
    update({segments: newSegments})
  }

  function updateMapState(props) {
    setMapState({
      ...(mapState || {}),
      ...props
    })
  }

  const updateCheckboxFor = (prop) => (e) =>
    updateMapState({[`${prop}`]: e.target.checked})

  /**
   * Toggle whether a pattern is bidirectional.
   */
  function onBidirectionalChange(e) {
    update({bidirectional: e.target.checked})
  }

  /**
   * Toggle whether stops should be created automatically.
   */
  function onAutoCreateStopsChange(e) {
    const spacing = e.target.checked ? DEFAULT_STOP_SPACING_METERS : 0

    // Store in map state
    updateMapState({spacing})

    if (get(modification, 'segments.length') > 0) {
      update({
        segments: modification.segments.map((segment) => ({
          ...segment,
          spacing
        }))
      })
    }
  }

  /**
   * Set stop spacing
   */
  function onStopSpacingChange(spacing) {
    const {segments} = modification

    updateMapState({spacing})

    // only set stop spacing if current spacing is not zero
    if (get(segments, '[0].spacing') > 0) {
      update({segments: segments.map((segment) => ({...segment, spacing}))})
    }
  }

  const hasAnyPhasing = !!get(modification, 'timetables', []).find(
    (t) => t.phaseAtStop != null
  )

  const distance = (segmentDistances || []).reduce(
    (accumulatedDistance, currentDistance) => {
      return accumulatedDistance + currentDistance
    },
    0
  )

  return (
    <Stack spacing={4} {...p}>
      <Heading size='sm'>Route Geometry</Heading>
      {distance === 0 && modification.type === ADD_TRIP_PATTERN && (
        <Alert status='error'>
          <AlertIcon /> A route geometry must have at least 2 stops
        </Alert>
      )}

      {distance > 0 &&
        modification.type === ADD_TRIP_PATTERN &&
        numberOfStops > 0 && (
          <Text>{`${numberOfStops} stops over ${
            Math.round(distance * 100) / 100
          } km`}</Text>
        )}

      {!isEditing ? (
        <Button
          isDisabled={!!disabled}
          isFullWidth
          leftIcon='edit'
          onClick={editOnMap}
          variantColor='yellow'
        >
          {message('transitEditor.startEdit')}
        </Button>
      ) : (
        <Button isFullWidth onClick={() => setMapState()} variantColor='yellow'>
          <Icon icon={faStopCircle} /> {message('transitEditor.stopEdit')}
        </Button>
      )}

      {isEditing && distance > 0 && (
        <Button isFullWidth onClick={autoGen} variantColor='yellow'>
          <Icon icon={faCircle} /> {message('transitEditor.snap')}
        </Button>
      )}

      <Checkbox
        fontWeight='normal'
        isChecked={createStopsAutomatically}
        onChange={onAutoCreateStopsChange}
      >
        {message('transitEditor.autoCreateStops')}
      </Checkbox>

      {createStopsAutomatically && (
        <NumberInput
          label={message('transitEditor.stopSpacingMeters')}
          onChange={onStopSpacingChange}
          test={isValidStopSpacing}
          units='meters'
          value={spacing}
        />
      )}

      {modification.type !== REROUTE && (
        <Checkbox
          fontWeight='normal'
          isChecked={modification.bidirectional}
          isDisabled={hasAnyPhasing}
          onChange={onBidirectionalChange}
        >
          {message('transitEditor.bidirectional')}
        </Checkbox>
      )}

      {hasAnyPhasing && (
        <Alert status='info'>
          {message('transitEditor.bidirectionalWarning')}
        </Alert>
      )}

      {isEditing && (
        <Checkbox
          fontWeight='normal'
          isChecked={followRoad}
          onChange={updateCheckboxFor('followRoad')}
        >
          {message('transitEditor.followRoad')}
        </Checkbox>
      )}

      {modification.type !== REROUTE && isEditing && (
        <Checkbox
          fontWeight='normal'
          isChecked={allowExtend}
          onChange={updateCheckboxFor('allowExtend')}
        >
          {message('transitEditor.extend')}
        </Checkbox>
      )}

      {modification.type !== REROUTE && isEditing && allowExtend && (
        <Checkbox
          fontWeight='normal'
          isChecked={extendFromEnd}
          onChange={updateCheckboxFor('extendFromEnd')}
        >
          {message('transitEditor.extendFromEnd')}
        </Checkbox>
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
            <Stack>
              <Text>{message('transitEditor.instructions')}</Text>
              <Text>
                <strong>Symbology</strong>
              </Text>
              <Text>
                <Icon
                  icon={faCircleO}
                  style={{color: colors.NEUTRAL, opacity: 0.5}}
                />{' '}
                {message('transitEditor.existingStops')}
              </Text>
              <Text>
                <Icon icon={faCircleO} style={{color: colors.ADDED}} />{' '}
                {message('transitEditor.newStopDescription')}
              </Text>
              <Text>
                <Icon
                  icon={faCircleO}
                  style={{color: colors.ADDED, opacity: 0.5}}
                />{' '}
                {message('transitEditor.autocreatedStopDescription')}
              </Text>
              <Text>
                <Icon icon={faCircleO} />{' '}
                {message('transitEditor.snappedStopDescription')}
              </Text>
              <Text>
                <Icon icon={faCircle} style={{color: colors.ADDED}} />{' '}
                {message('transitEditor.controlPointDescription')}
              </Text>
            </Stack>
          </Panel.Body>
        </Panel.Panel>
      )}
    </Stack>
  )
}

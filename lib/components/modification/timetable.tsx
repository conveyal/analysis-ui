import {
  Box,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Stack
} from '@chakra-ui/core'
import {faCalendar} from '@fortawesome/free-solid-svg-icons'
import {useCallback} from 'react'

import {
  MAP_STATE_HIGHLIGHT_SEGMENT,
  MAP_STATE_HIGHLIGHT_STOP
} from 'lib/constants'
import useInput from 'lib/hooks/use-controlled-input'

import ConfirmButton from '../confirm-button'
import Icon from '../icon'
import * as Panel from '../panel'

import SegmentSpeeds from './segment-speeds'
import TimetableEntry from './timetable-entry'

/** Represents a PatternTimetable */
export default function TimetableComponent({
  bidirectional,
  modificationStops,
  numberOfStops,
  projectTimetables,
  qualifiedStops,
  remove,
  segmentDistances,
  setMapState,
  timetable,
  update
}) {
  const _changeName = useCallback((name) => update({name}), [update])
  const nameInput = useInput({
    onChange: _changeName,
    value: timetable.name
  })

  const _highlightSegment = useCallback(
    (segmentIndex) => {
      setMapState({
        state: MAP_STATE_HIGHLIGHT_SEGMENT,
        segmentIndex
      })
    },
    [setMapState]
  )

  const _highlightStop = useCallback(
    (stopIndex) => {
      setMapState({
        state: MAP_STATE_HIGHLIGHT_STOP,
        stopIndex
      })
    },
    [setMapState]
  )

  return (
    <Panel.Collapsible
      defaultExpanded={false}
      heading={() => (
        <>
          <Icon icon={faCalendar} />
          <strong> {nameInput.value}</strong>
        </>
      )}
    >
      <Panel.Body>
        <Stack spacing={4}>
          <FormControl isInvalid={nameInput.isInvalid}>
            <FormLabel htmlFor={nameInput.id}>Name</FormLabel>
            <Input {...nameInput} />
          </FormControl>

          <TimetableEntry
            bidirectional={bidirectional}
            modificationStops={modificationStops}
            projectTimetables={projectTimetables}
            timetable={timetable}
            update={update}
          />

          <Divider />

          {segmentDistances.length > 0 && (
            <SegmentSpeeds
              dwellTime={timetable.dwellTime}
              dwellTimes={timetable.dwellTimes || []}
              highlightSegment={_highlightSegment}
              highlightStop={_highlightStop}
              qualifiedStops={qualifiedStops}
              numberOfStops={numberOfStops}
              segmentDistances={segmentDistances}
              segmentSpeeds={timetable.segmentSpeeds}
              update={update}
            />
          )}

          <ConfirmButton
            action='Delete Timetable'
            description='Are you sure you would like to remove this timetable?'
            isFullWidth
            leftIcon='delete'
            onConfirm={remove}
            variantColor='red'
          />
        </Stack>
      </Panel.Body>
    </Panel.Collapsible>
  )
}

import {
  Alert,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  SimpleGrid,
  Stack
} from '@chakra-ui/core'
import {useCallback} from 'react'
import {useSelector} from 'react-redux'

import message from 'lib/message'
import selectPhaseFromTimetableStops from 'lib/selectors/all-phase-from-timetable-stops'

import MinutesSeconds from '../minutes-seconds'
import TimePicker from '../time-picker'

import Phase from './phase'

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
]

/**
 * Superclass for both changing frequencies and creating patterntimetables for
 * new patterns
 */
export default function TimetableEntry({
  bidirectional,
  modificationStops,
  projectTimetables,
  timetable,
  update
}) {
  const allPhaseFromTimetableStops = useSelector(selectPhaseFromTimetableStops)
  const availableTimetables = projectTimetables.filter(
    (tt) => tt._id !== timetable._id
  )

  const {endTime, startTime} = timetable

  /** set the start time of this modification */
  const setStartTime = useCallback(
    (time) => {
      const newStartTime = modBy24hours(time)
      update({
        startTime: newStartTime,
        endTime: add24hoursToEndIfLessThanStart(newStartTime, endTime)
      })
    },
    [endTime, update]
  )

  /** set the end time of this modification */
  const setEndTime = useCallback(
    (time) => {
      const newEndTime = modBy24hours(time)
      update({
        endTime: add24hoursToEndIfLessThanStart(startTime, newEndTime)
      })
    },
    [startTime, update]
  )

  const onFreqChange = useCallback((headwaySecs) => update({headwaySecs}), [
    update
  ])

  return (
    <Stack spacing={4}>
      <FormControl>
        <FormLabel>Days active</FormLabel>
        <SimpleGrid columns={5}>
          {DAYS.map((day) => (
            <Day
              day={day}
              isChecked={timetable[day.toLowerCase()]}
              key={day}
              update={update}
            />
          ))}
        </SimpleGrid>
      </FormControl>
      <MinutesSeconds
        label='Frequency'
        onChange={onFreqChange}
        seconds={timetable.headwaySecs}
      />
      <TimePicker
        label='Start time'
        onChange={setStartTime}
        value={timetable.startTime}
      />
      <TimePicker
        label='End time'
        onChange={setEndTime}
        value={timetable.endTime}
      />
      <Checkbox
        fontWeight='normal'
        isChecked={timetable.exactTimes}
        onChange={(e) => update({exactTimes: e.currentTarget.checked})}
        isDisabled={!!timetable.phaseAtStop}
      >
        Times are exact
      </Checkbox>
      {timetable.phaseAtStop ? (
        <Alert status='info'>{message('phasing.exactTimesWarning')}</Alert>
      ) : (
        <Divider />
      )}
      <Phase
        availableTimetables={availableTimetables}
        disabled={!!(timetable.exactTimes || bidirectional)}
        modificationStops={modificationStops}
        phaseAtStop={timetable.phaseAtStop}
        phaseFromTimetable={timetable.phaseFromTimetable}
        phaseFromStop={timetable.phaseFromStop}
        phaseSeconds={timetable.phaseSeconds}
        selectedPhaseFromTimetableStops={
          allPhaseFromTimetableStops[timetable.phaseFromTimetable]
        }
        timetableHeadway={timetable.headwaySecs}
        update={update}
      />
    </Stack>
  )
}

const modBy24hours = (time) => time % (60 * 60 * 24)
const add24hoursToEndIfLessThanStart = (start, end) =>
  end < start ? end + 60 * 60 * 24 : end

function Day({isChecked, day, update, ...p}) {
  const onChange = useCallback(
    (e) => update({[day.toLowerCase()]: e.target.checked}),
    [day, update]
  )
  return (
    <Checkbox
      isChecked={isChecked}
      fontWeight='normal'
      onChange={onChange}
      {...p}
    >
      {day.slice(0, 3)}
    </Checkbox>
  )
}

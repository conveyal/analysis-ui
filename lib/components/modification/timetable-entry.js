import {
  Alert,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  Stack
} from '@chakra-ui/core'
import React from 'react'
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
export default function TimetableEntry(p) {
  const allPhaseFromTimetableStops = useSelector(selectPhaseFromTimetableStops)
  const availableTimetables = p.projectTimetables.filter(
    (tt) => tt._id !== p.timetable._id
  )

  /** set the start time of this modification */
  function setStartTime(time) {
    const startTime = modBy24hours(time)
    p.update({
      startTime,
      endTime: add24hoursToEndIfLessThanStart(startTime, p.timetable.endTime)
    })
  }

  /** set the end time of this modification */
  function setEndTime(time) {
    const endTime = modBy24hours(time)
    p.update({
      endTime: add24hoursToEndIfLessThanStart(p.timetable.startTime, endTime)
    })
  }

  return (
    <Stack spacing={4}>
      <FormControl>
        <FormLabel>Days active</FormLabel>
        <Days setDay={(d, v) => p.update({[d]: v})} timetable={p.timetable} />
      </FormControl>
      <MinutesSeconds
        label='Frequency'
        onChange={(s) => p.update({headwaySecs: s})}
        seconds={p.timetable.headwaySecs}
      />
      <TimePicker
        label='Start time'
        onChange={setStartTime}
        value={p.timetable.startTime}
      />
      <TimePicker
        label='End time'
        onChange={setEndTime}
        value={p.timetable.endTime}
      />
      <Checkbox
        fontWeight='normal'
        isChecked={p.timetable.exactTimes}
        onChange={(e) => p.update({exactTimes: e.currentTarget.checked})}
        isDisabled={!!p.timetable.phaseAtStop}
      >
        Times are exact
      </Checkbox>
      {p.timetable.phaseAtStop ? (
        <Alert status='info'>{message('phasing.exactTimesWarning')}</Alert>
      ) : (
        <Divider />
      )}
      <Phase
        availableTimetables={availableTimetables}
        disabled={!!(p.timetable.exactTimes || p.bidirectional)}
        modificationStops={p.modificationStops}
        phaseAtStop={p.timetable.phaseAtStop}
        phaseFromTimetable={p.timetable.phaseFromTimetable}
        phaseFromStop={p.timetable.phaseFromStop}
        phaseSeconds={p.timetable.phaseSeconds}
        selectedPhaseFromTimetableStops={
          allPhaseFromTimetableStops[p.timetable.phaseFromTimetable]
        }
        timetableHeadway={p.timetable.headwaySecs}
        update={p.update}
      />
    </Stack>
  )
}

const modBy24hours = (time) => time % (60 * 60 * 24)
const add24hoursToEndIfLessThanStart = (start, end) =>
  end < start ? end + 60 * 60 * 24 : end

function Days({setDay, timetable, ...p}) {
  return (
    <Stack spacing={3} isInline wrap='wrap' {...p}>
      {DAYS.map((day) => {
        const name = day.toLowerCase()
        return (
          <Checkbox
            isChecked={timetable[name]}
            fontWeight='normal'
            key={`${name}-checkbox`}
            label={day.slice(0, 3)}
            onChange={(e) => setDay(name, e.target.checked)}
          >
            {day.slice(0, 3)}
          </Checkbox>
        )
      })}
    </Stack>
  )
}

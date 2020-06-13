import {Alert, FormControl, FormLabel, Heading, Stack} from '@chakra-ui/core'
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons'
import get from 'lodash/get'
import React from 'react'

import message from 'lib/message'
import {toString as timetableToString} from 'lib/utils/timetable'

import Icon from '../icon'
import Select from '../select'
import {Group as FormGroup} from '../input'
import MinutesSeconds from '../minutes-seconds'

export default function Phase(p) {
  const {phaseFromTimetable, update} = p
  const selectedTimetableId = (phaseFromTimetable || '').split(':')[1]
  const selectedTimetable = p.availableTimetables.find(
    (tt) => tt._id === selectedTimetableId
  )

  function _setPhaseFromTimetable(tt) {
    update({
      phaseFromStop: null,
      phaseFromTimetable: tt ? `${tt.modificationId}:${tt._id}` : null
    })
  }

  return (
    <Stack spacing={4} mb={4}>
      <Heading size='sm'>
        <span>Phasing </span>
        <a
          href='http://docs.analysis.conveyal.com/en/latest/edit-scenario/phasing.html'
          rel='noopener noreferrer'
          target='_blank'
          title='Learn more about phasing'
        >
          <Icon icon={faInfoCircle} />
        </a>
      </Heading>
      <FormControl isDisabled={p.disabled}>
        <FormLabel htmlFor='phaseAtStop'>{message('phasing.atStop')}</FormLabel>
        <Select
          inputId='phaseAtStop'
          isClearable
          isDisabled={p.disabled}
          name={message('phasing.atStop')}
          getOptionLabel={(s) => s.stop_name}
          getOptionValue={(s) => s.stop_id}
          onChange={(s) => update({phaseAtStop: get(s, 'stop_id')})}
          options={p.modificationStops}
          placeholder={message('phasing.atStop')}
          value={p.modificationStops.find((s) => s.stop_id === p.phaseAtStop)}
        />
      </FormControl>
      {p.disabled && <Alert status='info'>{message('phasing.disabled')}</Alert>}
      {p.phaseAtStop && (
        <>
          <FormGroup
            label={message('phasing.fromTimetable')}
            id='phaseFromTimetable'
          >
            <Select
              inputId='phaseFromTimetable'
              isClearable
              isDisabled={p.disabled}
              name={message('phasing.fromTimetable')}
              getOptionLabel={(t) =>
                `${t.modificationName}: ${timetableToString(t)}`
              }
              getOptionValue={(t) => `${t.modificationId}:${t._id}`}
              onChange={_setPhaseFromTimetable}
              options={p.availableTimetables}
              placeholder={message('phasing.fromTimetable')}
              value={selectedTimetable}
            />
          </FormGroup>
          {p.phaseFromTimetable &&
            (selectedTimetable ? (
              <>
                {selectedTimetable.headwaySecs !== p.timetableHeadway && (
                  <Alert status='error'>
                    {message('phasing.headwayMismatchWarning', {
                      selectedTimetableHeadway:
                        selectedTimetable.headwaySecs / 60
                    })}
                  </Alert>
                )}
                {get(p.selectedPhaseFromTimetableStops, 'length') > 0 ? (
                  <FormGroup
                    label={message('phasing.fromStop')}
                    id='phaseFromStop'
                  >
                    <Select
                      inputId='phaseFromStop'
                      getOptionLabel={(s) => s.stop_name}
                      getOptionValue={(s) => s.stop_id}
                      name={message('phasing.fromStop')}
                      onChange={(s) =>
                        update({phaseFromStop: get(s, 'stop_id')})
                      }
                      options={p.selectedPhaseFromTimetableStops}
                      placeholder={message('phasing.fromStop')}
                      value={p.selectedPhaseFromTimetableStops.find(
                        (s) => s.stop_id === p.phaseFromStop
                      )}
                    />
                  </FormGroup>
                ) : (
                  <Alert status='error'>
                    {message('phasing.noAvailableStopsWarning')}
                  </Alert>
                )}
                {p.phaseFromStop && (
                  <MinutesSeconds
                    label={message('phasing.minutes')}
                    onChange={(phaseSeconds) => update({phaseSeconds})}
                    seconds={p.phaseSeconds}
                  />
                )}
              </>
            ) : (
              <Alert status='error'>
                <strong>Selected timetable no longer exists.</strong> Please
                clear or change your phasing options or there will be errors
                during analysis.
              </Alert>
            ))}
        </>
      )}
    </Stack>
  )
}

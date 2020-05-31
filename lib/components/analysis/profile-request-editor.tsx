import {
  Alert,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Divider,
  Select,
  SimpleGrid
} from '@chakra-ui/core'
import get from 'lodash/get'
import {forwardRef, useState} from 'react'
import DateTime from 'react-datetime'

import useInput from 'lib/hooks/use-controlled-input'
import message from 'lib/message'

import TimePicker from '../time-picker'

const DATE_FORMAT = 'YYYY-MM-DD'

const bold = (b) => `<strong>${b}</strong>`

function bundleIsOutOfDate(bundle, dateString, project) {
  if (project === null || project === undefined) return
  const date = new Date(dateString)
  const {serviceEnd, serviceStart} = bundle
  if (
    bundle != null &&
    (new Date(serviceStart) > date || new Date(serviceEnd) < date)
  ) {
    return message('analysis.bundleOutOfDate', {
      bundle: bold(bundle.name),
      project: bold(project.name),
      serviceStart: bold(serviceStart),
      serviceEnd: bold(serviceEnd),
      selectedDate: bold(dateString)
    })
  }
}

const InputWithUnits: React.ComponentType<{units: string} & any> = forwardRef(
  (props, ref) => {
    const {units, ...p} = props
    return (
      <InputGroup>
        <Input {...p} ref={ref} />
        <InputRightElement color='gray.400' mr={5} userSelect='none'>
          {units}
        </InputRightElement>
      </InputGroup>
    )
  }
)

// Helper function for testing inputs
const valueWithin = (min: number, max: number) => (v) => {
  const parsed = parseFloat(v)
  return parsed >= min && parsed <= max
}

// Helper for max mode times which can be null
const modeLessThanMax = (max: number) => (v) => {
  const parsed = parseInt(v)
  return isNaN(parsed) ? true : parsed <= max
}

/**
 * Edit the parameters of a profile request.
 */
export default function ProfileRequestEditor({
  bundle,
  disabled,
  profileRequest,
  project,
  setProfileRequest,
  ...p
}) {
  const setFromTime = (fromTime) =>
    setProfileRequest({fromTime: parseInt(fromTime)})
  const setToTime = (toTime) => setProfileRequest({toTime: parseInt(toTime)})

  const [dateIsValid, setDateIsValid] = useState(true)
  function setDate(date) {
    if (!date || !date.isValid || !date.isValid()) {
      return setDateIsValid(false)
    }
    setDateIsValid(true)
    setProfileRequest({date: date.format(DATE_FORMAT)})
  }

  const {date, fromTime, toTime} = profileRequest
  const bundleOutOfDate = bundleIsOutOfDate(bundle, date, project)

  function set(newFields) {
    setProfileRequest(newFields)
  }

  const walkSpeedInput = useInput(
    Math.round(profileRequest.walkSpeed * 36) / 10, // m/s to km/h
    (v) => set({walkSpeed: parseFloat(v) / 3.6}), // km/h to m/s
    valueWithin(3, 15)
  )
  const maxWalkTimeInput = useInput(
    profileRequest.maxWalkTime,
    (v) => set({maxWalkTime: parseInt(v)}),
    modeLessThanMax(60)
  )
  const bikeSpeedInput = useInput(
    Math.round(profileRequest.bikeSpeed * 36) / 10,
    (v) => set({bikeSpeed: parseFloat(v) / 3.6}), // km/h to m/s
    valueWithin(5, 20)
  )
  const maxBikeTimeInput = useInput(
    profileRequest.maxBikeTime,
    (v) => set({maxBikeTime: parseInt(v)}),
    modeLessThanMax(60)
  )
  const monteCarloInput = useInput(
    profileRequest.monteCarloDraws,
    (v) => set({monteCarloDraws: parseInt(v)}),
    valueWithin(1, 10000)
  )
  const maxTransfersInput = useInput(
    profileRequest.maxRides - 1, // Max rides is max transfers + 1, but transfers is common usage terminology
    (v) => set({maxRides: parseInt(v) + 1}),
    valueWithin(0, 7)
  )

  return (
    <SimpleGrid columns={3} spacing={5} {...p}>
      <FormControl
        isDisabled={disabled}
        isInvalid={bundleOutOfDate || !dateIsValid}
      >
        <FormLabel>{message('analysis.date')}</FormLabel>
        <DateTime
          closeOnSelect
          dateFormat={DATE_FORMAT}
          inputProps={{disabled}}
          onChange={setDate}
          renderInput={(p) => <Input {...p} />}
          timeFormat={false}
          utc // because new Date('2016-12-12') yields a date at midnight UTC
          value={date}
        />
        {bundleOutOfDate && (
          <FormErrorMessage>
            <strong>Warning! </strong>
            <span dangerouslySetInnerHTML={{__html: bundleOutOfDate}} />
          </FormErrorMessage>
        )}
      </FormControl>

      <TimePicker
        disabled={disabled}
        id='fromTime'
        label={message('analysis.fromTime')}
        value={fromTime}
        onChange={setFromTime}
      />

      <TimePicker
        disabled={disabled}
        id='toTime'
        label={message('analysis.toTime')}
        value={toTime}
        onChange={setToTime}
      />

      <Divider gridColumn='1 / span 3' />

      <FormControl isDisabled={disabled} isInvalid={walkSpeedInput.isInvalid}>
        <FormLabel>Walk speed</FormLabel>
        <InputWithUnits {...walkSpeedInput} type='number' units='km/h' />
      </FormControl>

      <FormControl isDisabled={disabled} isInvalid={maxWalkTimeInput.isInvalid}>
        <FormLabel>Max walk time</FormLabel>
        <InputWithUnits {...maxWalkTimeInput} units='minutes' />
      </FormControl>

      <Alert status='info'>
        Lower time limits may apply to transfer and egress legs.
      </Alert>

      <FormControl isDisabled={disabled} isInvalid={bikeSpeedInput.isInvalid}>
        <FormLabel>Bike speed</FormLabel>
        <InputWithUnits {...bikeSpeedInput} type='number' units='km/h' />
      </FormControl>

      <FormControl isDisabled={disabled} isInvalid={maxBikeTimeInput.isInvalid}>
        <FormLabel>Max bike time</FormLabel>
        <InputWithUnits {...maxBikeTimeInput} units='minutes' />
      </FormControl>

      <FormControl isDisabled={disabled}>
        <FormLabel htmlFor='bikeLts'>Max bike LTS</FormLabel>
        <Select
          id='bikeLts'
          onChange={(v) => set({bikeTrafficStress: parseInt(v.target.value)})}
          value={get(profileRequest, 'bikeTrafficStress', 4)}
        >
          <option value={1}>1 - Low stress</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4 - High stress</option>
        </Select>
      </FormControl>

      <FormControl isDisabled={disabled} isInvalid={monteCarloInput.isInvalid}>
        <FormLabel>{message('analysis.monteCarloDraws')}</FormLabel>
        <Input {...monteCarloInput} type='number' />
      </FormControl>

      <FormControl
        isDisabled={disabled}
        isInvalid={maxTransfersInput.isInvalid}
      >
        <FormLabel>{message('analysis.transfers')}</FormLabel>
        <Input {...maxTransfersInput} type='number' />
      </FormControl>
    </SimpleGrid>
  )
}

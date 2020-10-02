import {
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel
} from '@chakra-ui/core'
import without from 'lodash/without'
import {memo} from 'react'

import message from 'lib/message'

import {ModeIcon} from '../mode-icon'

const WALK = 'WALK'
const BICYCLE = 'BICYCLE'
const CAR = 'CAR'
const CAR_PARK = 'CAR_PARK' // pahk your cah in havahd yahd

const BUS = 'BUS'
const RAIL = 'RAIL'
const TRAM = 'TRAM'
const SUBWAY = 'SUBWAY'
const FERRY = 'FERRY'
const CABLE_CAR = 'CABLE_CAR'
const GONDOLA = 'GONDOLA'
const FUNICULAR = 'FUNICULAR'
const ALL = 'ALL'
const ALL_TRANSIT_ARRAY = [
  BUS,
  TRAM,
  RAIL,
  SUBWAY,
  FERRY,
  CABLE_CAR,
  GONDOLA,
  FUNICULAR
]
const ALL_TRANSIT_STRING = ALL_TRANSIT_ARRAY.join(',')

/** Select modes of travel */
export default function ModeSelector({
  accessModes,
  color,
  directModes,
  disabled,
  egressModes,
  transitModes,
  update,
  ...p
}) {
  const _hasTransit = (mode) => transitModes.indexOf(mode) !== -1
  const _hasAllTransit = () =>
    ALL_TRANSIT_ARRAY.map((mode) => transitModes.indexOf(mode) !== -1).every(
      Boolean
    )

  function selectEgressMode(newMode) {
    update({egressModes: newMode})
  }

  const _toggleTransitMode = (mode) => () => {
    let newTransitModes
    if (mode === ALL) {
      newTransitModes = _hasAllTransit() ? '' : ALL_TRANSIT_STRING
    } else {
      newTransitModes = _hasTransit(mode)
        ? without(transitModes.split(','), mode).join(',')
        : [transitModes, mode].filter(Boolean).join(',')
    }

    // park-and-ride requires transit. if it selected when transit is turned
    // off, switch access mode to walk
    const newAccessModes =
      newTransitModes === '' && accessModes === CAR_PARK ? WALK : accessModes

    update({
      accessModes: newAccessModes,
      directModes: newAccessModes,
      transitModes: newTransitModes
    })
  }

  const transit = transitModes !== ''

  return (
    <Flex justify='space-between' {...p}>
      <AccessModeSelector
        color={color}
        hasTransit={transitModes !== ''}
        isDisabled={disabled}
        selectedMode={transit ? accessModes : directModes}
        update={update}
      />
      <FormControl>
        <FormLabel htmlFor='transitModes'>Transit modes</FormLabel>
        <div>
          <ButtonGroup isAttached id='transitModes'>
            <Button
              isActive={_hasAllTransit()}
              isDisabled={disabled}
              onClick={_toggleTransitMode(ALL)}
              title='All transit'
              variantColor={color}
            >
              All
            </Button>
            <Button
              isActive={_hasTransit(BUS)}
              isDisabled={disabled}
              onClick={_toggleTransitMode(BUS)}
              title={message('mode.bus')}
              variantColor={color}
            >
              <ModeIcon mode={BUS} />
            </Button>
            <Button
              isActive={_hasTransit(TRAM)}
              isDisabled={disabled}
              onClick={_toggleTransitMode(TRAM)}
              title={message('mode.tram')}
              variantColor={color}
            >
              <ModeIcon mode={TRAM} />
            </Button>
            <Button
              isActive={_hasTransit(SUBWAY)}
              isDisabled={disabled}
              onClick={_toggleTransitMode(SUBWAY)}
              title={message('mode.subway')}
              variantColor={color}
            >
              <ModeIcon mode={SUBWAY} />
            </Button>
            <Button
              isActive={_hasTransit(RAIL)}
              isDisabled={disabled}
              onClick={_toggleTransitMode(RAIL)}
              title={message('mode.rail')}
              variantColor={color}
            >
              <ModeIcon mode={RAIL} />
            </Button>
            <Button
              isActive={_hasTransit(FERRY)}
              isDisabled={disabled}
              onClick={_toggleTransitMode(FERRY)}
              title={message('mode.ferry')}
              variantColor={color}
            >
              <ModeIcon mode={FERRY} />
            </Button>
            <Button
              isActive={_hasTransit(CABLE_CAR)}
              isDisabled={disabled}
              onClick={_toggleTransitMode(CABLE_CAR)}
              title={message('mode.cableCar')}
              variantColor={color}
            >
              <ModeIcon mode={CABLE_CAR} />
            </Button>
            <Button
              isActive={_hasTransit(GONDOLA)}
              isDisabled={disabled}
              onClick={_toggleTransitMode(GONDOLA)}
              title={message('mode.gondola')}
              variantColor={color}
            >
              <ModeIcon mode={GONDOLA} />
            </Button>
            <Button
              isActive={_hasTransit(FUNICULAR)}
              isDisabled={disabled}
              onClick={_toggleTransitMode(FUNICULAR)}
              title={message('mode.funicular')}
              variantColor={color}
            >
              <ModeIcon mode={FUNICULAR} />
            </Button>
          </ButtonGroup>
        </div>
      </FormControl>
      <FormControl>
        <FormLabel pr={0} htmlFor='egressMode'>
          Egress mode
        </FormLabel>
        <div>
          <ButtonGroup isAttached id='egressMode'>
            <Button
              isActive={transit && egressModes === WALK}
              isDisabled={!transit || disabled}
              onClick={() => selectEgressMode(WALK)}
              title={`${message('analysis.modes.walk')} egress`}
              variantColor={color}
            >
              <ModeIcon mode={WALK} />
            </Button>
            <Button
              isActive={transit && egressModes === BICYCLE}
              isDisabled={!transit || disabled}
              onClick={() => selectEgressMode(BICYCLE)}
              title={`${message('analysis.modes.bicycle')} egress`}
              variantColor={color}
            >
              <ModeIcon mode={BICYCLE} />
            </Button>
          </ButtonGroup>
        </div>
      </FormControl>
    </Flex>
  )
}

type AccessModeSelectorProps = {
  color: string
  hasTransit: boolean
  isDisabled: boolean
  selectedMode: string
  update: (newModes: {accessModes: string; directModes: string}) => void
}

const AccessModeSelector = memo<AccessModeSelectorProps>(
  function AccessModeSelector({
    color,
    hasTransit,
    isDisabled,
    selectedMode,
    update
  }) {
    const _selectAccessMode = (newMode: string) => () => {
      // easiest to just overwrite both. Access mode is used in transit searches
      // and direct mode in non-transit searches; overwriting only one of them
      // however would require additional updates when toggling transit.
      update({
        accessModes: newMode,
        directModes: newMode
      })
    }
    const label = hasTransit ? message('mode.access') : message('mode.direct')
    return (
      <FormControl>
        <FormLabel htmlFor='accessMode'>{label}</FormLabel>
        <div>
          <ButtonGroup isAttached id='accessMode'>
            <Button
              isActive={selectedMode === WALK}
              isDisabled={isDisabled}
              onClick={_selectAccessMode(WALK)}
              title={`${message('analysis.modes.walk')} ${label}`}
              variantColor={color}
            >
              <ModeIcon mode='WALK' />
            </Button>
            <Button
              isActive={selectedMode === BICYCLE}
              isDisabled={isDisabled}
              onClick={_selectAccessMode(BICYCLE)}
              title={`${message('analysis.modes.bicycle')} ${label}`}
              variantColor={color}
            >
              <ModeIcon mode={BICYCLE} />
            </Button>
            <Button
              isActive={selectedMode === CAR}
              isDisabled={isDisabled}
              onClick={_selectAccessMode(CAR)}
              title={`${message('analysis.modes.car')} ${label}`}
              variantColor={color}
            >
              <ModeIcon mode={CAR} />
            </Button>
            <Button
              isActive={selectedMode === CAR_PARK}
              isDisabled={isDisabled || !hasTransit}
              onClick={_selectAccessMode(CAR_PARK)}
              title={`${message('analysis.modes.carPark')} ${label}`}
              variantColor={color}
            >
              <ModeIcon mode={CAR_PARK} />
            </Button>
          </ButtonGroup>
        </div>
      </FormControl>
    )
  }
)

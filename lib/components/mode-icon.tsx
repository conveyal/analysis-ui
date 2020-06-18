import {Box, BoxProps} from '@chakra-ui/core'
import {
  faBicycle,
  faBus,
  faCar,
  faWalking,
  faShip,
  faSubway,
  faTrain
} from '@fortawesome/free-solid-svg-icons'
import toStartCase from 'lodash/startCase'

import Icon from './icon'

type Mode =
  | 'BICYCLE'
  | 'BUS'
  | 'CABLE_CAR'
  | 'CAR'
  | 'CAR_PARK'
  | 'FERRY'
  | 'FUNICULAR'
  | 'GONDOLA'
  | 'RAIL'
  | 'SUBWAY'
  | 'TRAM'
  | 'WALK'

function getIcon(mode: Mode) {
  switch (mode) {
    case 'BICYCLE':
      return <Icon icon={faBicycle} />
    case 'BUS':
      return <Icon icon={faBus} />
    case 'CABLE_CAR':
      return <strong>C</strong>
    case 'CAR':
      return <Icon icon={faCar} />
    case 'CAR_PARK':
      return <strong>P</strong>
    case 'FERRY':
      return <Icon icon={faShip} />
    case 'FUNICULAR':
      return <strong>F</strong>
    case 'GONDOLA':
      return <strong>G</strong>
    case 'RAIL':
      return <Icon icon={faTrain} />
    case 'SUBWAY':
      return <Icon icon={faSubway} />
    case 'TRAM':
      return <strong>T</strong>
    case 'WALK':
      return <Icon icon={faWalking} />
  }
}

type ModeIconProps = {
  mode: Mode
} & BoxProps

export default function ModeIcon({mode, ...p}: ModeIconProps) {
  return (
    <Box {...p} title={toStartCase(mode)}>
      {getIcon(mode)}
    </Box>
  )
}

import {Box, BoxProps, Text} from '@chakra-ui/core'
import {
  faBicycle,
  faBus,
  faCar,
  faWalking,
  faShip,
  faSubway,
  faTrain,
  faParking
} from '@fortawesome/free-solid-svg-icons'
import toStartCase from 'lodash/startCase'

import Icon from './icon'

type Mode =
  | 'BICYCLE'
  | 'BICYCLE_RENT'
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

const Letter = ({children}) => (
  <Text
    fontFamily='mono'
    fontSize='14px'
    fontWeight={600}
    height='17px'
    lineHeight='1.5rem'
    textAlign='center'
    width='15px'
  >
    {children}
  </Text>
)

export function ModeIcon({mode}: {mode: Mode}) {
  switch (mode) {
    case 'BICYCLE':
    case 'BICYCLE_RENT':
      return <Icon icon={faBicycle} />
    case 'BUS':
      return <Icon icon={faBus} />
    case 'CABLE_CAR':
      return <Letter>C</Letter>
    case 'CAR':
      return <Icon icon={faCar} />
    case 'CAR_PARK':
      return <Icon icon={faParking}>P</Icon>
    case 'FERRY':
      return <Icon icon={faShip} />
    case 'FUNICULAR':
      return <Letter>F</Letter>
    case 'GONDOLA':
      return <Letter>G</Letter>
    case 'RAIL':
      return <Icon icon={faTrain} />
    case 'SUBWAY':
      return <Icon icon={faSubway} />
    case 'TRAM':
      return <Letter>T</Letter>
    case 'WALK':
      return <Icon icon={faWalking} />
    default:
      console.error(`${mode} does not exist`)
      return null
  }
}

type ModeIconProps = {
  mode: Mode
} & BoxProps

export default function ModeIconBox({mode, ...p}: ModeIconProps) {
  return (
    <Box {...p} title={toStartCase(mode)}>
      <ModeIcon mode={mode} />
    </Box>
  )
}

import {
  Box,
  Button,
  Flex,
  Heading,
  PseudoBox,
  Stack,
  SimpleGrid,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  useDisclosure
} from '@chakra-ui/core'
import {faChevronUp, faChevronDown} from '@fortawesome/free-solid-svg-icons'
import fpGet from 'lodash/fp/get'
import {format} from 'date-fns'
import {useSelector} from 'react-redux'

import message from 'lib/message'
import {secondsToHhMmString} from 'lib/utils/time'

import Icon from '../icon'
import {ALink} from '../link'

import ModeSummary from './mode-summary'

// Convert to the day of the week
const getDayOfWeek = (dateStr) => format(new Date(dateStr), 'eeee')

// Minimal selectors for projects and bundles
const selectProjects = fpGet('project.projects')
const selectBundles = fpGet('region.bundles')

const stringifyIfObject = (o) =>
  typeof o === 'object' ? JSON.stringify(o, null, ' ') : o

const TDTitle = ({children}) => (
  <Box
    as='td'
    overflow='hidden'
    fontWeight={600}
    px={4}
    py={2}
    style={{
      textOverflow: 'ellipsis'
    }}
    textAlign='right'
    title={children}
    width='30%'
  >
    {children}
  </Box>
)

const TDValue = ({children}) => (
  <Box as='td' width='70%'>
    {children}
  </Box>
)

/** Display the parameters of a profile request */
export default function ProfileRequestDisplay({
  bundleId,
  color = 'blue',
  profileRequest,
  projectId
}) {
  const projects = useSelector(selectProjects)
  const bundles = useSelector(selectBundles)

  const {onToggle, isOpen} = useDisclosure()

  const keys = Object.keys(profileRequest)
  keys.sort()

  const project = projects.find((p) => p._id === projectId)
  const bundle = bundles.find((b) => b._id === bundleId)

  return (
    <Stack spacing={0}>
      <Box
        as='table'
        style={{
          tableLayout: 'fixed'
        }}
        width='100%'
      >
        <PseudoBox
          as='tr'
          _odd={{
            bg: `${color}.50`
          }}
        >
          <TDTitle>Project</TDTitle>
          <TDValue>
            <ALink
              to='project'
              projectId={project._id}
              regionId={project.regionId}
            >
              {project.name}
            </ALink>
          </TDValue>
        </PseudoBox>
        <PseudoBox
          as='tr'
          _odd={{
            bg: `${color}.50`
          }}
        >
          <TDTitle>Bundle</TDTitle>
          <TDValue>
            <ALink
              to='bundleEdit'
              bundleId={bundle._id}
              regionId={bundle.regionId}
            >
              {bundle.name}
            </ALink>
          </TDValue>
        </PseudoBox>
        <PseudoBox
          as='tr'
          _odd={{
            bg: `${color}.50`
          }}
        >
          <TDTitle>Date Time</TDTitle>
          <TDValue>
            {profileRequest.date}&nbsp;&nbsp;
            {secondsToHhMmString(profileRequest.fromTime)}-
            {secondsToHhMmString(profileRequest.toTime)}
          </TDValue>
        </PseudoBox>
        <PseudoBox
          as='tr'
          _odd={{
            bg: `${color}.50`
          }}
        >
          <TDTitle>Modes</TDTitle>
          <TDValue>
            <ModeSummary
              accessModes={profileRequest.accessModes}
              color={color}
              egressModes={profileRequest.egressModes}
              max={10}
              transitModes={profileRequest.transitModes}
            />
          </TDValue>
        </PseudoBox>
      </Box>

      <Box borderBottom='1px solid #E2E8F0'>
        <Button
          borderRadius='0'
          _focus={{
            outline: 'none'
          }}
          onClick={onToggle}
          size='sm'
          title={isOpen ? 'collapse' : 'expand'}
          variant='ghost'
          variantColor={color}
          width='100%'
        >
          <Icon icon={isOpen ? faChevronUp : faChevronDown} />
        </Button>
        {isOpen && (
          <Box
            as='table'
            fontFamily='mono'
            fontSize='sm'
            style={{
              tableLayout: 'fixed'
            }}
            width='100%'
          >
            {keys.map((k) => (
              <PseudoBox
                as='tr'
                _odd={{
                  bg: `${color}.50`
                }}
              >
                <TDTitle>{k}</TDTitle>
                <TDValue>
                  <Box as='pre' bg='transparent' border='none' pr={3} py={2}>
                    {stringifyIfObject(profileRequest[k])}
                  </Box>
                </TDValue>
              </PseudoBox>
            ))}
          </Box>
        )}
      </Box>
    </Stack>
  )
}

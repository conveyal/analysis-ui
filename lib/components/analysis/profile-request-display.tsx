import {
  Box,
  Button,
  PseudoBox,
  Stack,
  Tooltip,
  useDisclosure
} from '@chakra-ui/core'
import {
  faChevronUp,
  faChevronDown,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons'
import fpGet from 'lodash/fp/get'
import {useSelector} from 'react-redux'
import useSWR from 'swr'

import {API_URL} from 'lib/constants'
import downloadJSON from 'lib/utils/download-json'
import {secondsToHhMmString} from 'lib/utils/time'

import Icon from '../icon'
import {ALink} from '../link'

import ModeSummary from './mode-summary'

const fetcher = (url) => fetch(url).then((res) => res.json())

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
    width='35%'
  >
    {children}
  </Box>
)

const TDValue = ({children}) => (
  <Box as='td' width='65%'>
    {children}
  </Box>
)

const PROJECT_CHANGE_NOTE =
  'Notice: project may have changed since the analysis was run. See request JSON for exact modifications used.'
const SCENARIO_CHANGE_NOTE =
  'Notice: scenario may have changed since the analysis was run. See request JSON for exact modifications used.'

/** Display the parameters of a profile request */
export default function ProfileRequestDisplay({
  bundleId,
  color = 'blue',
  profileRequest,
  projectId
}) {
  const {data: requestJSON} = useSWR(
    `${API_URL}/regional/${profileRequest._id}`,
    fetcher
  )
  const projects = useSelector(selectProjects)
  const bundles = useSelector(selectBundles)

  const {onToggle, isOpen} = useDisclosure()

  const keys = Object.keys(profileRequest)
  keys.sort()

  const project = projects.find((p) => p._id === projectId)
  const bundle = bundles.find((b) => b._id === bundleId)

  const scenarioName =
    profileRequest.variant > -1
      ? project.variants[profileRequest.variant] || 'Unknown'
      : 'Baseline'

  function downloadRequestJSON() {
    downloadJSON({
      data: requestJSON,
      filename: profileRequest.name + '.json'
    })
  }

  return (
    <Stack>
      <Box
        as='table'
        style={{
          tableLayout: 'fixed'
        }}
        width='100%'
      >
        <tbody>
          <tr>
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
          </tr>
          <tr>
            <TDTitle>
              <Tooltip
                aria-label={PROJECT_CHANGE_NOTE}
                hasArrow
                label={PROJECT_CHANGE_NOTE}
                placement='top-start'
                zIndex={1000}
              >
                <Box>
                  Project <Icon icon={faInfoCircle} />
                </Box>
              </Tooltip>
            </TDTitle>
            <TDValue>
              <ALink
                to='project'
                projectId={project._id}
                regionId={project.regionId}
              >
                {project.name}
              </ALink>
            </TDValue>
          </tr>
          <tr>
            <TDTitle>
              <Tooltip
                aria-label={SCENARIO_CHANGE_NOTE}
                hasArrow
                label={SCENARIO_CHANGE_NOTE}
                placement='top-start'
                zIndex={1000}
              >
                <Box>
                  Scenario <Icon icon={faInfoCircle} />
                </Box>
              </Tooltip>
            </TDTitle>
            <TDValue>{scenarioName}</TDValue>
          </tr>
          <tr>
            <TDTitle>Service Date</TDTitle>
            <TDValue>{profileRequest.date}</TDValue>
          </tr>
          <tr>
            <TDTitle>Service Time</TDTitle>
            <TDValue>
              {secondsToHhMmString(profileRequest.fromTime)}-
              {secondsToHhMmString(profileRequest.toTime)}
            </TDValue>
          </tr>
          <tr>
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
          </tr>
          <tr>
            <td colSpan={2}>
              <Box py={2} textAlign='center'>
                <Button
                  isDisabled={!requestJSON}
                  leftIcon='download'
                  onClick={downloadRequestJSON}
                  size='sm'
                >
                  Download Request JSON
                </Button>
              </Box>
            </td>
          </tr>
        </tbody>
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
            <tbody>
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
            </tbody>
          </Box>
        )}
      </Box>
    </Stack>
  )
}

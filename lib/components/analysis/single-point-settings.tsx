import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  List,
  ListItem,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Switch,
  FormHelperText,
  Skeleton,
  Text
} from '@chakra-ui/core'
import lonlat from '@conveyal/lonlat'
import {
  faChevronDown,
  faChevronRight,
  faChevronUp
} from '@fortawesome/free-solid-svg-icons'
import get from 'lodash/get'
import startCase from 'lodash/startCase'
import dynamic from 'next/dynamic'
import {useCallback, useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {setSearchParameter} from 'lib/actions'
import {
  cancelFetch,
  clearTravelTimeSurfaces,
  fetchGeoTIFF,
  fetchTravelTimeSurface,
  setDestination,
  setMaxTripDurationMinutes,
  setTravelTimePercentile
} from 'lib/actions/analysis'
import {
  clearComparisonSettings,
  copyPrimarySettings,
  updateRequestsSettings
} from 'lib/actions/analysis/profile-request'
import {createRegionalAnalysis} from 'lib/actions/analysis/regional'
import useInput from 'lib/hooks/use-controlled-input'
import message from 'lib/message'
import {activeOpportunityDataset} from 'lib/modules/opportunity-datasets/selectors'
import OpportunityDatasetSelector from 'lib/modules/opportunity-datasets/components/selector'
import selectAccessibility from 'lib/selectors/accessibility'
import selectCurrentBundle from 'lib/selectors/current-bundle'
import selectCurrentProject from 'lib/selectors/current-project'
import selectComparisonIsochrone from 'lib/selectors/comparison-isochrone'
import selectComparisonPercentileCurves from 'lib/selectors/comparison-percentile-curves'
import selectDTTD from 'lib/selectors/destination-travel-time-distribution'
import selectDTTDComparison from 'lib/selectors/comparison-destination-travel-time-distribution'
import selectIsochrone from 'lib/selectors/isochrone'
import selectMaxTripDurationMinutes from 'lib/selectors/max-trip-duration-minutes'
import selectPercentileCurves from 'lib/selectors/percentile-curves'
import selectProfileRequest from 'lib/selectors/profile-request'
import selectProfileRequestHasChanged from 'lib/selectors/profile-request-has-changed'
import selectProfileRequestLonLat from 'lib/selectors/profile-request-lonlat'
import getNearestPercentileIndex from 'lib/selectors/nearest-percentile-index'
import selectTravelTimePercentile from 'lib/selectors/travel-time-percentile'
import selectRegionBounds from 'lib/selectors/region-bounds'
import {fromLatLngBounds} from 'lib/utils/bounds'
import cleanProjectScenarioName from 'lib/utils/clean-project-scenario-name'
import {secondsToMoment} from 'lib/utils/time'

import ControlledSelect from '../controlled-select'
import Icon from '../icon'
import InnerDock from '../inner-dock'
import ModeIcon from '../mode-icon'

import AnalysisTitle from './title'
import BookmarkChooser from './bookmark-chooser'
import DownloadMenu from './download-menu'
import ProfileRequestEditor from './profile-request-editor'
import AdvancedSettings from './advanced-settings'
import ModeSelector from './mode-selector'
import SinglePointSettings from './single-point-settings'
import StackedPercentileSelector from './stacked-percentile-selector'
import {TRAVEL_TIME_PERCENTILES} from 'lib/constants'

export default function Settings({
  bundles,
  projects,
  region,
  regionalAnalyses
}) {
  const dispatch = useDispatch()
  const opportunityDataset = useSelector(activeOpportunityDataset)
  const percentileCurves = useSelector(selectPercentileCurves)
  const profileRequest = useSelector(selectProfileRequest)
  const currentBundle = useSelector(selectCurrentBundle)
  const currentProject = useSelector(selectCurrentProject)
  const variantIndex = useSelector((s) =>
    parseInt(get(s, 'queryString.variantIndex', -1))
  )

  const isochrone = useSelector(selectIsochrone)
  const isochroneFetchStatus = useSelector((s) =>
    get(s, 'analysis.isochroneFetchStatus')
  )

  const regionBounds = useSelector(selectRegionBounds)
  const requestsSettings = useSelector((s) =>
    get(s, 'analysis.requestsSettings')
  )

  const comparisonProjectId = useSelector((s) =>
    get(s, 'queryString.comparisonProjectId')
  )
  const comparisonVariant = useSelector((s) =>
    parseInt(get(s, 'queryString.comparisonVariantIndex', -1))
  )
  const comparisonProject = projects.find((p) => p._id === comparisonProjectId)
  const comparisonBundle = bundles.find(
    (b) => b._id === get(comparisonProject, 'bundleId')
  )
  const comparisonIsochrone = useSelector(selectComparisonIsochrone)
  const comparisonPercentileCurves = useSelector(
    selectComparisonPercentileCurves
  )

  const isFetchingIsochrone = !!isochroneFetchStatus
  const disableInputs = isFetchingIsochrone || !currentProject
  const scenarioOptions = [
    {label: message('analysis.baseline'), value: -1},
    ...get(currentProject, 'variants', []).map((v, index) => ({
      label: v,
      value: index
    }))
  ]
  const comparisonScenarioOptions = [
    // special value -1 indicates no modifications
    {label: message('analysis.baseline'), value: -1},
    ...get(comparisonProject, 'variants', []).map((label, value) => ({
      label,
      value
    }))
  ]

  // Simplify commonly used set function
  const setPrimaryPR = useCallback(
    (params) => {
      dispatch(updateRequestsSettings({index: 0, params}))
    },
    [dispatch]
  )
  const setComparisonPR = useCallback(
    (params) => {
      dispatch(updateRequestsSettings({index: 1, params}))
    },
    [dispatch]
  )

  // Set the analysis bounds to be the region bounds if bounds do not exist
  useEffect(() => {
    if (!profileRequest.bounds) {
      setPrimaryPR({bounds: fromLatLngBounds(regionBounds)})
    }
  }, [profileRequest, regionBounds, setPrimaryPR])

  // Current project is stored in the query string
  function _setCurrentProject(option) {
    dispatch(
      setSearchParameter({
        projectId: get(option, '_id'),
        variantIndex: -1
      })
    )
  }
  const _setCurrentVariant = (option) =>
    dispatch(setSearchParameter({variantIndex: parseInt(option.value)}))

  function _setComparisonProject(project) {
    if (project) {
      if (!currentProject) {
        setComparisonPR(profileRequest)
      }
      // since the comparison is clearable
      dispatch(
        setSearchParameter({
          comparisonProjectId: project._id,
          comparisonVariantIndex: -1
        })
      )
    } else {
      dispatch(
        setSearchParameter({
          comparisonProjectId: null,
          comparisonVariantIndex: null
        })
      )
    }
  }

  const _setComparisonVariant = (e) =>
    dispatch(setSearchParameter({comparisonVariantIndex: parseInt(e.value)}))

  return (
    <>
      <RequestSettings
        bundle={currentBundle}
        isDisabled={disableInputs}
        isFetchingIsochrone={isFetchingIsochrone}
        isochrone={isochrone}
        opportunityDataset={opportunityDataset}
        percentileCurves={percentileCurves}
        profileRequest={requestsSettings[0]}
        project={currentProject}
        projects={projects}
        regionBounds={region.bounds}
        regionalAnalyses={regionalAnalyses}
        scenario={variantIndex}
        scenarioOptions={scenarioOptions}
        setProfileRequest={setPrimaryPR}
        setProject={_setCurrentProject}
        setScenario={_setCurrentVariant}
      />

      <RequestSettings
        borderBottom='1px solid #E2E8F0'
        bundle={comparisonBundle}
        color='red'
        isComparison
        isDisabled={disableInputs}
        isFetchingIsochrone={isFetchingIsochrone}
        isochrone={comparisonIsochrone}
        opportunityDataset={opportunityDataset}
        percentileCurves={comparisonPercentileCurves}
        profileRequest={requestsSettings[1]}
        project={comparisonProject}
        projects={projects}
        regionBounds={region.bounds}
        regionalAnalyses={regionalAnalyses}
        scenario={comparisonVariant}
        scenarioOptions={comparisonScenarioOptions}
        setProfileRequest={setComparisonPR}
        setProject={_setComparisonProject}
        setScenario={_setComparisonVariant}
      />
    </>
  )
}

function RequestSummary({profileRequest, ...p}) {
  // Transit modes is stored as a string
  const transitModes = profileRequest.transitModes.split(',')

  return (
    <Flex flex='2' justify='space-evenly' {...p}>
      <Stack align='center' isInline spacing='1'>
        <ModeIcon mode={profileRequest.accessModes} />
        {profileRequest.transitModes.length > 0 && (
          <Stack align='center' isInline spacing='1'>
            <Box fontSize='xs'>
              <Icon icon={faChevronRight} />
            </Box>
            {transitModes.slice(0, 2).map((m) => (
              <ModeIcon mode={m} key={m} />
            ))}
            {transitModes.length > 2 && (
              <Box title={transitModes.map(startCase).join(', ')}>...</Box>
            )}
            {profileRequest.egressModes !== 'WALK' && (
              <Stack align='center' isInline spacing='1'>
                <Box fontSize='xs'>
                  <Icon icon={faChevronRight} />
                </Box>
                <ModeIcon mode={profileRequest.egressModes} />
              </Stack>
            )}
          </Stack>
        )}
      </Stack>

      <Stack fontWeight='500' isInline spacing='2'>
        <Text>{profileRequest.date}</Text>
        <Text>
          {secondsToMoment(profileRequest.fromTime).format('H:mm')}-
          {secondsToMoment(profileRequest.toTime).format('H:mm')}
        </Text>
      </Stack>
    </Flex>
  )
}

function RequestSettings({
  bundle,
  color = 'blue',
  isComparison = false,
  isDisabled,
  isFetchingIsochrone,
  isochrone,
  opportunityDataset,
  percentileCurves,
  profileRequest,
  project,
  projects,
  regionalAnalyses,
  regionBounds,
  scenario,
  scenarioOptions,
  setProfileRequest,
  setProject,
  setScenario,
  ...p
}) {
  const [isOpen, setIsOpen] = useState(!project)
  const dispatch = useDispatch()

  function onCreateRegionalAnalysis(e) {
    e.stopPropagation()

    if (project) {
      const name = window.prompt(
        'Enter a name and click ok to begin a regional analysis job for this project and settings:',
        `Analysis ${regionalAnalyses.length + 1}: ${project.name} ` +
          `${project.variants[profileRequest.variantIndex] || ''}`
      )
      if (name && name.length > 0) {
        dispatch(createRegionalAnalysis({name, profileRequest}))
      }
    }
  }

  const scenarioName =
    get(project, 'variants', [])[scenario] || message('variant.baseline')
  const projectDownloadName = cleanProjectScenarioName(project, scenario)

  return (
    <Stack spacing={0} {...p}>
      <Flex
        align='center'
        borderTop='1px solid #E2E8F0'
        px={6}
        pt={10}
        pb={2}
        justify='space-between'
        textAlign='left'
      >
        {project ? (
          <>
            <Stack flex='1' overflow='hidden'>
              <Heading
                size='md'
                color={`${color}.500`}
                overflow='hidden'
                style={{
                  textOverflow: 'ellipsis'
                }}
                title={project.name}
                whiteSpace='nowrap'
              >
                {project.name}
              </Heading>
              <Heading
                size='sm'
                color='gray.500'
                overflow='hidden'
                style={{
                  textOverflow: 'ellipsis'
                }}
                title={scenarioName}
                whiteSpace='nowrap'
              >
                {scenarioName}
              </Heading>
            </Stack>

            {isComparison ? (
              profileRequest && (
                <RequestSummary profileRequest={profileRequest} flex='2' />
              )
            ) : (
              <RequestSummary profileRequest={profileRequest} flex='2' />
            )}
          </>
        ) : (
          <Heading size='md' color={`${color}.500`}>
            Select a comparison project
          </Heading>
        )}

        <Stack spacing={1} isInline>
          <DownloadMenu
            isDisabled={!isochrone}
            isochrone={isochrone}
            key={color}
            opportunityDataset={opportunityDataset}
            percentileCurves={percentileCurves}
            projectId={get(project, '_id')}
            projectName={projectDownloadName}
            requestsSettings={profileRequest}
            variantIndex={scenario}
          />
          <Button
            isDisabled={!isochrone}
            onClick={onCreateRegionalAnalysis}
            rightIcon='small-add'
            variantColor='green'
          >
            Multi-point
          </Button>
        </Stack>
      </Flex>

      <Button
        borderRadius='0'
        _focus={{
          outline: 'none'
        }}
        onClick={() => setIsOpen((isOpen) => !isOpen)}
        size='sm'
        title={isOpen ? 'collapse' : 'expand'}
        variant='ghost'
        variantColor={color}
        width='100%'
      >
        <Icon icon={isOpen ? faChevronUp : faChevronDown} />
      </Button>
      {isOpen && (
        <Stack spacing={6} p={6}>
          <Stack isInline spacing={6}>
            <ControlledSelect
              flex='1'
              getOptionLabel={(o) => o.name}
              getOptionValue={(o) => o._id}
              isClearable={isComparison}
              isDisabled={projects.length === 0 || isFetchingIsochrone}
              label={message('common.project')}
              onChange={setProject}
              options={projects}
              value={project}
            />

            <ControlledSelect
              flex='1'
              isDisabled={!project || isDisabled}
              key={get(project, '_id')}
              label={message('common.scenario')}
              onChange={setScenario}
              options={scenarioOptions}
              value={scenarioOptions.find((v) => v.value === scenario)}
            />

            <BookmarkChooser
              disabled={isDisabled}
              flex='1'
              onChange={(bookmarkSettings) =>
                setProfileRequest({...bookmarkSettings})
              }
            />
          </Stack>

          {isComparison && (
            <FormControl isDisabled={!project} textAlign='center' width='100%'>
              <FormLabel htmlFor='copySettings'>
                Identical request settings
              </FormLabel>
              <Switch
                id='copySettings'
                isChecked={!profileRequest}
                isDisabled={!project}
                onChange={(e) => {
                  get(e, 'target.checked')
                    ? dispatch(clearComparisonSettings())
                    : dispatch(copyPrimarySettings())
                }}
              />
            </FormControl>
          )}

          {project && profileRequest && (
            <Stack spacing={6}>
              <ModeSelector
                accessModes={profileRequest.accessModes}
                directModes={profileRequest.directModes}
                disabled={isDisabled}
                egressModes={profileRequest.egressModes}
                transitModes={profileRequest.transitModes}
                update={setProfileRequest}
              />

              <ProfileRequestEditor
                bundle={bundle}
                disabled={isDisabled}
                profileRequest={profileRequest}
                project={project}
                setProfileRequest={setProfileRequest}
              />

              <Divider />

              <AdvancedSettings
                disabled={isDisabled}
                profileRequest={profileRequest}
                regionalAnalyses={regionalAnalyses}
                regionBounds={regionBounds}
                setProfileRequest={setProfileRequest}
              />
            </Stack>
          )}
        </Stack>
      )}
    </Stack>
  )
}

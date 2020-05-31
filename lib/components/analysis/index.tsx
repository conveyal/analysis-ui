import {
  Alert,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
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
  faDownload,
  faExclamationCircle,
  faChevronUp
} from '@fortawesome/free-solid-svg-icons'
import get from 'lodash/get'
import snakeCase from 'lodash/snakeCase'
import startCase from 'lodash/startCase'
import dynamic from 'next/dynamic'
import Router from 'next/router'
import {useCallback, useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {
  cancelFetch,
  clearComparisonProject,
  clearTravelTimeSurfaces,
  fetchTravelTimeSurface,
  setComparisonProject,
  setDestination
} from 'lib/actions/analysis'
import {setProfileRequest} from 'lib/actions/analysis/profile-request'
import {createRegionalAnalysis} from 'lib/actions/analysis/regional'
import message from 'lib/message'
import {activeOpportunityDataset} from 'lib/modules/opportunity-datasets/selectors'
import OpportunityDatasetSelector from 'lib/modules/opportunity-datasets/components/selector'
import {routeTo} from 'lib/router'
import selectAccessibility from 'lib/selectors/accessibility'
import selectAnalysisBounds from 'lib/selectors/analysis-bounds'
import selectCurrentBundle from 'lib/selectors/current-bundle'
import selectCurrentProject from 'lib/selectors/current-project'
import selectDTTD from 'lib/selectors/destination-travel-time-distribution'
import selectDTTDComparison from 'lib/selectors/comparison-destination-travel-time-distribution'
import selectIsochrone from 'lib/selectors/isochrone'
import selectMaxTripDurationMinutes from 'lib/selectors/max-trip-duration-minutes'
import selectPercentileCurves from 'lib/selectors/percentile-curves'
import selectProfileRequest from 'lib/selectors/profile-request'
import selectProfileRequestHasChanged from 'lib/selectors/profile-request-has-changed'
import selectProfileRequestLonLat from 'lib/selectors/profile-request-lonlat'
import selectNearestPercentile from 'lib/selectors/nearest-percentile'
import selectTravelTimePercentile from 'lib/selectors/travel-time-percentile'
import cleanProjectScenarioName from 'lib/utils/clean-project-scenario-name'
import downloadCSV from 'lib/utils/download-csv'
import downloadGeoTIFF from 'lib/utils/download-geotiff'
import downloadJson from 'lib/utils/download-json'
import {secondsToMoment} from 'lib/utils/time'

import Select from '../select'
import Collapsible from '../collapsible'
import Icon from '../icon'
import InnerDock from '../inner-dock'
import ModeIcon from '../mode-icon'

import AnalysisTitle from './title'
import BookmarkChooser from './bookmark-chooser'
import ScenarioApplicationError from './scenario-application-error'
import ProfileRequestEditor from './profile-request-editor'
import AdvancedSettings from './advanced-settings'
import ModeSelector from './mode-selector'
import StackedPercentileSelector from './stacked-percentile-selector'

/**
 * Hide the loading text from map components because it is awkward.
 */
const noSSR = {
  loading: () => null,
  ssr: false
}

const DotMap = dynamic(
  () => import('lib/modules/opportunity-datasets/components/dotmap'),
  noSSR
)
const DTTD = dynamic(
  () => import('../map/destination-travel-time-distribution'),
  noSSR
)
const Isochrones = dynamic(() => import('../map/isochrones'), noSSR)
const Rectangle = dynamic(() => import('../map/rectangle'), noSSR)
const ModificationsMap = dynamic(
  () => import('../modifications-map/display-all'),
  noSSR
)
const AnalysisMap = dynamic(() => import('./map'), noSSR)

export default function SinglePointAnalysis({
  bundles,
  projects,
  region,
  regionalAnalyses
}) {
  const dispatch = useDispatch()
  const analysisBounds = useSelector(selectAnalysisBounds)
  const currentBundle = useSelector(selectCurrentBundle)
  const currentProject = useSelector(selectCurrentProject)
  const cutoff = useSelector(selectMaxTripDurationMinutes)
  const comparisonProjectId = useSelector((s) =>
    get(s, 'analysis.comparisonProjectId')
  )
  const comparisonVariant = useSelector((s) =>
    get(s, 'analysis.comparisonVariant')
  )
  const destination = useSelector((s) => get(s, 'analysis.destination'))
  const dttdComparison = useSelector(selectDTTDComparison)
  const dttd = useSelector(selectDTTD)
  const isochrone = useSelector(selectIsochrone)
  const isochroneFetchStatus = useSelector((s) =>
    get(s, 'analysis.isochroneFetchStatus')
  )
  const opportunityDataset = useSelector(activeOpportunityDataset)
  const percentileCurves = useSelector(selectPercentileCurves)
  const profileRequest = useSelector(selectProfileRequest)
  const profileRequestHasChanged = useSelector(selectProfileRequestHasChanged)
  const profileRequestLonLat = useSelector(selectProfileRequestLonLat)
  const scenarioErrors = useSelector((s) =>
    get(s, 'analysis.scenarioApplicationErrors')
  )
  const scenarioWarnings = useSelector((s) =>
    get(s, 'analysis.scenarioApplicationWarnings')
  )

  const comparisonProject = projects.find((p) => p._id === comparisonProjectId)
  const {fromLat, fromLon} = profileRequest
  const readyToFetch = !!currentProject
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
  const displayedDataIsCurrent =
    !profileRequestHasChanged && !isFetchingIsochrone

  // Simplify commonly used set function
  const setPR = useCallback(
    (props) => {
      dispatch(setProfileRequest(props))
    },
    [dispatch]
  )

  // Update marker if not in sync
  useEffect(() => {
    if (fromLat == null || fromLon == null) {
      setPR({
        fromLat: profileRequestLonLat.lat,
        fromLon: profileRequestLonLat.lon
      })
    }
  }, [profileRequestLonLat, fromLat, fromLon, setPR])

  // On unmount
  useEffect(
    () => () => {
      dispatch(cancelFetch())
      dispatch(clearTravelTimeSurfaces())
    },
    [dispatch]
  )

  // Current project is stored in the query string
  function _setCurrentProject(option) {
    const {as, query, href} = routeTo('analysis', {
      ...Router.query,
      projectId: get(option, '_id')
    })
    const qs = Object.keys(query)
      .map((k) => `${k}=${query[k]}`)
      .join('&')
    Router.push(`${href}?${qs}`, as)
  }
  const _setCurrentVariant = (option) =>
    setPR({variantIndex: parseInt(option.value)})

  function _setComparisonProject(project) {
    if (project) {
      // since the comparison is clearable
      dispatch(
        setComparisonProject({
          _id: project._id,
          variantIndex: -1
        })
      )
    } else {
      dispatch(clearComparisonProject())
    }
  }

  const _setComparisonVariant = (e) => {
    if (e) {
      dispatch(
        setComparisonProject({
          _id: comparisonProject._id,
          variantIndex: e.value
        })
      )
    }
  }

  /**
   * Set the origin and fetch if ready.
   */
  function _setOrigin(ll) {
    setPR({fromLat: ll.lat, fromLon: ll.lon})
    if (readyToFetch) dispatch(fetchTravelTimeSurface())
  }

  return (
    <>
      <DotMap />

      <Rectangle
        bounds={analysisBounds}
        dashArray='3 8'
        fillOpacity={0}
        pointerEvents='none'
        weight={1}
      />

      <ModificationsMap isEditing />

      <Isochrones isCurrent={displayedDataIsCurrent} />

      <AnalysisMap
        destination={destination}
        displayedDataIsCurrent={displayedDataIsCurrent}
        disableMarker={disableInputs}
        markerPosition={profileRequestLonLat}
        markerTooltip={
          !currentProject ? message('analysis.disableFetch') : undefined
        }
        setDestination={(d) => dispatch(setDestination(d))}
        setOrigin={_setOrigin}
      />

      {displayedDataIsCurrent && destination && (
        <DTTD
          key={lonlat.toString(destination)}
          comparisonDistribution={dttdComparison}
          destination={destination}
          distribution={dttd}
          remove={() => dispatch(setDestination())}
          setDestination={(d) => dispatch(setDestination(d))}
        />
      )}

      <AnalysisTitle isDisabled={isochrone && !profileRequestHasChanged} />

      <InnerDock style={{width: '640px'}}>
        <Results
          isDisabled={disableInputs}
          isStale={profileRequestHasChanged}
          region={region}
        />

        <RequestSettings
          analysisBounds={analysisBounds}
          bundle={currentBundle}
          cutoff={cutoff}
          isDisabled={disableInputs}
          isFetchingIsochrone={isFetchingIsochrone}
          isochrone={isochrone}
          opportunityDataset={opportunityDataset}
          percentileCurves={percentileCurves}
          profileRequest={profileRequest}
          project={currentProject}
          projects={projects}
          regionBounds={region.bounds}
          regionalAnalyses={regionalAnalyses}
          scenario={profileRequest.variantIndex}
          scenarioOptions={scenarioOptions}
          scenarioErrors={scenarioErrors}
          scenarioWarnings={scenarioWarnings}
          setProfileRequest={setPR}
          setProject={_setCurrentProject}
          setScenario={_setCurrentVariant}
        />

        <RequestSettings
          analysisBounds={analysisBounds}
          borderBottom='1px solid #E2E8F0'
          bundle={currentBundle}
          color='red'
          cutoff={cutoff}
          isComparison
          isDisabled={disableInputs}
          isFetchingIsochrone={isFetchingIsochrone}
          isochrone={isochrone}
          opportunityDataset={opportunityDataset}
          percentileCurves={percentileCurves}
          profileRequest={profileRequest}
          project={comparisonProject}
          projects={projects}
          regionBounds={region.bounds}
          regionalAnalyses={regionalAnalyses}
          scenario={comparisonVariant}
          scenarioOptions={comparisonScenarioOptions}
          scenarioErrors={scenarioErrors}
          scenarioWarnings={scenarioWarnings}
          setProfileRequest={setPR}
          setProject={_setComparisonProject}
          setScenario={_setComparisonVariant}
        />
      </InnerDock>
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
  analysisBounds,
  bundle,
  color = 'blue',
  cutoff,
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
  scenarioErrors,
  scenarioWarnings,
  setProfileRequest,
  setProject,
  setScenario,
  ...p
}) {
  const [isOpen, setIsOpen] = useState(!project)
  const dispatch = useDispatch()
  const [copySettings, setCopySettings] = useState(true)

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
                textOverflow='ellipsis'
                title={project.name}
                whiteSpace='nowrap'
              >
                {project.name}
              </Heading>
              <Heading
                size='sm'
                color='gray.500'
                overflow='hidden'
                textOverflow='ellipsis'
                title={scenarioName}
                whiteSpace='nowrap'
              >
                {scenarioName}
              </Heading>
            </Stack>

            {isComparison ? (
              copySettings ? null : (
                <RequestSummary profileRequest={profileRequest} flex='2' />
              )
            ) : (
              <RequestSummary profileRequest={profileRequest} flex='2' />
            )}
          </>
        ) : (
          <Heading size='md' color={`${color}.500`}>
            Select a project
          </Heading>
        )}

        <Stack spacing={1} isInline>
          <DownloadMenu
            cutoff={cutoff}
            isDisabled={!isochrone}
            isochrone={isochrone}
            key={color}
            opportunityDataset={opportunityDataset}
            percentileCurves={percentileCurves}
            projectName={projectDownloadName}
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
          {scenarioWarnings != null && scenarioWarnings.length > 0 && (
            <Alert status='warning'>
              <Collapsible
                title={
                  <span className='text-warning'>
                    <Icon icon={faExclamationCircle} />
                    &nbsp;
                    {message('analysis.warningsInProject')}
                  </span>
                }
              >
                <ScenarioApplicationErrors errors={scenarioWarnings} />
              </Collapsible>
            </Alert>
          )}

          {scenarioErrors != null && scenarioErrors.length > 0 && (
            <Alert status='error'>
              <strong>
                <Icon icon={faExclamationCircle} />{' '}
                {message('analysis.errorsInProject')}
              </strong>
              <br />
              <ScenarioApplicationErrors errors={scenarioErrors} />
            </Alert>
          )}

          <Stack isInline spacing={6}>
            <FormControl
              flex='1'
              isDisabled={projects.length === 0 || isFetchingIsochrone}
            >
              <FormLabel htmlFor='select-project'>
                {message('common.project')}
              </FormLabel>
              <Select
                name='select-project'
                inputId='select-project'
                isClearable
                isDisabled={projects.length === 0 || isFetchingIsochrone}
                getOptionLabel={(p) => p.name}
                getOptionValue={(p) => p._id}
                options={projects}
                value={project}
                onChange={setProject}
              />
            </FormControl>

            <FormControl flex='1' isDisabled={isDisabled}>
              <FormLabel htmlFor='select-scenario'>
                {message('common.scenario')}
              </FormLabel>
              <Select
                name='select-scenario'
                inputId='select-scenario'
                isDisabled={isDisabled}
                options={scenarioOptions}
                value={scenarioOptions.find((v) => v.value === scenario)}
                onChange={setScenario}
              />
            </FormControl>

            <BookmarkChooser disabled={isDisabled} flex='1' />
          </Stack>

          {isComparison && (
            <Flex align='center' justify='center'>
              <FormLabel htmlFor='copySettings'>
                Copy request settings
              </FormLabel>
              <Switch
                id='copySettings'
                isChecked={copySettings}
                onChange={() => setCopySettings((c) => !c)}
              />
            </Flex>
          )}

          {project && (!isComparison || !copySettings) && (
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
                analysisBounds={analysisBounds}
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

function DownloadMenu({
  cutoff,
  isDisabled,
  isochrone,
  opportunityDataset,
  percentileCurves,
  projectName,
  ...p
}) {
  const dispatch = useDispatch()

  function downloadIsochrone() {
    downloadJson({
      data: {
        ...isochrone,
        properties: {} // TODO set this in jsolines
      },
      filename:
        snakeCase(`conveyal isochrone ${projectName} at ${cutoff} minutes`) +
        '.json'
    })
  }

  function downloadOpportunitiesCSV() {
    const header =
      Array(120)
        .fill(0)
        .map((_, i) => i + 1)
        .join(',') + '\n'
    const csvContent = percentileCurves.map((row) => row.join(',')).join('\n')
    const name = snakeCase(
      `Conveyal ${projectName} percentile access to ${get(
        opportunityDataset,
        'name'
      )}`
    )
    downloadCSV(header + csvContent, name)
  }

  // TODO don't dispatch an action, just fetch and show the button in a loading state
  function fetchGeoTIFF() {
    return dispatch(fetchTravelTimeSurface(true))
      .then((r) => r.arrayBuffer())
      .then((data) => {
        downloadGeoTIFF({
          data,
          filename: snakeCase(`conveyal geotiff ${projectName}`) + '.geotiff'
        })
      })
  }

  return (
    <Menu>
      <MenuButton as={Button} isDisabled={isDisabled} {...p}>
        <Icon icon={faDownload} />
      </MenuButton>
      <MenuList>
        <MenuItem onClick={downloadIsochrone}>Isochrone as GeoJSON</MenuItem>
        <MenuItem onClick={fetchGeoTIFF}>Isochrone as GeoTIFF</MenuItem>
        <MenuItem
          isDisabled={!percentileCurves}
          onClick={downloadOpportunitiesCSV}
          title={percentileCurves ? '' : 'Opportunity dataset must be selected'}
        >
          Access to opportunities as CSV
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

function Results({
  isDisabled,
  isStale, // are the results out of sync with the form?
  region
}) {
  const dispatch = useDispatch()
  const accessibility = useSelector(selectAccessibility)
  const travelTimePercentile = useSelector(selectTravelTimePercentile)
  const nearestPercentile = useSelector(selectNearestPercentile)
  const isochroneCutoff = useSelector(selectMaxTripDurationMinutes)
  const isDisabledOrStale = isDisabled || isStale
  return (
    <Stack spacing={6} p={6}>
      <Skeleton minHeight='20px' isLoaded={accessibility != null} speed={1000}>
        <StackedPercentileSelector disabled={isDisabled} stale={isStale} />
      </Skeleton>

      <Stack align='center' isInline spacing={6}>
        <Box fontWeight='500' whiteSpace='nowrap'>
          Time cutoff
        </Box>
        <Slider
          isDisabled={isDisabledOrStale}
          value={isochroneCutoff}
          min={1}
          max={120}
          onChange={(v) =>
            dispatch(setProfileRequest({maxTripDurationMinutes: v}))
          }
        >
          <SliderTrack />
          <SliderFilledTrack />
          <SliderThumb size='8'>
            <Box fontSize='sm' fontWeight='bold'>
              {isochroneCutoff}
            </Box>
          </SliderThumb>
        </Slider>
        <Box fontWeight='500'>minute(s)</Box>
      </Stack>

      <Stack isInline spacing={6}>
        <FormControl flex='1' isDisabled={isDisabled}>
          <FormLabel htmlFor='select-opportunity-dataset'>
            {message('analysis.grid')}
          </FormLabel>
          <OpportunityDatasetSelector
            isDisabled={isDisabled}
            regionId={region._id}
          />
        </FormControl>

        <FormControl flex='1' isDisabled={isDisabled}>
          <FormLabel>Travel time percentile</FormLabel>
          <Slider
            isDisabled={isDisabledOrStale}
            value={travelTimePercentile || 50}
            min={1}
            max={99}
            step={1}
            onChange={(v) =>
              dispatch(setProfileRequest({travelTimePercentile: v}))
            }
          >
            <SliderTrack />
            <SliderFilledTrack />
            <SliderThumb size='6'>
              <Box fontSize='sm' fontWeight='bold'>
                {travelTimePercentile || 50}
              </Box>
            </SliderThumb>
          </Slider>
          <FormHelperText>
            {nearestPercentile} single-point, {travelTimePercentile} multi-point
          </FormHelperText>
        </FormControl>
      </Stack>
    </Stack>
  )
}

function ScenarioApplicationErrors({errors}) {
  /** Render any errors that may have occurred applying the project */
  return (
    <div>
      {errors.map((err, idx) => (
        <ScenarioApplicationError error={err} key={`err-${idx}`} />
      ))}
    </div>
  )
}

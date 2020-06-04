import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Stack,
  Switch,
  Text,
  Tooltip
} from '@chakra-ui/core'
import {
  faChevronDown,
  faChevronRight,
  faChevronUp
} from '@fortawesome/free-solid-svg-icons'
import get from 'lodash/get'
import {useCallback, useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {setSearchParameter} from 'lib/actions'
import {
  clearComparisonSettings,
  copyPrimarySettings,
  updateRequestsSettings
} from 'lib/actions/analysis/profile-request'
import {createRegionalAnalysis} from 'lib/actions/analysis/regional'
import message from 'lib/message'
import {activeOpportunityDataset} from 'lib/modules/opportunity-datasets/selectors'
import selectCurrentBundle from 'lib/selectors/current-bundle'
import selectCurrentProject from 'lib/selectors/current-project'
import selectProfileRequest from 'lib/selectors/profile-request'
import selectProfileRequestHasChanged from 'lib/selectors/profile-request-has-changed'
import selectRegionBounds from 'lib/selectors/region-bounds'
import {fromLatLngBounds} from 'lib/utils/bounds'
import cleanProjectScenarioName from 'lib/utils/clean-project-scenario-name'
import {secondsToMoment} from 'lib/utils/time'

import ControlledSelect from '../controlled-select'
import Icon from '../icon'
import ModeIcon from '../mode-icon'

import BookmarkChooser from './bookmark-chooser'
import DownloadMenu from './download-menu'
import ProfileRequestEditor from './profile-request-editor'
import AdvancedSettings from './advanced-settings'
import ModeSelector from './mode-selector'

export default function Settings({
  bundles,
  projects,
  region,
  regionalAnalyses
}) {
  const dispatch = useDispatch()
  const opportunityDataset = useSelector(activeOpportunityDataset)
  const profileRequest = useSelector(selectProfileRequest)
  const currentBundle = useSelector(selectCurrentBundle)
  const currentProject = useSelector(selectCurrentProject)
  const variantIndex = useSelector((s) =>
    parseInt(get(s, 'queryString.variantIndex', -1))
  )
  const resultsSettings = useSelector((s) =>
    get(s, 'analysis.resultsSettings', [])
  )

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
      <RequestHeading
        hasResults={resultsSettings.length > 0}
        opportunityDataset={opportunityDataset}
        profileRequest={requestsSettings[0]}
        project={currentProject}
        regionalAnalyses={regionalAnalyses}
        scenario={variantIndex}
      />
      <RequestSettings
        bundle={currentBundle}
        isDisabled={disableInputs}
        isFetchingIsochrone={isFetchingIsochrone}
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

      <RequestHeading
        color='red'
        isComparison
        hasResults={resultsSettings.length > 1}
        opportunityDataset={opportunityDataset}
        profileRequest={requestsSettings[1]}
        project={comparisonProject}
        regionalAnalyses={regionalAnalyses}
        scenario={comparisonVariant}
      />
      <RequestSettings
        borderBottom='1px solid #E2E8F0'
        bundle={comparisonBundle}
        color='red'
        isComparison
        isDisabled={disableInputs}
        isFetchingIsochrone={isFetchingIsochrone}
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
          <Tooltip
            hasArrow
            aria-label={transitModes.join(', ')}
            label={transitModes.join(', ')}
          >
            <Stack align='center' isInline spacing='1'>
              <Box fontSize='xs'>
                <Icon icon={faChevronRight} />
              </Box>
              {transitModes.slice(0, 2).map((m) => (
                <ModeIcon mode={m} key={m} />
              ))}
              {transitModes.length > 2 && <Box>...</Box>}
              {profileRequest.egressModes !== 'WALK' && (
                <Stack align='center' isInline spacing='1'>
                  <Box fontSize='xs'>
                    <Icon icon={faChevronRight} />
                  </Box>
                  <ModeIcon mode={profileRequest.egressModes} />
                </Stack>
              )}
            </Stack>
          </Tooltip>
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

function RequestHeading({
  color = 'blue',
  hasResults,
  isComparison = false,
  opportunityDataset,
  profileRequest,
  project,
  regionalAnalyses,
  scenario,
  ...p
}) {
  const dispatch = useDispatch()
  const settingsHaveChanged = useSelector(selectProfileRequestHasChanged)
  const scenarioName =
    get(project, 'variants', [])[scenario] || message('variant.baseline')

  function onCreateRegionalAnalysis(e) {
    e.stopPropagation()

    if (project) {
      const name = window.prompt(
        'Enter a name and click ok to begin a regional analysis job for this project and settings:',
        `Analysis ${regionalAnalyses.length + 1}: ${
          project.name
        } ${scenarioName}`
      )
      if (name && name.length > 0) {
        dispatch(
          createRegionalAnalysis({
            ...profileRequest,
            name,
            opportunityDatasetId: opportunityDataset._id,
            projectId: project._id,
            variantIndex: scenario
          })
        )
      }
    }
  }

  const projectDownloadName = cleanProjectScenarioName(project, scenario)

  return (
    <Flex
      align='center'
      borderTop='1px solid #E2E8F0'
      px={6}
      pt={10}
      pb={2}
      justify='space-between'
      textAlign='left'
      {...p}
    >
      {project ? (
        <>
          <Stack flex='1' overflow='hidden'>
            <Heading size='md' color={`${color}.500`} overflow='hidden'>
              {project.name}
            </Heading>
            <Heading size='sm' color='gray.500' overflow='hidden'>
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
          Select a {isComparison ? 'comparison ' : ''}project
        </Heading>
      )}

      <Stack spacing={1} isInline>
        <DownloadMenu
          isComparison={isComparison}
          isDisabled={!hasResults || settingsHaveChanged}
          key={color}
          opportunityDataset={opportunityDataset}
          projectId={get(project, '_id')}
          projectName={projectDownloadName}
          requestsSettings={profileRequest}
          variantIndex={scenario}
        />
        <Button
          isDisabled={!hasResults || settingsHaveChanged || !opportunityDataset}
          onClick={onCreateRegionalAnalysis}
          rightIcon='small-add'
          variantColor='green'
        >
          Multi-point
        </Button>
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

  return (
    <Stack spacing={0} {...p}>
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

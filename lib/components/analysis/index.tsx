import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  List,
  ListItem,
  Stack,
  Skeleton
} from '@chakra-ui/core'
import lonlat from '@conveyal/lonlat'
import get from 'lodash/get'
import dynamic from 'next/dynamic'
import {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {setSearchParameter} from 'lib/actions'
import {
  cancelFetch,
  clearResults,
  fetchTravelTimeSurface,
  setDestination
} from 'lib/actions/analysis'
import message from 'lib/message'
import OpportunityDatasetSelector from 'lib/modules/opportunity-datasets/components/selector'
import selectCurrentProject from 'lib/selectors/current-project'
import selectDTTD from 'lib/selectors/destination-travel-time-distribution'
import selectDTTDComparison from 'lib/selectors/comparison-destination-travel-time-distribution'
import selectProfileRequestHasChanged from 'lib/selectors/profile-request-has-changed'
import selectProfileRequestLonLat from 'lib/selectors/profile-request-lonlat'
import selectRegionBounds from 'lib/selectors/region-bounds'

import InnerDock from '../inner-dock'

import AnalysisTitle from './title'
import {CutoffSlider, PercentileSlider} from './results-sliders'
import SinglePointSettings from './single-point-settings'
import StackedPercentileSelector from './stacked-percentile-selector'
import {activeOpportunityDataset} from 'lib/modules/opportunity-datasets/selectors'

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
  const currentProject = useSelector(selectCurrentProject)
  const destination = useSelector((s) => get(s, 'analysis.destination'))
  const dttdComparison = useSelector(selectDTTDComparison)
  const dttd = useSelector(selectDTTD)
  const isochroneFetchStatus = useSelector((s) =>
    get(s, 'analysis.isochroneFetchStatus')
  )

  const profileRequestHasChanged = useSelector(selectProfileRequestHasChanged)
  const profileRequestLonLat = useSelector(selectProfileRequestLonLat)
  const regionBounds = useSelector(selectRegionBounds)
  const requestsSettings = useSelector((s) =>
    get(s, 'analysis.requestsSettings')
  )
  const scenarioErrors = useSelector((s) =>
    get(s, 'analysis.scenarioApplicationErrors')
  )
  const scenarioWarnings = useSelector((s) =>
    get(s, 'analysis.scenarioApplicationWarnings')
  )
  const analysisBounds = get(requestsSettings, '[0].bounds', regionBounds)
  const readyToFetch = !!currentProject
  const isFetchingIsochrone = !!isochroneFetchStatus
  const disableInputs = isFetchingIsochrone || !currentProject

  const displayedDataIsCurrent =
    !profileRequestHasChanged && !isFetchingIsochrone

  // On moount / unmount
  useEffect(() => {
    dispatch(clearResults())
    return () => {
      dispatch(cancelFetch())
      dispatch(clearResults())
    }
  }, [dispatch])

  /**
   * Set the origin and fetch if ready.
   */
  function _setOrigin(ll) {
    dispatch(setSearchParameter({lonlat: lonlat.toString(ll)}))
    if (readyToFetch) dispatch(fetchTravelTimeSurface(requestsSettings))
  }

  return (
    <>
      <DotMap />

      {analysisBounds && (
        <Rectangle
          bounds={analysisBounds}
          dashArray='3 8'
          fillOpacity={0}
          pointerEvents='none'
          weight={1}
        />
      )}

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

      <AnalysisTitle />

      <InnerDock style={{width: '640px'}}>
        {scenarioWarnings != null && scenarioWarnings.length > 0 && (
          <Alert
            alignItems='flex-start'
            flexDirection='column'
            px={6}
            py={8}
            status='warning'
          >
            <Flex mb={6}>
              <AlertIcon />
              <AlertTitle>{message('analysis.warningsInProject')}</AlertTitle>
            </Flex>
            <AlertDescription>
              <ScenarioApplicationErrors errors={scenarioWarnings} />
            </AlertDescription>
          </Alert>
        )}

        {scenarioErrors != null && scenarioErrors.length > 0 && (
          <Alert
            alignItems='flex-start'
            flexDirection='column'
            px={6}
            py={8}
            status='error'
          >
            <Flex mb={6}>
              <AlertIcon />
              <AlertTitle>{message('analysis.errorsInProject')}</AlertTitle>
            </Flex>
            <AlertDescription pl={8}>
              <ScenarioApplicationErrors errors={scenarioErrors} />
            </AlertDescription>
          </Alert>
        )}

        <Results
          isDisabled={disableInputs}
          isStale={profileRequestHasChanged}
          region={region}
        />

        <SinglePointSettings
          bundles={bundles}
          projects={projects}
          region={region}
          regionalAnalyses={regionalAnalyses}
        />
      </InnerDock>
    </>
  )
}

function Results({
  isDisabled,
  isStale, // are the results out of sync with the form?
  region
}) {
  const resultsSettings = useSelector((s) =>
    get(s, 'analysis.resultsSettings', [])
  )
  const opportunityDataset = useSelector(activeOpportunityDataset)
  const isDisabledOrStale = isDisabled || isStale
  return (
    <Stack spacing={6} p={6}>
      <Skeleton
        minHeight='20px'
        isLoaded={resultsSettings.length > 0 && opportunityDataset}
        speed={1000}
      >
        <StackedPercentileSelector disabled={isDisabled} stale={isStale} />
      </Skeleton>

      <Stack align='center' isInline spacing={6}>
        <Box fontWeight='500' whiteSpace='nowrap'>
          Time cutoff
        </Box>
        <CutoffSlider isDisabled={isDisabledOrStale} />
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

        <PercentileSlider flex='1' isDisabled={isDisabledOrStale} />
      </Stack>
    </Stack>
  )
}

function ScenarioApplicationErrors({errors, ...p}) {
  /** Render any errors that may have occurred applying the project */
  return (
    <Stack spacing={5} {...p}>
      {errors.map((err, idx) => (
        <Stack key={idx}>
          <Heading size='sm'>{err.title}</Heading>
          <Heading size='sm'>
            {message('analysis.errorsInModification', {id: err.modificationId})}
          </Heading>
          <List styleType='disc'>
            {err.messages.map((msg, idx) => (
              <ListItem key={`message-${idx}`}>{msg}</ListItem>
            ))}
          </List>
        </Stack>
      ))}
    </Stack>
  )
}

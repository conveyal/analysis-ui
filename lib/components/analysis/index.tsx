import lonlat from '@conveyal/lonlat'
import {faExclamationCircle} from '@fortawesome/free-solid-svg-icons'
import get from 'lodash/get'
import dynamic from 'next/dynamic'
import Router from 'next/router'
import {useCallback, useEffect} from 'react'
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
import {TRAVEL_TIME_PERCENTILES} from 'lib/constants'
import StackedPercentileSelector from 'lib/containers/stacked-percentile-selector'
import message from 'lib/message'
import OpportunityDatasetSelector from 'lib/modules/opportunity-datasets/components/selector'
import {routeTo} from 'lib/router'
import selectAnalysisBounds from 'lib/selectors/analysis-bounds'
import selectCurrentBundle from 'lib/selectors/current-bundle'
import selectCurrentProject from 'lib/selectors/current-project'
import selectDTTD from 'lib/selectors/destination-travel-time-distribution'
import selectDTTDComparison from 'lib/selectors/comparison-destination-travel-time-distribution'
import selectMaxTripDurationMinutes from 'lib/selectors/max-trip-duration-minutes'
import selectProfileRequest from 'lib/selectors/profile-request'
import selectProfileRequestHasChanged from 'lib/selectors/profile-request-has-changed'
import selectProfileRequestLonLat from 'lib/selectors/profile-request-lonlat'
import nearestPercentileIndex from 'lib/selectors/nearest-percentile-index'

import InnerDock from '../inner-dock'
import Select from '../select'
import Collapsible from '../collapsible'
import Icon from '../icon'
import {Group as FormGroup, Slider} from '../input'

import AnalysisTitle from './title'
import BookmarkChooser from './bookmark-chooser'
import ScenarioApplicationError from './scenario-application-error'
import ProfileRequestEditor from './profile-request-editor'
import AdvancedSettings from './advanced-settings'

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

const bold = (b) => `<strong>${b}</strong>`

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
  const comparisonProjectId = useSelector((s) =>
    get(s, 'analysis.comparisonProjectId')
  )
  const comparisonVariant = useSelector((s) =>
    get(s, 'analysis.comparisonVariant')
  )
  const destination = useSelector((s) => get(s, 'analysis.destination'))
  const dttdComparison = useSelector(selectDTTDComparison)
  const dttd = useSelector(selectDTTD)
  const isochroneCutoff = useSelector(selectMaxTripDurationMinutes)
  const isochroneFetchStatus = useSelector((s) =>
    get(s, 'analysis.isochroneFetchStatus')
  )
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
  const projectVariants = [
    {label: message('analysis.baseline'), value: -1},
    ...get(currentProject, 'variants', []).map((v, index) => ({
      label: v,
      value: index
    }))
  ]
  const comparisonVariantOptions = [
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

  /**
   * Check if the selected project's bundles are out of date.
   * TODO: Move into a selector?
   * @returns {void | String} returns a message if they are out of date.
   */
  function _bundleIsOutOfDate() {
    const date = new Date(profileRequest.date)
    if (currentProject === null || currentProject === undefined) return

    if (
      currentBundle != null &&
      (new Date(currentBundle.serviceStart) > date ||
        new Date(currentBundle.serviceEnd) < date)
    ) {
      return message('analysis.bundleOutOfDate', {
        bundle: bold(currentBundle.name),
        project: bold(currentProject.name),
        serviceStart: bold(currentBundle.serviceStart),
        serviceEnd: bold(currentBundle.serviceEnd),
        selectedDate: bold(profileRequest.date)
      })
    }

    // Do the same check for the comparison project and bundle
    if (comparisonProject === null || comparisonProject === undefined) {
      return
    }

    const bundle = bundles.find((b) => b._id === comparisonProject.bundleId)
    if (
      bundle != null &&
      (new Date(bundle.serviceStart) > date ||
        new Date(bundle.serviceEnd) < date)
    ) {
      return message('analysis.bundleOutOfDate', {
        bundle: bold(bundle.name),
        project: bold(comparisonProject.name),
        serviceStart: bold(bundle.serviceStart),
        serviceEnd: bold(bundle.serviceEnd),
        selectedDate: bold(profileRequest.date)
      })
    }
  }
  const bundleOutOfDate = _bundleIsOutOfDate()

  // Current project is stored in the query string
  function _setCurrentProject(option) {
    const {as, query, href} = routeTo('analysis', {
      ...Router.query,
      projectId: option._id
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

  const _setIsochroneCutoff = (e) =>
    setPR({maxTripDurationMinutes: parseInt(e.target.value)})
  const _setTravelTimePercentile = (e) =>
    setPR({travelTimePercentile: Number(e.target.value)})

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

      <AnalysisTitle />

      <InnerDock className='block' style={{width: '640px'}}>
        {scenarioWarnings != null && scenarioWarnings.length > 0 && (
          <div className='alert alert-warning'>
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
          </div>
        )}

        {scenarioErrors != null && scenarioErrors.length > 0 && (
          <div className='alert alert-danger'>
            <strong>
              <Icon icon={faExclamationCircle} />{' '}
              {message('analysis.errorsInProject')}
            </strong>
            <br />
            <ScenarioApplicationErrors errors={scenarioErrors} />
          </div>
        )}

        <div className='row'>
          <FormGroup className='col-xs-6'>
            <label className='control-label' htmlFor='select-project'>
              {message('common.project')}
            </label>
            <Select
              name='select-project'
              inputId='select-project'
              isDisabled={projects.length === 0 || isFetchingIsochrone}
              getOptionLabel={(p) => p.name}
              getOptionValue={(p) => p._id}
              options={projects}
              value={currentProject}
              onChange={_setCurrentProject}
            />
          </FormGroup>
          <FormGroup className='col-xs-6'>
            <label className='control-label' htmlFor='select-scenario'>
              {message('common.scenario')}
            </label>
            <Select
              name='select-scenario'
              inputId='select-scenario'
              isDisabled={disableInputs}
              options={projectVariants}
              value={projectVariants.find(
                (v) => v.value === profileRequest.variantIndex
              )}
              onChange={_setCurrentVariant}
            />
          </FormGroup>
        </div>

        <div className='row'>
          <FormGroup className='col-xs-6'>
            <label
              className='control-label'
              htmlFor='select-comparison-project'
            >
              {message('analysis.comparison') + ' ' + message('common.project')}
            </label>
            <Select
              name='select-comparison-project'
              inputId='select-comparison-project'
              isClearable
              isDisabled={isFetchingIsochrone || !currentProject}
              getOptionLabel={(p) => p.name}
              getOptionValue={(p) => p._id}
              onChange={_setComparisonProject}
              options={projects}
              placeholder={message('analysis.selectComparisonProject')}
              value={projects.find((p) => p._id === comparisonProjectId)}
            />
          </FormGroup>

          <FormGroup className='col-xs-6'>
            <label
              className='control-label'
              htmlFor='select-comparison-scenario'
            >
              {message('analysis.comparison') +
                ' ' +
                message('common.scenario')}
            </label>
            <Select
              name='select-comparison-scenario'
              inputId='select-comparison-scenario'
              isDisabled={isFetchingIsochrone || !comparisonProjectId}
              onChange={_setComparisonVariant}
              options={comparisonVariantOptions}
              placeholder={message('analysis.selectComparisonProjectVariant')}
              value={comparisonVariantOptions.find(
                (v) => v.value === comparisonVariant
              )}
            />
          </FormGroup>
        </div>

        <div className='row'>
          <FormGroup className='col-xs-12'>
            <label
              className='control-label'
              htmlFor='select-opportunity-dataset'
            >
              {message('analysis.grid')}
            </label>
            <OpportunityDatasetSelector
              isDisabled={disableInputs}
              regionId={region._id}
            />
          </FormGroup>
        </div>

        <div className='row'>
          <FormGroup
            label={`Time cutoff: ${isochroneCutoff} minutes`}
            className='col-xs-12'
          >
            <input
              disabled={disableInputs || profileRequestHasChanged}
              type='range'
              value={isochroneCutoff}
              min={1}
              max={120}
              title={message('analysis.cutoff')}
              onChange={_setIsochroneCutoff}
            />
          </FormGroup>
        </div>

        <StackedPercentileSelector
          disabled={disableInputs}
          stale={profileRequestHasChanged}
        />

        <br />

        <BookmarkChooser disabled={disableInputs} />
        <ProfileRequestEditor
          bundleOutOfDate={bundleOutOfDate}
          disabled={disableInputs}
          profileRequest={profileRequest}
          setProfileRequest={setPR}
        />

        {/*
         * A slider for selecting the percentile to use in a regional
         * analysis. This will eventually be moved into analysis
         * settings once we can calculate multiple percentiles in single
         * point mode.
         */}
        <Slider
          disabled={disableInputs || profileRequestHasChanged}
          value={profileRequest.travelTimePercentile || 50}
          min={1}
          max={99}
          step={1}
          label={message('analysis.travelTimePercentile', {
            regional: profileRequest.travelTimePercentile,
            singlePoint:
              TRAVEL_TIME_PERCENTILES[
                nearestPercentileIndex(profileRequest.travelTimePercentile)
              ]
          })}
          onChange={_setTravelTimePercentile}
        />

        <AdvancedSettings
          analysisBounds={analysisBounds}
          disabled={disableInputs}
          profileRequest={profileRequest}
          regionalAnalyses={regionalAnalyses}
          regionBounds={region.bounds}
          setProfileRequest={setPR}
        />
      </InnerDock>
    </>
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

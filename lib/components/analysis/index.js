import lonlat from '@conveyal/lonlat'
import {
  faDownload,
  faExclamationCircle,
  faGlobe
} from '@fortawesome/free-solid-svg-icons'
import get from 'lodash/get'
import dynamic from 'next/dynamic'
import Router from 'next/router'
import React from 'react'

import {TRAVEL_TIME_PERCENTILES} from 'lib/constants'
import StackedPercentileSelector from 'lib/containers/stacked-percentile-selector'
import message from 'lib/message'
import OpportunityDatasetSelector from 'lib/modules/opportunity-datasets/components/selector'
import {routeTo} from 'lib/router'
import nearestPercentileIndex from 'lib/selectors/nearest-percentile-index'

import InnerDock from '../inner-dock'
import Select from '../select'
import {Button, Group as ButtonGroup} from '../buttons'
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

export default class SinglePointAnalysis extends React.PureComponent {
  state = {
    regionalAnalysisName: undefined
  }

  componentDidMount() {
    this.props.loadAllRegionalAnalyses(this.props.regionId)
    this._setFromLonLat()
  }

  componentWillUnmount() {
    this.props.abortFetchTravelTimeSurface()
    this.props.clearTravelTimeSurfaces()
  }

  componentDidUpdate() {
    this._setFromLonLat()
  }

  _setFromLonLat() {
    const p = this.props
    if (p.profileRequest.fromLat == null || p.profileRequest.fromLon == null) {
      p.setProfileRequest({
        fromLat: p.profileRequestLonLat.lat,
        fromLon: p.profileRequestLonLat.lon
      })
    }
  }

  /**
   * Check if the selected project's bundles are out of date.
   *
   * @returns {void | String} returns a message if they are out of date.
   */
  _bundleIsOutOfDate() {
    const p = this.props
    const date = new Date(p.profileRequest.date)
    if (p.currentProject === null || p.currentProject === undefined) return

    if (
      p.currentBundle != null &&
      (new Date(p.currentBundle.serviceStart) > date ||
        new Date(p.currentBundle.serviceEnd) < date)
    ) {
      return message('analysis.bundleOutOfDate', {
        bundle: bold(p.currentBundle.name),
        project: bold(p.currentProject.name),
        serviceStart: bold(p.currentBundle.serviceStart),
        serviceEnd: bold(p.currentBundle.serviceEnd),
        selectedDate: bold(p.profileRequest.date)
      })
    }

    // Do the same check for the comparison project and bundle
    if (p.comparisonProject === null || p.comparisonProject === undefined) {
      return
    }

    const bundle = p.bundles.find((b) => b._id === p.comparisonProject.bundleId)
    if (
      bundle != null &&
      (new Date(bundle.serviceStart) > date ||
        new Date(bundle.serviceEnd) < date)
    ) {
      return message('analysis.bundleOutOfDate', {
        bundle: bold(bundle.name),
        project: bold(p.comparisonProject.name),
        serviceStart: bold(bundle.serviceStart),
        serviceEnd: bold(bundle.serviceEnd),
        selectedDate: bold(p.profileRequest.date)
      })
    }
  }

  _createRegionalAnalysis = () => {
    const p = this.props
    if (p.currentProject) {
      const name = window.prompt(
        'Enter a name and click ok to begin a regional analysis job for this project and settings:',
        `Analysis ${p.regionalAnalyses.length + 1}: ${p.currentProject.name} ` +
          `${p.currentProject.variants[p.profileRequest.variantIndex] || ''}`
      )
      if (name && name.length > 0) {
        p.createRegionalAnalysis({
          name,
          profileRequest: p.profileRequest
        })
      }
    }
  }

  // Current project is stored in the query string
  _setCurrentProject = (option) => {
    const {as, query, href} = routeTo('analysis', {
      ...Router.query,
      projectId: option._id
    })
    const qs = Object.keys(query)
      .map((k) => `${k}=${query[k]}`)
      .join('&')
    Router.push(`${href}?${qs}`, as)
  }

  _setCurrentVariant = (option) => {
    this.props.setProfileRequest({variantIndex: parseInt(option.value)})
  }

  _setIsochroneCutoff = (e) =>
    this.props.setProfileRequest({
      maxTripDurationMinutes: parseInt(e.target.value)
    })

  _setTravelTimePercentile = (e) =>
    this.props.setProfileRequest({travelTimePercentile: Number(e.target.value)})

  /**
   * Set the origin and fetch if ready.
   */
  _setOrigin = (ll) => {
    this.props.setProfileRequest({
      fromLat: ll.lat,
      fromLon: ll.lon
    })

    if (this._readyToFetch()) this.props.fetchTravelTimeSurface()
  }

  _dblClickMarker = () => {}

  _readyToFetch = () => !!this.props.currentProject

  render() {
    const p = this.props
    const bundleOutOfDate = this._bundleIsOutOfDate()
    const isFetchingIsochrone = !!p.isochroneFetchStatus
    const disableInputs = isFetchingIsochrone || !p.currentProject
    const displayedDataIsCurrent =
      !p.profileRequestHasChanged && !isFetchingIsochrone
    const disableCreateRegionalAnalysis = disableInputs || !p.isochrone

    const projectVariants = [
      {label: message('analysis.baseline'), value: -1},
      ...get(p.currentProject, 'variants', []).map((v, index) => ({
        label: v,
        value: index
      }))
    ]

    return (
      <>
        <DotMap />

        <Rectangle
          bounds={p.analysisBounds}
          dashArray='3 8'
          fillOpacity={0}
          pointerEvents='none'
          weight={1}
        />

        <ModificationsMap isEditing />

        <Isochrones
          comparison={p.comparisonIsochrone}
          isCurrent={displayedDataIsCurrent}
          isochrone={p.isochrone}
        />

        <AnalysisMap
          destination={p.destination}
          displayedDataIsCurrent={displayedDataIsCurrent}
          disableMarker={disableInputs}
          markerPosition={p.profileRequestLonLat}
          markerTooltip={
            !p.currentProject ? message('analysis.disableFetch') : undefined
          }
          setDestination={p.setDestination}
          setOrigin={this._setOrigin}
        />

        {displayedDataIsCurrent && p.destination && (
          <DTTD
            key={lonlat.toString(p.destination)}
            comparisonDistribution={
              p.comparisonDestinationTravelTimeDistribution
            }
            destination={p.destination}
            distribution={p.destinationTravelTimeDistribution}
            remove={p.removeDestination}
            setDestination={p.setDestination}
          />
        )}

        <AnalysisTitle
          abortFetchTravelTimeSurface={p.abortFetchTravelTimeSurface}
          createRegionalAnalysis={this._createRegionalAnalysis}
          disableCreateRegionalAnalysis={disableCreateRegionalAnalysis}
          disableFetchTravelTimeSurface={disableInputs}
          fetchTravelTimeSurface={p.fetchTravelTimeSurface}
          isochroneFetchStatus={p.isochroneFetchStatus}
        />

        <InnerDock className='block' style={{width: '640px'}}>
          {p.scenarioApplicationWarnings != null &&
            p.scenarioApplicationWarnings.length > 0 && (
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
                  <ScenarioApplicationErrors
                    errors={p.scenarioApplicationWarnings}
                  />
                </Collapsible>
              </div>
            )}

          {p.scenarioApplicationErrors != null &&
            p.scenarioApplicationErrors.length > 0 && (
              <div className='alert alert-danger'>
                <strong>
                  <Icon icon={faExclamationCircle} />{' '}
                  {message('analysis.errorsInProject')}
                </strong>
                <br />
                <ScenarioApplicationErrors
                  errors={p.scenarioApplicationErrors}
                />
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
                isDisabled={p.projects.length === 0 || isFetchingIsochrone}
                getOptionLabel={(p) => p.name}
                getOptionValue={(p) => p._id}
                options={p.projects}
                value={p.currentProject}
                onChange={this._setCurrentProject}
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
                  (v) => v.value === p.profileRequest.variantIndex
                )}
                onChange={this._setCurrentVariant}
              />
            </FormGroup>
          </div>

          {this.renderComparisonSelect()}

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
                regionId={p.regionId}
              />
            </FormGroup>
          </div>

          <div className='row'>
            <FormGroup
              label={`Time cutoff: ${p.isochroneCutoff} minutes`}
              className='col-xs-12'
            >
              <input
                disabled={disableInputs || p.profileRequestHasChanged}
                type='range'
                value={p.isochroneCutoff}
                min={1}
                max={120}
                title={message('analysis.cutoff')}
                onChange={this._setIsochroneCutoff}
              />
            </FormGroup>
          </div>

          <StackedPercentileSelector
            disabled={disableInputs}
            stale={p.profileRequestHasChanged}
          />

          {p.isochrone && (
            <>
              <br />
              <ButtonGroup justified>
                <Button
                  disabled={!displayedDataIsCurrent}
                  onClick={p.downloadIsochrone}
                  style='info'
                >
                  <Icon icon={faDownload} /> Isochrone as GeoJSON
                </Button>
                <Button
                  disabled={!displayedDataIsCurrent}
                  onClick={p.fetchGeoTIFF}
                  style='info'
                >
                  <Icon icon={faGlobe} /> Generate & Download GeoTIFF
                </Button>
              </ButtonGroup>
              <br />
            </>
          )}

          <BookmarkChooser disabled={disableInputs} />
          <ProfileRequestEditor
            bundleOutOfDate={bundleOutOfDate}
            disabled={disableInputs}
            profileRequest={p.profileRequest}
            setProfileRequest={p.setProfileRequest}
          />

          {/*
           * A slider for selecting the percentile to use in a regional
           * analysis. This will eventually be moved into analysis
           * settings once we can calculate multiple percentiles in single
           * point mode.
           */}
          <Slider
            disabled={disableInputs || p.profileRequestHasChanged}
            value={p.profileRequest.travelTimePercentile || 50}
            min={1}
            max={99}
            step={1}
            label={message('analysis.travelTimePercentile', {
              regional: p.profileRequest.travelTimePercentile,
              singlePoint:
                TRAVEL_TIME_PERCENTILES[
                  nearestPercentileIndex(p.profileRequest.travelTimePercentile)
                ]
            })}
            onChange={this._setTravelTimePercentile}
          />

          <AdvancedSettings
            analysisBounds={p.analysisBounds}
            disabled={disableInputs}
            hideBoundsEditor={this._hideBoundsEditor}
            profileRequest={p.profileRequest}
            regionalAnalyses={p.regionalAnalyses}
            regionBounds={p.regionBounds}
            setProfileRequest={p.setProfileRequest}
          />
        </InnerDock>
      </>
    )
  }

  _setComparisonProject = (project) => {
    const p = this.props
    if (project) {
      // since the comparison is clearable
      p.setComparisonProject({
        _id: project._id,
        variantIndex: -1
      })
    } else {
      p.clearComparisonProject()
    }
  }

  setComparisonVariant = (e) => {
    const {comparisonProject, setComparisonProject} = this.props
    if (e) {
      setComparisonProject({_id: comparisonProject._id, variantIndex: e.value})
    }
  }

  /**
   * Render the text boxes to choose a comparison project and variant
   */
  renderComparisonSelect() {
    const p = this.props
    const variantOptions = [
      // special value -1 indicates no modifications
      {label: message('analysis.baseline'), value: -1},
      ...get(p.comparisonProject, 'variants', []).map((label, value) => ({
        label,
        value
      }))
    ]
    const comparisonProjectId = get(p.comparisonProject, '_id')
    const isFetchingIsochrone = !!p.isochroneFetchStatus

    return (
      <div className='row'>
        <FormGroup className='col-xs-6'>
          <label className='control-label' htmlFor='select-comparison-project'>
            {message('analysis.comparison') + ' ' + message('common.project')}
          </label>
          <Select
            name='select-comparison-project'
            inputId='select-comparison-project'
            isClearable
            isDisabled={isFetchingIsochrone || !p.currentProject}
            getOptionLabel={(p) => p.name}
            getOptionValue={(p) => p._id}
            onChange={this._setComparisonProject}
            options={p.projects}
            placeholder={message('analysis.selectComparisonProject')}
            value={p.projects.find((p) => p._id === comparisonProjectId)}
          />
        </FormGroup>

        <FormGroup className='col-xs-6'>
          <label className='control-label' htmlFor='select-comparison-scenario'>
            {message('analysis.comparison') + ' ' + message('common.scenario')}
          </label>
          <Select
            name='select-comparison-scenario'
            inputId='select-comparison-scenario'
            isDisabled={isFetchingIsochrone || !comparisonProjectId}
            onChange={this.setComparisonVariant}
            options={variantOptions}
            placeholder={message('analysis.selectComparisonProjectVariant')}
            value={variantOptions.find((v) => v.value === p.comparisonVariant)}
          />
        </FormGroup>
      </div>
    )
  }
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

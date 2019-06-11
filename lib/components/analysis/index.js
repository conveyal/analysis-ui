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
import BookmarkChooser from 'lib/containers/bookmark-chooser'
import StackedPercentileSelector from 'lib/containers/stacked-percentile-selector'
import message from 'lib/message'
import OpportunityDatasetSelector from 'lib/modules/opportunity-datasets/components/selector'
import nearestPercentileIndex from 'lib/selectors/nearest-percentile-index'

import Dock from '../dock'
import InnerDock from '../inner-dock'
import Select from '../select'
import {Button, Group as ButtonGroup} from '../buttons'
import Collapsible from '../collapsible'
import ErrorModal from '../error-modal'
import Icon from '../icon'
import {Group, Slider} from '../input'
import Sidebar from '../sidebar'

import AnalysisTitle from './title'
import ScenarioApplicationError from './scenario-application-error'
import ProfileRequestEditor from './profile-request-editor'
import AdvancedSettings from './advanced-settings'

const AnalysisMap = dynamic(() => import('./map'), {ssr: false})

const bold = b => `<strong>${b}</strong>`

export default class SinglePointAnalysis extends React.PureComponent {
  state = {
    regionalAnalysisName: undefined,
    showBoundsEditor: false
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

    const bundle = p.bundles.find(b => b._id === p.comparisonProject.bundleId)
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
  _setCurrentProject = option => {
    Router.push({
      pathname: Router.pathname,
      query: {...Router.query, projectId: option._id}
    })
  }

  _setCurrentVariant = option => {
    this.props.setProfileRequest({variantIndex: parseInt(option.value)})
  }

  _setIsochroneCutoff = e =>
    this.props.setProfileRequest({
      maxTripDurationMinutes: parseInt(e.target.value)
    })

  _setTravelTimePercentile = e =>
    this.props.setProfileRequest({travelTimePercentile: Number(e.target.value)})

  _hideBoundsEditor = () => this.setState({showBoundsEditor: false})

  _showBoundsEditor = () => this.setState({showBoundsEditor: true})

  _setBounds = bounds => this.props.setProfileRequest({bounds})

  /**
   * Set the origin and fetch if ready.
   */
  _setOrigin = ll => {
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
    const s = this.state
    const bundleOutOfDate = this._bundleIsOutOfDate()
    const isFetchingIsochrone = !!p.isochroneFetchStatus
    const disableInputs = isFetchingIsochrone || !p.currentProject
    const displayedDataIsCurrent =
      !p.profileRequestHasChanged && !isFetchingIsochrone
    const disableCreateRegionalAnalysis = disableInputs || !p.isochrone

    if (s.hasError) {
      return (
        <>
          <Sidebar />
          <ErrorModal
            error={s.error.name}
            errorMessage={s.error.message}
            clear={() => this.setState({hasError: false, error: undefined})}
            stack={s.error.stack}
          />
        </>
      )
    }

    const projectVariants = [
      {label: message('analysis.baseline'), value: -1},
      ...get(p.currentProject, 'variants', []).map((v, index) => ({
        label: v,
        value: index
      }))
    ]

    return (
      <>
        <Sidebar />
        <ErrorModal />

        <div className='Fullscreen analysisMode'>
          <AnalysisMap
            analysisBounds={p.analysisBounds}
            comparisonDistribution={
              p.comparisonDestinationTravelTimeDistribution
            }
            comparisonIsochrone={p.comparisonIsochrone}
            destination={p.destination}
            displayedDataIsCurrent={displayedDataIsCurrent}
            distribution={p.destinationTravelTimeDistribution}
            disableMarker={disableInputs}
            isochrone={p.isochrone}
            markerPosition={p.profileRequestLonLat}
            markerTooltip={
              !p.currentProject ? message('analysis.disableFetch') : undefined
            }
            removeDestination={p.removeDestination}
            setBounds={this._setBounds}
            setDestination={p.setDestination}
            setOrigin={this._setOrigin}
            showBoundsEditor={this.state.showBoundsEditor}
          />
        </div>

        <Dock className='analysisMode'>
          <AnalysisTitle
            abortFetchTravelTimeSurface={p.abortFetchTravelTimeSurface}
            createRegionalAnalysis={this._createRegionalAnalysis}
            disableCreateRegionalAnalysis={disableCreateRegionalAnalysis}
            disableFetchTravelTimeSurface={disableInputs}
            fetchTravelTimeSurface={p.fetchTravelTimeSurface}
            isochroneFetchStatus={p.isochroneFetchStatus}
          />

          <InnerDock>
            <div className='block'>
              {bundleOutOfDate && (
                <div className='alert alert-warning'>
                  <strong>Warning! </strong>
                  <span dangerouslySetInnerHTML={{__html: bundleOutOfDate}} />
                </div>
              )}

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
                <Group label={message('common.project')} className='col-xs-6'>
                  <Select
                    clearable={false}
                    disabled={p.projects.length === 0 || isFetchingIsochrone}
                    getOptionLabel={p => p.name}
                    getOptionValue={p => p._id}
                    options={p.projects}
                    value={p.currentProject}
                    onChange={this._setCurrentProject}
                  />
                </Group>
                <Group label={message('common.scenario')} className='col-xs-6'>
                  <Select
                    clearable={false}
                    disabled={disableInputs}
                    options={projectVariants}
                    value={projectVariants.find(
                      v => v.value === p.profileRequest.variantIndex
                    )}
                    onChange={this._setCurrentVariant}
                  />
                </Group>
              </div>

              {this.renderComparisonSelect()}

              <div className='row'>
                <Group label={message('analysis.grid')} className='col-xs-12'>
                  <OpportunityDatasetSelector regionId={p.regionId} />
                </Group>
              </div>

              <div className='row'>
                <Group
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
                </Group>
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
                      nearestPercentileIndex(
                        p.profileRequest.travelTimePercentile
                      )
                    ]
                })}
                onChange={this._setTravelTimePercentile}
              />

              <AdvancedSettings
                disabled={disableInputs}
                hideBoundsEditor={this._hideBoundsEditor}
                profileRequest={p.profileRequest}
                regionalAnalyses={p.regionalAnalyses}
                regionBounds={p.regionBounds}
                setProfileRequest={p.setProfileRequest}
                showBoundsEditor={this._showBoundsEditor}
              />
            </div>
          </InnerDock>
        </Dock>
      </>
    )
  }

  _setComparisonProject = project => {
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

  setComparisonVariant = e => {
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
        <Group
          label={
            message('analysis.comparison') + ' ' + message('common.project')
          }
          className='col-xs-6'
        >
          <Select
            disabled={isFetchingIsochrone || !p.currentProject}
            getOptionLabel={p => p.name}
            getOptionValue={p => p._id}
            name={message('common.project')}
            onChange={this._setComparisonProject}
            options={p.projects}
            placeholder={message('analysis.selectComparisonProject')}
            value={p.projects.find(p => p._id === comparisonProjectId)}
          />
        </Group>

        <Group
          label={
            message('analysis.comparison') + ' ' + message('common.scenario')
          }
          className='col-xs-6'
        >
          <Select
            disabled={isFetchingIsochrone || !comparisonProjectId}
            clearable={false}
            name={message('common.scenario')}
            onChange={this.setComparisonVariant}
            options={variantOptions}
            placeholder={message('analysis.selectComparisonProjectVariant')}
            value={variantOptions.find(v => v.value === p.comparisonVariant)}
          />
        </Group>
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

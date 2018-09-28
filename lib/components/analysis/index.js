// @flow
import lonlat from '@conveyal/lonlat'
import Icon from '@conveyal/woonerf/components/icon'
import message from '@conveyal/woonerf/message'
import Pure from '@conveyal/woonerf/components/pure'
import {MapEvent} from 'leaflet'
import get from 'lodash/get'
import React from 'react'
import {GeoJSON, Marker} from 'react-leaflet'
import Select from 'react-select'
import uuid from 'uuid'

import BookmarkChooser from '../../containers/bookmark-chooser'
import {Button, Group as ButtonGroup} from '../buttons'
import Collapsible from '../collapsible'
import {TRAVEL_TIME_PERCENTILES} from '../../constants'
import colors from '../../constants/colors'
import DestinationTravelTimeDistribution from '../map/destination-travel-time-distribution'
import EditBounds from '../map/edit-bounds'
import ErrorModal from '../error-modal'
import InnerDock from '../inner-dock'
import {Group, Slider} from '../input'
import LabelLayer from '../map/label-layer'
import Map from '../map'
import ModificationsMap from '../../containers/modifications-map'
import nearestPercentileIndex from '../../selectors/nearest-percentile-index'
import OpportunityDatasets from '../../modules/opportunity-datasets'
import Sidebar from '../sidebar'
import StackedPercentileSelector
  from '../../containers/stacked-percentile-selector'
import type {
  Bundle,
  LonLat,
  ProfileRequest,
  Project,
  Quintiles,
  ReactSelectResult
} from '../../types'

import ScenarioApplicationError from './scenario-application-error'
import ProfileRequestEditor from './profile-request-editor'
import AdvancedSettings from './advanced-settings'

type Bounds = {
  east: number,
  north: number,
  south: number,
  west: number
}

type Props = {
  bundles: Bundle[],
  clearComparisonProject: () => void,
  comparisonDestinationTravelTimeDistribution?: Quintiles,
  comparisonIsochrone: any,
  comparisonProject?: Project,
  comparisonVariant?: number,
  createRegionalAnalysis: any => void,
  currentBundle?: Bundle,
  currentProject?: Project,
  destination: LonLat,
  destinationTravelTimeDistribution?: Quintiles,
  downloadComparisonIsochrone: () => void,
  downloadIsochrone: () => void,
  fetchTravelTimeSurface: (asGeoTIFF?: boolean) => void,
  isFetchingIsochrone: boolean,
  isochrone: any,
  isochroneFetchStatusMessage?: string,
  loadAllRegionalAnalyses: (regionId: string) => void,
  profileRequest: ProfileRequest,
  profileRequestHasChanged: boolean,

  projects: Array<{
    _id: string,
    name: string,
    variants: string[]
  }>,
  push: (string) => void,
  regionBounds?: Bounds,
  regionId: string,
  regionalAnalyses: Array<Bounds & {
      _id: string,
      height: number,
      name: string,
      width: number,
      zoom: number
    }>,
  removeDestination: () => void,
  scenarioApplicationErrors?: any[],
  scenarioApplicationWarnings?: any[],
  setComparisonProject: (project: any) => void,
  setCurrentProject: (projectId: string) => void,
  setDestination: (any) => void,
  setProfileRequest: (profileRequestFields: any) => void
}

type State = {
  creatingRegionalAnalysis: boolean,
  regionalAnalysisName: void | string,
  showBoundsEditor: boolean
}

const isochroneStyle = (fillColor) => ({
  fillColor,
  opacity: 0.65,
  pointerEvents: 'none',
  stroke: false
})

const bold = b => `<strong>${b}</strong>`

export default class SinglePointAnalysis extends Pure {
  props: Props
  state: State

  state = {
    creatingRegionalAnalysis: false,
    regionalAnalysisName: undefined,
    showBoundsEditor: false
  }

  componentDidMount () {
    this.props.loadAllRegionalAnalyses(this.props.regionId)
    this._setProfileRequestLonLat()
  }

  componentDidUpdate () {
    this._setProfileRequestLonLat()
  }

  /**
   * Check if the selected project's bundles are out of date.
   *
   * @returns {void | String} returns a message if they are out of date.
   */
  _bundleIsOutOfDate () {
    const p = this.props
    const date = new Date(p.profileRequest.date)
    if (p.currentProject === null || p.currentProject === undefined) return

    if (p.currentBundle != null && (
      new Date(p.currentBundle.serviceStart) > date ||
      new Date(p.currentBundle.serviceEnd) < date
    )) {
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
    if (bundle != null && (
      new Date(bundle.serviceStart) > date ||
      new Date(bundle.serviceEnd) < date
    )) {
      return message('analysis.bundleOutOfDate', {
        bundle: bold(bundle.name),
        project: bold(p.comparisonProject.name),
        serviceStart: bold(bundle.serviceStart),
        serviceEnd: bold(bundle.serviceEnd),
        selectedDate: bold(p.profileRequest.date)
      })
    }
  }

  _setProfileRequestLonLat () {
    const p = this.props
    if (p.regionBounds && (!p.profileRequest.fromLat || !p.profileRequest.fromLon)) {
      const {north, south, east, west} = p.regionBounds
      p.setProfileRequest({
        fromLat: (north + south) / 2,
        fromLon: (east + west) / 2
      })
    }
  }

  _createRegionalAnalysis = () => {
    const {createRegionalAnalysis, currentProject, regionalAnalyses, profileRequest} = this.props
    if (currentProject) {
      const name = window.prompt(
        'Enter a name and click ok to begin a regional analysis job for this project and settings:',
        `Analysis ${regionalAnalyses.length + 1}: ${currentProject.name} ` +
      `${currentProject.variants[profileRequest.variantIndex]}`)
      if (name && name.length > 0) {
        createRegionalAnalysis({
          name,
          profileRequest
        })
      }
    }
  }

  _setCurrentProject = (option: ReactSelectResult) => {
    this.props.setCurrentProject(option.value)
  }

  _setCurrentVariant = (option: ReactSelectResult) => {
    this.props.setProfileRequest({variantIndex: parseInt(option.value)})
  }

  _downloadGeoTIFFs = () => {
    if (this._readyToFetch()) this.props.fetchTravelTimeSurface(true)
  }

  _setTravelTimePercentile = (e: Event & {target: HTMLInputElement}) =>
    this.props.setProfileRequest({travelTimePercentile: Number(e.target.value)})

  _hideBoundsEditor = () =>
    this.setState({showBoundsEditor: false})

  _showBoundsEditor = () =>
    this.setState({showBoundsEditor: true})

  _setBounds = (bounds: Bounds) =>
    this.props.setProfileRequest({bounds})

  _clickMap = (e: MapEvent) => {
    this.props.setDestination(lonlat(e.latlng))
  }

  _dragMarker = (e: Event & {target: MapEvent}) => {
    this.props.setProfileRequest({
      fromLat: e.target._latlng.lat,
      fromLon: e.target._latlng.lng
    })
    if (this._readyToFetch()) this.props.fetchTravelTimeSurface()
  }

  _dblClickMarker = () => {}

  _readyToFetch = () =>
    !!this.props.currentProject

  render () {
    const {
      comparisonIsochrone,
      currentProject,
      downloadComparisonIsochrone,
      downloadIsochrone,
      fetchTravelTimeSurface,
      isFetchingIsochrone,
      isochrone,
      isochroneFetchStatusMessage,
      profileRequest,
      profileRequestHasChanged,
      projects,
      scenarioApplicationErrors,
      scenarioApplicationWarnings,
      regionalAnalyses,
      regionBounds,
      setProfileRequest
    } = this.props
    const p = this.props
    const {creatingRegionalAnalysis} = this.state
    const disableInputs = !currentProject ||
      !!isFetchingIsochrone || !!scenarioApplicationErrors

    const markerPosition = profileRequest.fromLat && profileRequest.fromLon &&
      {lon: profileRequest.fromLon, lat: profileRequest.fromLat}

    const bundleOutOfDate = this._bundleIsOutOfDate()

    return (
      <div>
        <Sidebar />
        <ErrorModal />

        <div className='Fullscreen analysisMode'>
          <Map onClick={this._clickMap}>
            <OpportunityDatasets.components.DotMap />
            <ModificationsMap />

            {isochrone &&
              <GeoJSON
                data={isochrone}
                key={uuid.v4()}
                style={isochroneStyle(profileRequestHasChanged
                  ? colors.STALE_ISOCHRONE_COLOR
                  : colors.PROJECT_ISOCHRONE_COLOR)}
              />}

            {comparisonIsochrone &&
              <GeoJSON
                data={comparisonIsochrone}
                key={uuid.v4()}
                style={isochroneStyle(profileRequestHasChanged
                  ? colors.STALE_ISOCHRONE_COLOR
                  : colors.COMPARISON_ISOCHRONE_COLOR)}
              />}

            <LabelLayer />

            {markerPosition &&
              <Marker
                draggable
                onDblclick={this._dblClickMarker}
                onDragEnd={this._dragMarker}
                position={markerPosition}
              />}

            {p.destination &&
              <DestinationTravelTimeDistribution
                comparisonDistribution={p.comparisonDestinationTravelTimeDistribution}
                destination={p.destination}
                distribution={p.destinationTravelTimeDistribution}
                isFetchingIsochrone={p.isFetchingIsochrone}
                remove={p.removeDestination}
                setDestination={p.setDestination}
              />}

            {this.state.showBoundsEditor &&
              <EditBounds
                bounds={profileRequest.bounds || regionBounds}
                save={this._setBounds}
              />}
          </Map>
        </div>

        <div className='ApplicationDock analysisMode'>
          <div className='ApplicationDockTitle'>
            <Icon type='area-chart' /> Analysis

            <Button
              className='pull-right'
              disabled={disableInputs}
              onClick={fetchTravelTimeSurface}
              style='primary'
            >
              <Icon
                type='refresh'
                className={isFetchingIsochrone ? 'fa-spin' : ''}
              />
              {' '}
              {isFetchingIsochrone && isochroneFetchStatusMessage
                ? message(`analysis.fetchStatus.${isochroneFetchStatusMessage}`)
                : message('analysis.refresh')}
            </Button>

            <Button
              className='pad-right pull-right'
              disabled={disableInputs || creatingRegionalAnalysis}
              style='success'
              onClick={this._createRegionalAnalysis}
            >
              {creatingRegionalAnalysis
                ? <Icon spin type='refresh' />
                : <Icon type='plus' />}
              {message('analysis.newRegionalAnalysis')}
            </Button>
          </div>

          <InnerDock>
            <div className='block'>
              {bundleOutOfDate &&
                <div className='alert alert-warning'>
                  <strong>Warning! </strong>
                  <span dangerouslySetInnerHTML={{__html: bundleOutOfDate}} />
                </div>}

              {scenarioApplicationWarnings != null &&
                scenarioApplicationWarnings.length > 0 &&
                <div className='alert alert-warning'>
                  <Collapsible
                    title={
                      <span className='text-warning'>
                        <Icon type='exclamation-circle' />&nbsp;
                        {message('analysis.warningsInProject')}
                      </span>
                    }
                  >
                    <ScenarioApplicationErrors
                      errors={scenarioApplicationWarnings}
                    />
                  </Collapsible>
                </div>}

              {scenarioApplicationErrors != null &&
                scenarioApplicationErrors.length > 0 &&
                <div className='alert alert-danger'>
                  <strong>
                    <Icon type='exclamation-circle' />{' '}
                    {message('analysis.errorsInProject')}
                  </strong>
                  <br />
                  <ScenarioApplicationErrors errors={scenarioApplicationErrors} />
                </div>}

              <div className='row'>
                <Group label={message('common.project')} className='col-xs-6'>
                  <Select
                    clearable={false}
                    disabled={projects.length === 0}
                    options={projects.map((p, index) => ({
                      label: p.name,
                      value: p._id
                    }))}
                    value={currentProject && currentProject._id}
                    onChange={this._setCurrentProject}
                  />
                </Group>
                <Group label={message('common.scenario')} className='col-xs-6'>
                  <Select
                    clearable={false}
                    disabled={isFetchingIsochrone || !currentProject}
                    options={get(currentProject, 'variants', []).map((v, index) => ({
                      label: v,
                      value: index
                    }))}
                    value={profileRequest.variantIndex}
                    onChange={this._setCurrentVariant}
                  />
                </Group>
              </div>

              {this.renderComparisonSelect()}

              <div className='row'>
                <Group label={message('analysis.grid')} className='col-xs-12'>
                  <OpportunityDatasets.components.Selector />
                </Group>
              </div>

              <StackedPercentileSelector />
            </div>

            <div className='block'>
              <ButtonGroup justified>
                <Button
                  disabled={!isochrone}
                  onClick={downloadIsochrone}
                  style='info'
                ><Icon type='download' /> Isochrone as GeoJSON
                </Button>
                <Button
                  disabled={!comparisonIsochrone}
                  onClick={downloadComparisonIsochrone}
                  style='info'
                ><Icon type='download' /> Comparison Isochrone as GeoJSON
                </Button>
              </ButtonGroup>

              <ButtonGroup justified>
                <Button
                  onClick={this._downloadGeoTIFFs}
                  style='info'
                ><Icon type='globe' /> Generate & Download GeoTIFFs
                </Button>
              </ButtonGroup>

              <BookmarkChooser />
              <ProfileRequestEditor
                disabled={disableInputs}
                profileRequest={profileRequest}
                setProfileRequest={setProfileRequest}
              />

              {/*
                * A slider for selecting the percentile to use in a regional
                * analysis. This will eventually be moved into analysis
                * settings once we can calculate multiple percentiles in single
                * point mode.
                */}
              <Slider
                disabled={disableInputs}
                value={profileRequest.travelTimePercentile || 50}
                min={1}
                max={99}
                step={1}
                label={`${message('analysis.travelTimePercentile', {
                  regional: profileRequest.travelTimePercentile,
                  singlePoint: TRAVEL_TIME_PERCENTILES[nearestPercentileIndex(profileRequest.travelTimePercentile)]
                })}`}
                onChange={this._setTravelTimePercentile}
              />

              <AdvancedSettings
                disabled={disableInputs}
                hideBoundsEditor={this._hideBoundsEditor}
                profileRequest={profileRequest}
                regionalAnalyses={regionalAnalyses}
                regionBounds={regionBounds}
                setProfileRequest={setProfileRequest}
                showBoundsEditor={this._showBoundsEditor}
              />
            </div>
          </InnerDock>
        </div>
      </div>
    )
  }

  _setComparisonProject = (result: ReactSelectResult) => {
    const {
      clearComparisonProject,
      projects,
      setComparisonProject
    } = this.props
    if (result) {
      // since the comparison is clearable
      const id = result.value
      setComparisonProject({
        ...projects.find(s => s._id === id),
        variantIndex: -1
      })
    } else {
      clearComparisonProject()
    }
  }

  setComparisonVariant = (e: ReactSelectResult) => {
    const {comparisonProject, setComparisonProject} = this.props
    if (e) {
      setComparisonProject({...comparisonProject, variantIndex: e.value})
    }
  }

  /**
   * Render the text boxes to choose a comparison project and variant
   */
  renderComparisonSelect () {
    const p = this.props
    const projectOptions = p.projects.map(s => ({value: s._id, label: s.name}))
    const variantOptions = [ // special value -1 indicates no modifications
      {label: message('analysis.baseline'), value: -1},
      ...get(p.comparisonProject, 'variants', []).map((label, value) => ({label, value}))
    ]
    const comparisonProjectId = get(p.comparisonProject, '_id')

    return (
      <div className='row'>
        <Group label={message('analysis.comparison') + ' ' + message('common.project')} className='col-xs-6'>
          <Select
            disabled={p.isFetchingIsochrone}
            name={message('common.project')}
            onChange={this._setComparisonProject}
            options={projectOptions}
            placeholder={message('analysis.selectComparisonProject')}
            value={comparisonProjectId}
          />
        </Group>

        <Group label={message('analysis.comparison') + ' ' + message('common.scenario')} className='col-xs-6'>
          <Select
            disabled={!comparisonProjectId}
            clearable={false}
            name={message('common.scenario')}
            onChange={this.setComparisonVariant}
            options={variantOptions}
            placeholder={message('analysis.selectComparisonProjectVariant')}
            value={p.comparisonVariant}
          />
        </Group>
      </div>
    )
  }
}

function ScenarioApplicationErrors ({errors}) {
  /** Render any errors that may have occurred applying the project */
  return (
    <div>
      {errors.map((err, idx) => (
        <ScenarioApplicationError error={err} key={`err-${idx}`} />
      ))}
    </div>
  )
}

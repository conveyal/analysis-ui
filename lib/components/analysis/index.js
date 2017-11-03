// @flow
import Icon from '@conveyal/woonerf/components/icon'
import Pure from '@conveyal/woonerf/components/pure'
import {Map as LeafletMap} from 'leaflet'
import React from 'react'
import Select from 'react-select'
import {sprintf} from 'sprintf-js'

import BookmarkChooser from '../../containers/bookmark-chooser'
import messages from '../../utils/messages'
import {Button, Group as ButtonGroup} from '../buttons'
import InnerDock from '../inner-dock'
import StackedPercentileSelector
  from '../../containers/stacked-percentile-selector'
import {Group, Slider} from '../input'
import Collapsible from '../collapsible'
import ProfileRequestEditor from './profile-request-editor'
import ScenarioApplicationError from './scenario-application-error'

import OpportunityDatasets from '../../modules/opportunity-datasets'

import type {
  LonLat,
  Modification,
  ProfileRequest,
  ReactSelectResult
} from '../../types'

type Bounds = {
  north: number,
  south: number,
  east: number,
  west: number
}

type Props = {
  bundleId: string,
  comparisonBundleId?: string,
  comparisonScenarioId?: string,
  comparisonVariant: number,
  isFetchingIsochrone: boolean,
  isochroneFetchStatusMessage?: string,
  isochroneLonLat?: LonLat,
  isShowingComparisonIsochrone: boolean,
  isShowingIsochrone: boolean,
  isShowingOpportunities: boolean,
  modifications: Modification[],
  profileRequest: ProfileRequest,
  projectId: string,
  projectBounds: Bounds,
  regionalAnalyses: Array<Bounds & {
      id: string,
      name: string,
      height: number,
      width: number,
      zoom: number
    }>,
  regionalAnalysisBounds?: Bounds,
  scenarioApplicationErrors?: Array<{}>,
  scenarioApplicationWarnings?: Array<{}>,
  scenarioId: string,
  scenarioName: string,
  scenarios: Array<{
    id: string,
    name: string,
    variants: string[]
  }>,
  variantIndex: number,
  variantName: string,
  variants: string[],
  workerVersion: string,

  addEditRegionalAnalysisBoundsLayerToMap(): void,
  addIsochroneLayerToMap(): void,
  addOpportunityLayerToMap(): void,
  clearIsochroneResults(): void,
  clearComparisonScenario(): void,
  createRegionalAnalysis: any => void,
  downloadComparisonIsochrone: () => void,
  downloadIsochrone: () => void,
  enterAnalysisMode(): void,
  exitAnalysisMode(): void,
  fetchTravelTimeSurface(): void,
  loadAllRegionalAnalyses: (projectId: string) => void,
  push(string): void,
  removeEditRegionalAnalysisBoundsLayerFromMap(): void,
  removeIsochroneLayerFromMap(): void,
  removeOpportunityLayerFromMap(): void,
  setActiveVariant(): void,
  setComparisonScenario(): void,
  setProfileRequest(): void,
  setRegionalAnalysisBounds(): void
}

type State = {
  creatingRegionalAnalysis: boolean,
  editingBounds: boolean,
  regionalAnalysisPercentile: number,
  regionalAnalysisName: void | string
}

/**
 * The side panel for single point analysis, including the stacked percentile plot.
 */
export default class SinglePointAnalysis extends Pure {
  props: Props
  state: State

  state = {
    creatingRegionalAnalysis: false,
    editingBounds: false,
    regionalAnalysisPercentile: 50,
    regionalAnalysisName: undefined
  }

  visible = true

  componentDidMount () {
    this.props.enterAnalysisMode()
    this.props.setActiveVariant(this.props.variantIndex)
    this.props.addIsochroneLayerToMap()
    this.props.addOpportunityLayerToMap()
    this.props.loadAllRegionalAnalyses(this.props.projectId)
    if (this.props.isochroneLonLat) {
      this.props.fetchTravelTimeSurface()
    }
  }

  componentWillUnmount () {
    this.props.exitAnalysisMode()
    this.props.removeIsochroneLayerFromMap()
    this.props.removeOpportunityLayerFromMap()
    this.props.clearIsochroneResults()
    // tag this component as having unmounted, so that if additional isochrones
    // come back (generally caused when someone exits analysis mode before the
    // cluster is initialized) they don't get displayed on the map. We are not
    // using state here because setState is async, so result could come back
    // between unmount and state update: https://facebook.github.io/react/docs/react-component.html#setstate
    this.visible = false
  }

  _createRegionalAnalysis = () => {
    const {regionalAnalyses} = this.props
    const name = window.prompt(
      'Enter a name and click ok to begin a regional analysis job for this scenario and settings:',
      `Analysis ${regionalAnalyses.length + 1}`
    )
    if (name && name.length > 0) {
      const {
        createRegionalAnalysis,
        profileRequest,
        projectBounds,
        regionalAnalysisBounds,
        variantIndex
      } = this.props
      const {regionalAnalysisPercentile} = this.state

      createRegionalAnalysis({
        bounds: regionalAnalysisBounds || projectBounds,
        name,
        profileRequest,
        travelTimePercentile: regionalAnalysisPercentile,
        variantId: variantIndex
      })
    }
  }

  setActiveVariant = (option: ReactSelectResult) => {
    if (option) {
      const index = parseInt(option.value)
      this.props.setActiveVariant(index)
      this.props.push(`/scenarios/${this.props.scenarioId}/analysis/${index}`)
    }
  }

  fetchTravelTimeSurface = () => {
    if (this.props.isochroneLonLat) {
      this.props.fetchTravelTimeSurface()
    }
  }

  /** show the regional analysis creation name box */
  prepareCreateRegionalAnalysis = () => {
    const {
      setRegionalAnalysisBounds,
      projectBounds,
      addEditRegionalAnalysisBoundsLayerToMap
    } = this.props
    setRegionalAnalysisBounds(projectBounds)
    addEditRegionalAnalysisBoundsLayerToMap()
    this.setState({creatingRegionalAnalysis: true})
  }

  _showBoundsSelector = () => {
    const {
      setRegionalAnalysisBounds,
      projectBounds,
      addEditRegionalAnalysisBoundsLayerToMap
    } = this.props
    setRegionalAnalysisBounds(projectBounds)
    addEditRegionalAnalysisBoundsLayerToMap()
    this.setState({editingBounds: true})
  }

  _hideBoundsSelector = () => {
    this.props.removeEditRegionalAnalysisBoundsLayerFromMap()
    this.setState({editingBounds: false})
  }

  setRegionalAnalysisPercentile = (e: Event & {target: HTMLInputElement}) =>
    this.setState({regionalAnalysisPercentile: Number(e.target.value)})

  setRegionalAnalysisBounds = (e: {value: string}) => {
    const {
      setRegionalAnalysisBounds,
      projectBounds,
      regionalAnalyses
    } = this.props

    if (e.value === '__PROJECT') {
      setRegionalAnalysisBounds(projectBounds)
    } else if (regionalAnalyses) {
      const foundAnalyses = regionalAnalyses.find(r => r.id === e.value)
      if (foundAnalyses) {
        setRegionalAnalysisBounds(webMercatorBoundsToGeographic(foundAnalyses))
      }
    }
  }

  render () {
    const {
      downloadComparisonIsochrone,
      downloadIsochrone,
      isFetchingIsochrone,
      isochroneFetchStatusMessage,
      isShowingComparisonIsochrone,
      isShowingIsochrone,
      profileRequest,
      scenarioApplicationErrors,
      scenarioApplicationWarnings,
      setProfileRequest,
      variantIndex,
      variants
    } = this.props
    const {regionalAnalysisPercentile, creatingRegionalAnalysis} = this.state
    const disableInputs = !!isFetchingIsochrone || !!scenarioApplicationErrors

    return (
      <div>
        <div className='ApplicationDockTitle'>
          <Icon type='area-chart' /> Analysis

          <Button
            className='pull-right'
            disabled={disableInputs}
            onClick={this.fetchTravelTimeSurface}
            style='primary'
          >
            <Icon
              type='refresh'
              className={isFetchingIsochrone ? 'fa-spin' : ''}
            />
            {' '}
            {isFetchingIsochrone
              ? messages.analysis.fetchStatus[isochroneFetchStatusMessage]
              : messages.analysis.refresh}
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
            {messages.analysis.newRegionalAnalysis}
          </Button>
        </div>

        <InnerDock>
          <div className='block'>
            {scenarioApplicationWarnings != null &&
              scenarioApplicationWarnings.length > 0 &&
              <div className='alert alert-warning'>
                <Collapsible
                  title={
                    <span className='text-warning'>
                      <Icon type='exclamation-circle' />&nbsp;
                      {messages.analysis.warningsInScenario}
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
                  {messages.analysis.errorsInScenario}
                </strong>
                <br />
                <ScenarioApplicationErrors errors={scenarioApplicationErrors} />
              </div>}

            <div className='row'>
              <Group label={messages.common.scenario} className='col-xs-6'>
                <Select
                  clearable={false}
                  disabled={isFetchingIsochrone}
                  options={variants.map((v, index) => ({
                    label: v,
                    value: index
                  }))}
                  value={variantIndex}
                  onChange={this.setActiveVariant}
                />
              </Group>

              <Group label={messages.analysis.grid} className='col-xs-6'>
                <OpportunityDatasets.components.Selector />
              </Group>
            </div>

            {this.renderComparisonSelect()}
          </div>

          <StackedPercentileSelector />

          <div className='block'>
            <ButtonGroup justified>
              <Button
                disabled={!isShowingIsochrone}
                onClick={downloadIsochrone}
                style='info'
                ><Icon type='download' /> Isochrone as GeoJSON
              </Button>
              <Button
                disabled={!isShowingComparisonIsochrone}
                onClick={downloadComparisonIsochrone}
                style='info'
                ><Icon type='download' /> Comparison Isochrone as GeoJSON
              </Button>
            </ButtonGroup>

            <BookmarkChooser />
            <ProfileRequestEditor
              disabled={disableInputs}
              profileRequest={profileRequest}
              setProfileRequest={setProfileRequest}
            />

            {this.renderRegionalAnalysisBoundsSelector(disableInputs)}

            {/*
              * A slider for selecting the percentile to use in a regional analysis.
              * This will eventually be moved into analysis settings once we can calculate multiple
              * percentiles in single point mode.
              */}
            <Slider
              disabled={disableInputs}
              value={regionalAnalysisPercentile}
              output
              format='.1f'
              min={1}
              max={99}
              step={1}
              label={`${messages.analysis.travelTimePercentile} -- Regional analysis only`}
              onChange={this.setRegionalAnalysisPercentile}
            />
          </div>
        </InnerDock>
      </div>
    )
  }

  /** Render the dropdown box that allows selecting regional analysis bounds */
  renderRegionalAnalysisBoundsSelector (disableInputs: boolean) {
    const {regionalAnalysisBounds, projectBounds, regionalAnalyses} = this.props

    // figure out which is selected
    let selected
    if (
      !regionalAnalysisBounds ||
      boundsEqual(regionalAnalysisBounds, projectBounds)
    ) {
      selected = '__PROJECT' // special value
    } else {
      const selectedAnalysis = regionalAnalyses.find(r =>
        boundsEqual(webMercatorBoundsToGeographic(r), regionalAnalysisBounds)
      )

      if (selectedAnalysis != null) selected = selectedAnalysis.id
      else selected = '__CUSTOM'
    }

    const options = [
      {value: '__PROJECT', label: messages.analysis.regionalBoundsProject},
      ...regionalAnalyses.map(({name, id}) => ({
        value: id,
        label: sprintf(messages.analysis.regionalBoundsSame, name)
      }))
    ]

    if (selected === '__CUSTOM') {
      // Don't allow the user to select 'Custom' - to make custom bounds, just drag the map markers
      options.push({
        value: '__CUSTOM',
        label: messages.analysis.regionalBoundsCustom,
        disabled: true
      })
    }

    const {editingBounds} = this.state

    return (
      <Group label={messages.analysis.regionalBounds}>
        <div className='row'>
          <div className='col-xs-6'>
            <Select
              clearable={false}
              disabled={disableInputs}
              value={selected}
              options={options}
              onChange={this.setRegionalAnalysisBounds}
            />
          </div>
          <div className='col-xs-6'>
            {editingBounds
              ? <Button
                block
                onClick={this._hideBoundsSelector}
                style='warning'
                >
                <Icon type='stop' /> Stop editing bounds
                </Button>
              : <Button
                disabled={disableInputs}
                block
                onClick={this._showBoundsSelector}
                style='warning'
                >
                <Icon type='pencil' /> Set custom geographic bounds
                </Button>}
          </div>
        </div>
      </Group>
    )
  }

  _setComparisonScenario = (result: ReactSelectResult) => {
    const {
      clearComparisonScenario,
      scenarios,
      setComparisonScenario
    } = this.props
    if (result) {
      // since the comparison is clearable
      const id = result.value
      setComparisonScenario({
        ...scenarios.find(s => s.id === id),
        variantIndex: -1
      })
    } else {
      clearComparisonScenario()
      this.fetchTravelTimeSurface()
    }
  }

  setComparisonVariant = (e: ReactSelectResult) => {
    const {scenarios, comparisonScenarioId, setComparisonScenario} = this.props
    const scenario = scenarios.find(s => s.id === comparisonScenarioId)
    if (e) {
      setComparisonScenario({...scenario, variantIndex: e.value})
    }
  }

  /** render the text boxes to choose a comparison scenario and variant */
  renderComparisonSelect () {
    const {
      comparisonScenarioId,
      comparisonVariant,
      isFetchingIsochrone,
      scenarios
    } = this.props

    const scenarioOptions = scenarios.map(s => {
      return {value: s.id, label: s.name}
    })
    const chosenScenario = scenarios.find(s => s.id === comparisonScenarioId)

    const variantOptions = chosenScenario != null
      ? [
          // special value -1 indicates no modifications
          {label: messages.analysis.baseline, value: -1},
        ...chosenScenario.variants.map((label, value) => {
          return {label, value}
        })
      ]
      : []

    return (
      <div className='row'>
        <Group label={messages.analysis.comparison + ' ' + messages.common.project} className='col-xs-6'>
          <Select
            disabled={isFetchingIsochrone}
            name={messages.common.project}
            onChange={this._setComparisonScenario}
            options={scenarioOptions}
            placeholder={messages.analysis.selectComparisonScenario}
            value={comparisonScenarioId}
          />
        </Group>

        <Group label={messages.analysis.comparison + ' ' + messages.common.scenario} className='col-xs-6'>
          <Select
            disabled={!comparisonScenarioId}
            clearable={false}
            name={messages.common.scenario}
            onChange={this.setComparisonVariant}
            options={variantOptions}
            placeholder={messages.analysis.selectComparisonScenarioVariant}
            value={comparisonVariant}
          />
        </Group>
      </div>
    )
  }
}

function ScenarioApplicationErrors ({errors}) {
  /** Render any errors that may have occurred applying the scenario */
  return (
    <div>
      {errors.map((err, idx) => (
        <ScenarioApplicationError error={err} key={`err-${idx}`} />
      ))}
    </div>
  )
}

/** Convert web mercator bounds from a regional analysis to geographic bounds */
function webMercatorBoundsToGeographic ({
  north,
  west,
  width,
  height,
  zoom
}: {
  north: number,
  west: number,
  height: number,
  width: number,
  zoom: number
}) {
  const nw = LeafletMap.prototype.unproject([west + 1, north], zoom)
  const se = LeafletMap.prototype.unproject(
    [west + width + 1, north + height],
    zoom
  )
  return {
    north: nw.lat,
    south: se.lat,
    east: se.lng,
    west: nw.lng
  }
}

function boundsEqual (b0, b1, epsilon = 1e-6) {
  return (
    Math.abs(b0.north - b1.north) < epsilon &&
    Math.abs(b0.west - b1.west) < epsilon &&
    Math.abs(b0.east - b1.east) < epsilon &&
    Math.abs(b0.south - b1.south) < epsilon
  )
}

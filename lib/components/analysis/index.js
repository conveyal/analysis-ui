/**
 * The side panel for single point analysis, including the spectrogram.
 */

import {format} from 'd3-format'
import {Map as LeafletMap} from 'leaflet'
import React, { Component, PropTypes } from 'react'
import {Link} from 'react-router'
import Select from 'react-select'
import {sprintf} from 'sprintf-js'

import BookmarkChooser from '../../containers/bookmark-chooser'
import messages from '../../utils/messages'
import Histogram from './histogram'
import Regional from './regional-analysis-selector'
import convertToR5Modification from '../../utils/convert-to-r5-modification'
import {Button} from '../buttons'
import SpectrogramSelector from './spectrogram-selector'
import Icon from '../icon'
import {Group, Text, Checkbox} from '../input'
import Collapsible from '../collapsible'
import ProfileRequestEditor from './profile-request-editor'
import ScenarioApplicationError from './scenario-application-error'

export default class SinglePointAnalysis extends Component {
  static propTypes = {
    accessibility: PropTypes.number,
    bundleId: PropTypes.string.isRequired,
    comparisonAccessibility: PropTypes.number,
    comparisonBundleId: PropTypes.string,
    comparisonInProgress: PropTypes.bool.isRequired,
    comparisonScenarioId: PropTypes.string,
    comparisonSpectrogramData: PropTypes.array,
    comparisonVariant: PropTypes.number,
    currentIndicator: PropTypes.string,
    indicators: PropTypes.array.isRequired,
    isFetchingIsochrone: PropTypes.bool.isRequired,
    isochroneCutoff: PropTypes.number.isRequired,
    isochroneFetchStatusMessage: PropTypes.string,
    isochroneLonLat: PropTypes.object.isRequired,
    isShowingIsochrone: PropTypes.bool.isRequired,
    isShowingOpportunities: PropTypes.bool.isRequired,
    modifications: PropTypes.array.isRequired,
    profileRequest: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    projectBounds: PropTypes.string.isRequired,
    regionalAnalyses: PropTypes.array,
    regionalAnalysisBounds: PropTypes.shape({
      north: PropTypes.number,
      south: PropTypes.number,
      east: PropTypes.number,
      west: PropTypes.number
    }),
    scenarioApplicationErrors: PropTypes.array,
    scenarioApplicationWarnings: PropTypes.array,
    scenarioId: PropTypes.string.isRequired,
    scenarioName: PropTypes.string.isRequired,
    spectrogramData: PropTypes.array,
    variantIndex: PropTypes.number.isRequired,
    variantName: PropTypes.string.isRequired,
    workerVersion: PropTypes.string.isRequired,

    addEditRegionalAnalysisBoundsLayerToMap: PropTypes.func.isRequired,
    addIsochroneLayerToMap: PropTypes.func.isRequired,
    addOpportunityLayerToMap: PropTypes.func.isRequired,
    clearIsochroneResults: PropTypes.func.isRequired,
    deleteRegionalAnalysis: PropTypes.func.isRequired,
    enterAnalysisMode: PropTypes.func.isRequired,
    exitAnalysisMode: PropTypes.func.isRequired,
    fetchIsochrone: PropTypes.func.isRequired,
    loadRegionalAnalyses: PropTypes.func.isRequired,
    removeEditRegionalAnalysisBoundsLayerFromMap: PropTypes.func.isRequired,
    removeIsochroneLayerFromMap: PropTypes.func.isRequired,
    removeOpportunityLayerFromMap: PropTypes.func.isRequired,
    runAnalysis: PropTypes.func.isRequired,
    selectRegionalAnalysis: PropTypes.func.isRequired,
    setActiveVariant: PropTypes.func.isRequired,
    setComparisonInProgress: PropTypes.func.isRequired,
    setComparisonScenario: PropTypes.func.isRequired,
    setCurrentIndicator: PropTypes.func.isRequired,
    setIsochroneCutoff: PropTypes.func.isRequired,
    setProfileRequest: PropTypes.func.isRequired,
    setRegionalAnalysisBounds: PropTypes.func.isRequired
  }

  state = {}

  visible = true

  /** signal the UI to make a wider sidebar for analysis mode */
  componentWillMount () {
    this.props.enterAnalysisMode()
    this.props.setActiveVariant(this.props.variantIndex)
  }

  componentWillUnmount () {
    this.props.exitAnalysisMode()
    if (this.props.isShowingIsochrone) this.props.removeIsochroneLayerFromMap()
    if (this.props.isShowingOpportunities) this.props.removeOpportunityLayerFromMap()
    this.props.clearIsochroneResults()
    // tag this component as having unmounted, so that if additional isochrones come back (generally
    // caused when someone exits analysis mode before the cluster is initialized) they don't get
    // displayed on the map.
    // not using state here because setState is async, so result could come back between unmount and
    // state update: https://facebook.github.io/react/docs/react-component.html#setstate
    this.visible = false
  }

  componentDidMount () {
    const { currentIndicator, indicators } = this.props
    if (currentIndicator || indicators.length > 0) {
      const chosenIndicator = currentIndicator || indicators[0].key
      this.fetchIsochrone({ chosenIndicator })
    }
  }

  changeIndicator = (e) => {
    this.fetchIsochrone({ chosenIndicator: e.value })
  }

  /** run a new query */
  runAnalysis = (e) => {
    const {
      bundleId,
      currentIndicator,
      isochroneCutoff,
      modifications,
      profileRequest,
      regionalAnalysisBounds,
      removeEditRegionalAnalysisBoundsLayerFromMap,
      runAnalysis,
      scenarioId,
      variantIndex,
      workerVersion
    } = this.props

    removeEditRegionalAnalysisBoundsLayerFromMap()

    const {north, south, east, west} = regionalAnalysisBounds

    runAnalysis({
      name: this.state.regionalAnalysisName,
      workerVersion,
      bundleId,
      grid: currentIndicator,
      cutoffMinutes: isochroneCutoff,
      scenarioId,
      variant: variantIndex,
      bounds: {
        type: 'Polygon',
        coordinates: [[
          [west, north],
          [east, north],
          [east, south],
          [west, south],
          [west, north]
        ]]
      },
      request: {
        ...profileRequest,
        scenario: {
          modifications: modifications.map(convertToR5Modification)
        }
      }
    })

    this.setState({...this.state, regionalAnalysisName: undefined, creatingRegionalAnalysis: false})
  }

  setIsochroneCutoff = (chosenCutoff) => {
    this.fetchIsochrone({ chosenCutoff })
  }

  fetchIsochrone = ({ chosenIndicator, chosenCutoff }) => {
    const {
      projectId,
      scenarioId,
      comparisonInProgress,
      bundleId,
      modifications,
      isochroneCutoff,
      fetchIsochrone,
      isochroneLonLat,
      currentIndicator,
      workerVersion,
      variantIndex,
      comparisonVariant,
      comparisonScenarioId,
      comparisonBundleId,
      comparisonModifications,
      profileRequest
    } = this.props

    // leave comparison params undefined unless we're doing a comparison
    const comparisonParams = comparisonInProgress
      ? {
        comparisonScenarioId: `${comparisonScenarioId}_${comparisonVariant}`,
        comparisonModifications: comparisonModifications,
        comparisonBundleId: comparisonBundleId
      }
      : {}

    fetchIsochrone({
      scenarioId: `${scenarioId}_${variantIndex}`,
      workerVersion,
      projectId,
      bundleId,
      modifications,
      isochroneCutoff: chosenCutoff || isochroneCutoff,
      origin: isochroneLonLat,
      indicator: chosenIndicator || currentIndicator,
      profileRequest,
      ...comparisonParams,
      next: this.displayIsochroneResults
    })
  }

  displayIsochroneResults = (e) => {
    const {addIsochroneLayerToMap, addOpportunityLayerToMap} = this.props
    if (this.visible) { // make sure that the component hasn't been unmounted
      addIsochroneLayerToMap()
      addOpportunityLayerToMap()
    }
  }

  toggleComparison = (e) => this.props.setComparisonInProgress(!this.props.comparisonInProgress)

  /** show the regional analysis creation name box */
  prepareCreateRegionalAnalysis = (e) => {
    const {setRegionalAnalysisBounds, projectBounds, addEditRegionalAnalysisBoundsLayerToMap} = this.props
    setRegionalAnalysisBounds(projectBounds)
    addEditRegionalAnalysisBoundsLayerToMap()
    this.setState({...this.state, creatingRegionalAnalysis: true})
  }

  setRegionalAnalysisName = (e) => this.setState({...this.state, regionalAnalysisName: e.target.value})

  setRegionalAnalysisBounds = (e) => {
    const { setRegionalAnalysisBounds, projectBounds, regionalAnalyses } = this.props

    if (e.value === '__PROJECT') setRegionalAnalysisBounds(projectBounds)
    else setRegionalAnalysisBounds(webMercatorBoundsToGeographic(regionalAnalyses.find(r => r.id === e.value)))
  }

  /** Render the results of an analysis */
  renderResults () {
    const {
      comparisonSpectrogramData,
      comparisonScenarioId,
      comparisonVariant,
      scenarios,
      currentIndicator,
      indicators,
      scenarioName,
      variantName,
      isochroneCutoff,
      accessibility,
      comparisonAccessibility,
      comparisonInProgress,
      spectrogramData,
      isFetchingIsochrone
    } = this.props

    const indicatorName = currentIndicator != null ? indicators.find(i => i.key === currentIndicator).name : undefined

    let comparisonScenarioName

    if (comparisonSpectrogramData) {
      const comparisonScenario = scenarios.find(s => s.id === comparisonScenarioId)
      // variant -1 indicates no modifications, just use the raw bundle
      const variantName = comparisonVariant === -1
        ? messages.analysis.baseline
        : comparisonScenario.variants[comparisonVariant]
      comparisonScenarioName = `${comparisonScenario.name}: ${variantName}`
    }

    const commaFormat = format(',d')

    return <div>
      <div>
        {sprintf(messages.analysis.accessibility, {
          name: `${scenarioName}: ${variantName}`,
          indicator: indicatorName,
          cutoff: isochroneCutoff,
          number: commaFormat(accessibility)
        })}
      </div>

      {comparisonInProgress && comparisonAccessibility != null && currentIndicator && <div>
        {sprintf(messages.analysis.accessibility, {
          name: comparisonScenarioName,
          indicator: indicatorName,
          cutoff: isochroneCutoff,
          number: commaFormat(comparisonAccessibility)
        })}
        </div>}

      {spectrogramData && <div>
        <SpectrogramSelector
          spectrogramData={spectrogramData}
          comparisonSpectrogramData={comparisonSpectrogramData}
          scenarioName={`${scenarioName}: ${variantName}`}
          comparisonScenarioName={comparisonScenarioName}
          isochroneCutoff={isochroneCutoff}
          setIsochroneCutoff={this.setIsochroneCutoff}
          indicatorName={indicatorName}
          isFetchingIsochrone={isFetchingIsochrone}
          />

        <Histogram
          data={spectrogramData}
          comparisonData={comparisonSpectrogramData}
          width={600}
          height={250}
          isochroneCutoff={isochroneCutoff}
          isFetchingIsochrone={isFetchingIsochrone}
          />
      </div>}
    </div>
  }

  render () {
    const {
      accessibility,
      comparisonInProgress,
      currentIndicator,
      deleteRegionalAnalysis,
      indicators,
      isFetchingIsochrone,
      isochroneFetchStatusMessage,
      loadRegionalAnalyses,
      profileRequest,
      projectId,
      regionalAnalyses,
      scenarioApplicationErrors,
      scenarioApplicationWarnings,
      scenarioId,
      selectRegionalAnalysis,
      setProfileRequest,
      spectrogramData,
      variantName
    } = this.props

    const { regionalAnalysisName, creatingRegionalAnalysis } = this.state

    return (
      <div>
        <div className='DockTitle'>Variant: {variantName}
          <span className='pull-right'>
            <small>
              {isFetchingIsochrone && isochroneFetchStatusMessage && messages.analysis.fetchStatus[isochroneFetchStatusMessage]}
            </small>

            <button
              className='btn btn-link'
              disabled={isFetchingIsochrone}
              onClick={this.fetchIsochrone}>
              {!isFetchingIsochrone && messages.analysis.refresh}&nbsp;
              <Icon type='refresh' className={isFetchingIsochrone ? 'fa-spin' : ''} />
            </button>
          </span>
        </div>

        <div className='block'>
          <Collapsible title={messages.analysis.settings}>
            <BookmarkChooser />
            <ProfileRequestEditor
              profileRequest={profileRequest}
              setProfileRequest={setProfileRequest}
              />
          </Collapsible>

          <Group id='select-analysis-indicator'>
            <Select
              id='select-analysis-indicator'
              name={messages.analysis.indicator}
              options={indicators.map(({ name, key }) => { return { value: key, label: name } })}
              onChange={this.changeIndicator}
              placeholder='Select a grid...'
              value={currentIndicator}
              width={600}
              />
          </Group>
          <Link
            className='btn btn-success btn-block'
            to={`/projects/${projectId}/grids/create`}
            ><Icon type='upload' /> Create a new grid
          </Link>

          <Checkbox
            label={messages.analysis.compare}
            checked={this.state.comparison}
            onChange={this.toggleComparison}
            />

          {comparisonInProgress && this.renderComparisonSelect()}

          {scenarioApplicationWarnings != null && scenarioApplicationWarnings.length > 0 &&
            <Collapsible
              title={<span className='text-warning'>
                <Icon type='exclamation-circle' />&nbsp;
                {messages.analysis.warningsInScenario}
              </span>}>
              <ScenarioApplicationErrors errors={scenarioApplicationWarnings} />
            </Collapsible>
          }

          {accessibility != null && currentIndicator && spectrogramData && this.renderResults()}

          {scenarioApplicationErrors != null && scenarioApplicationErrors.length > 0 &&
            <div>
              <h3>{messages.analysis.errorsInScenario}</h3>
              <ScenarioApplicationErrors errors={scenarioApplicationErrors} />
            </div>}
        </div>

        <div className='DockTitle'>{messages.analysis.regionalAnalyses}</div>
        <div className='block'>
          {spectrogramData && !creatingRegionalAnalysis &&
            <Button style='success' block onClick={this.prepareCreateRegionalAnalysis}>
              <Icon type='plus' />{messages.analysis.newRegionalAnalysis}
            </Button>
          }

          {spectrogramData && creatingRegionalAnalysis &&
            <form>
              <Text
                value={regionalAnalysisName}
                label={messages.analysis.regionalAnalysisName}
                onChange={this.setRegionalAnalysisName}
                />
              {this.renderRegionalAnalysisBoundsSelector()}
              <Button
                type='submit'
                style='success'
                onClick={this.runAnalysis}
                disabled={regionalAnalysisName == null || regionalAnalysisName === ''}
                aria-label={messages.analysis.startRegionalAnalysis}
                >
                <Icon type='check' />
              </Button>
            </form>
          }

          <Regional
            scenarioId={scenarioId}
            projectId={projectId}
            regionalAnalyses={regionalAnalyses}
            loadRegionalAnalyses={loadRegionalAnalyses}
            selectRegionalAnalysis={selectRegionalAnalysis}
            deleteRegionalAnalysis={deleteRegionalAnalysis}
            />
        </div>
      </div>
    )
  }

  /** Render the dropdown box that allows selecting regional analysis bounds */
  renderRegionalAnalysisBoundsSelector () {
    const {regionalAnalysisBounds, projectBounds, regionalAnalyses} = this.props

    if (!regionalAnalysisBounds) return null

    // figure out which is selected
    let selected
    if (boundsEqual(regionalAnalysisBounds, projectBounds)) {
      selected = '__PROJECT' // special value
    } else {
      const selectedAnalysis = regionalAnalyses
        .find(r => boundsEqual(webMercatorBoundsToGeographic(r), regionalAnalysisBounds))

      if (selectedAnalysis != null) selected = selectedAnalysis.id
      else selected = '__CUSTOM'
    }

    const options = [
      { value: '__PROJECT', label: messages.analysis.regionalBoundsProject },
      ...regionalAnalyses.map(({name, id}) =>
        ({ value: id, label: sprintf(messages.analysis.regionalBoundsSame, name) }))
    ]

    if (selected === '__CUSTOM') {
      // Don't allow the user to select 'Custom' - to make custom bounds, just drag the map markers
      options.push({
        value: '__CUSTOM',
        label: messages.analysis.regionalBoundsCustom,
        disabled: true
      })
    }

    return <Group label={messages.analysis.regionalBounds}>
      <Select
        value={selected}
        options={options}
        onChange={this.setRegionalAnalysisBounds}
      />
    </Group>
  }

  setComparisonScenario = (e) => {
    const { scenarios, setComparisonScenario } = this.props
    // reset variant to the baseline
    const scenario = scenarios.find(s => s.id === e.value)
    setComparisonScenario(scenario, -1)
  }

  setComparisonVariant = (e) => {
    const { scenarios, comparisonScenarioId, setComparisonScenario } = this.props
    const scenario = scenarios.find(s => s.id === comparisonScenarioId)
    setComparisonScenario(scenario, e.value)
  }

  /** render the text boxes to choose a comparison scenario and variant */
  renderComparisonSelect () {
    const {scenarios, comparisonScenarioId, comparisonVariant} = this.props

    const scenarioOptions = scenarios.map(s => { return { value: s.id, label: s.name } })
    const chosenScenario = scenarios.find(s => s.id === comparisonScenarioId)
    const variantOptions = chosenScenario != null
      ? [
        // special value -1 indicates no modifications
        { label: messages.analysis.baseline, value: -1 },
        ...chosenScenario.variants.map((label, value) => { return { label, value } })
      ]
      : []

    return (
      <div>
        <Select
          name={messages.common.scenario}
          onChange={this.setComparisonScenario}
          options={scenarioOptions}
          placeholder='Select comparison scenario...'
          value={comparisonScenarioId}
          />

        <Select
          name={messages.common.variant}
          onChange={this.setComparisonVariant}
          options={variantOptions}
          placeholder='Select comparison scenario variant...'
          value={comparisonVariant}
          />
      </div>
    )
  }
}

function ScenarioApplicationErrors ({errors}) {
  /** Render any errors that may have occurred applying the scenario */
  return (
    <div>
      {errors.map((err, idx) =>
        <ScenarioApplicationError error={err} key={`err-${idx}`} />)}
    </div>
  )
}

/** Convert web mercator bounds from a regional analysis to geographic bounds */
function webMercatorBoundsToGeographic ({ north, west, width, height, zoom }) {
  const nw = LeafletMap.prototype.unproject([west, north], zoom)
  const se = LeafletMap.prototype.unproject([west + width, north + height], zoom)
  return {
    north: nw.lat,
    south: se.lat,
    east: se.lng,
    west: nw.lng
  }
}

function boundsEqual (b0, b1, epsilon = 1e-6) {
  return Math.abs(b0.north - b1.north) < epsilon &&
    Math.abs(b0.west - b1.west) < epsilon &&
    Math.abs(b0.east - b1.east) < epsilon &&
    Math.abs(b0.south - b1.south) < epsilon
}

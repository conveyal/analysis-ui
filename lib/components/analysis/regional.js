/** Show progress of regional analysis, and allow displaying a regional analysis on the map */

import React, { Component, PropTypes } from 'react'
import Select from 'react-select'
import Icon from '../icon'
import {Group as FormGroup} from '../input'
import messages from '../../utils/messages'
import authenticatedFetch from '../../utils/authenticated-fetch'
import colors from '../../constants/colors'
import Legend from './legend'
import {sprintf} from 'sprintf-js'

const REFETCH_INTERVAL = 5 * 1000

export default class RegionalAnalysis extends Component {
  static propTypes = {
    regionalAnalyses: PropTypes.array,
    scenarioId: PropTypes.string.isRequired,
    variantIndex: PropTypes.number.isRequired,
    breaks: PropTypes.array,
    grid: PropTypes.object,
    differenceGrid: PropTypes.object,
    load: PropTypes.func.isRequired,
    setActiveRegionalAnalysis: PropTypes.func.isRequired,
    addRegionalAnalysisLayerToMap: PropTypes.func.isRequired,
    removeRegionalAnalysisLayerFromMap: PropTypes.func.isRequired,
    addRegionalComparisonLayerToMap: PropTypes.func.isRequired,
    removeRegionalComparisonLayerFromMap: PropTypes.func.isRequired,
    activeRegionalAnalysis: PropTypes.string,
    comparisonRegionalAnalysis: PropTypes.string,
    regionalAnalysisLayerOnMap: PropTypes.bool.isRequired,
    regionalComparisonLayerOnMap: PropTypes.bool.isRequired,
    minimumImprovementProbability: PropTypes.number.isRequired,
    setMinimumImprovementProbability: PropTypes.func.isRequired
  }

  componentWillMount () {
    this.props.load()
    this.interval = window.setInterval(this.fetch, REFETCH_INTERVAL)
  }

  componentWillUnmount () {
    window.clearInterval(this.interval)
  }

  downloadGeotiff = async (id, comparisonId) => {
    const url = comparisonId
      ? `/api/regional/${comparisonId}/${id}/tiff?redirect=false`
      : `/api/regional/${id}/grid/mean/tiff?redirect=false`
    const res = await authenticatedFetch(url).then(res => res.json())

    window.open(res.url)
  }

  fetch = () => {
    const { regionalAnalyses, load, scenarioId, variantIndex } = this.props
    if (regionalAnalyses == null) return
    const displayAnalyses = regionalAnalyses.filter(q => q.scenarioId === scenarioId && q.variant === variantIndex)
    if (displayAnalyses.findIndex(q => !q.complete) > -1) load()
  }

  selectRegionalAnalysis = (id, comparisonId) => {
    const {regionalAnalysisLayerOnMap, addRegionalAnalysisLayerToMap, removeRegionalAnalysisLayerFromMap, setActiveRegionalAnalysis, removeIsochroneLayerFromMap, removeOpportunityLayerFromMap, addIsochroneLayerToMap, addOpportunityLayerToMap, addRegionalComparisonLayerToMap, removeRegionalComparisonLayerFromMap, regionalComparisonLayerOnMap} = this.props

    setActiveRegionalAnalysis({ id, comparisonId, percentile: 'mean' })

    if (id == null) {
      if (regionalAnalysisLayerOnMap || regionalComparisonLayerOnMap) {
        removeRegionalAnalysisLayerFromMap()
        removeRegionalComparisonLayerFromMap()
        addIsochroneLayerToMap()
        addOpportunityLayerToMap()
      }
    } else {
      if (!regionalAnalysisLayerOnMap && comparisonId == null) {
        removeIsochroneLayerFromMap()
        removeOpportunityLayerFromMap()
        removeRegionalComparisonLayerFromMap()
        addRegionalAnalysisLayerToMap()
      } else if (!regionalComparisonLayerOnMap && comparisonId != null) {
        removeIsochroneLayerFromMap()
        removeOpportunityLayerFromMap()
        removeRegionalAnalysisLayerFromMap()
        addRegionalComparisonLayerToMap()
      }
    }
  }

  render () {
    const { variantIndex, scenarioId, regionalAnalyses } = this.props

    if (regionalAnalyses == null) return <ul />

    const displayAnalyses = regionalAnalyses.filter(a => a.scenarioId === scenarioId && a.variant === variantIndex)
    displayAnalyses.sort(compareAnalyses)

    return <ul className='list-group'>
      {displayAnalyses.map(a => this.renderAnalysis(a))}
    </ul>
  }

  renderAnalysis (analysis) {
    const complete = analysis.status == null || analysis.status.complete === analysis.status.total

    let percentage = complete ? 100 : analysis.status.complete / analysis.status.total * 100

    const {
      breaks,
      activeRegionalAnalysis,
      comparisonRegionalAnalysis,
      regionalAnalyses,
      minimumImprovementProbability,
      setMinimumImprovementProbability,
      grid,
      differenceGrid
    } = this.props

    let shown = activeRegionalAnalysis === analysis.id

    const comparisons = regionalAnalyses.map(({ name, id }) => { return { label: name, value: id } })
    comparisons.sort(compareAnalyses)

    return <li className='list-group-item'>
      {analysis.name}
      {!complete && <span>
        <div className='progress'>
          <div
            className='progress-bar'
            ariaValuenow={percentage}
            ariaValuemin={0}
            ariaValuemax={100}
            style={{ width: `${percentage}%`, minWidth: '2em' }}
            >
            {Math.round(percentage)}%
          </div>
        </div>
        <small>{analysis.status.complete} of {analysis.status.total} complete</small>
      </span>}

      {complete && <span className='pull-right'>
        <a
          onClick={e => this.downloadGeotiff(analysis.id)}
          title='Download GeoTIFF'
          ><Icon type='download' /></a>
        <a
          className={`ShowOnMap ${shown ? 'active' : 'dim'} fa-btn`}
          // call with null ID to hide layer
          onClick={e => this.selectRegionalAnalysis(shown ? null : analysis.id)}
          title='Toggle map display'
          role='checkbox'
          ariaChecked={shown}
          ><Icon type={shown ? 'eye' : 'eye-slash'} /></a>
      </span>}

      {shown && <div>
        <Select
          options={comparisons}
          value={comparisonRegionalAnalysis}
          onChange={(e) => this.selectRegionalAnalysis(analysis.id, e === null ? null : e.value)}
          />
        </div>}

      {comparisonRegionalAnalysis && shown && <FormGroup>
        <label>
          {messages.analysis.improvementProbability}
          <input
            type='range'
            id='improvementProbabilitySlider'
            min={0}
            max={1}
            step={0.01}
            value={minimumImprovementProbability}
            onChange={(e) => setMinimumImprovementProbability(parseFloat(e.target.value))}
            />
        </label>

        <output for='improvementProbabilitySlider'>
          {sprintf(messages.analysis.probabilityImprovement, minimumImprovementProbability)}
        </output>

        <a
          onClick={e => this.downloadGeotiff(analysis.id, comparisonRegionalAnalysis)}
          title='Download comparison GeoTIFF'
          ><Icon type='download' /></a>
      </FormGroup>}

      { shown && <Legend
        breaks={breaks}
        min={comparisonRegionalAnalysis ? differenceGrid.min : grid.min}
        colors={comparisonRegionalAnalysis
          ? colors.REGIONAL_COMPARISON_GRADIENT
          : colors.REGIONAL_GRADIENT} /> }
    </li>
  }
}

/** Compare regional analysis by name */
function compareAnalyses (a, b) {
  if (a.name === b.name) return 0
  else if (a.name == null || a.name < b.name) return -1
  else return 1
}

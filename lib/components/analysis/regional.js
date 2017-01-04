/** render a regional analysis */

import React, { Component, PropTypes } from 'react'
import Legend from './legend'
import colors from '../../constants/colors'
import messages from '../../utils/messages'
import ProfileRequestDisplay from './profile-request-display'
import Select from 'react-select'
import Collapsible from '../collapsible'
import {sprintf} from 'sprintf-js'
import {Slider} from '../input'
import Icon from '../icon'
import authenticatedFetch from '../../utils/authenticated-fetch'

export default class RegionalAnalysis extends Component {
  static propTypes = {
    regionalAnalyses: PropTypes.array,
    projectId: PropTypes.string,
    // can be null when loading
    analysis: PropTypes.object,
    analysisId: PropTypes.string.isRequired,
    indicators: PropTypes.array.isRequired,
    comparisonAnalysis: PropTypes.object,
    minimumImprovementProbability: PropTypes.number.isRequired,
    grid: PropTypes.object,
    differenceGrid: PropTypes.object,
    breaks: PropTypes.array,
    setActiveRegionalAnalysis: PropTypes.func.isRequired,
    setMinimumImprovementProbability: PropTypes.func.isRequired,
    addRegionalAnalysisLayerToMap: PropTypes.func.isRequired,
    removeRegionalAnalysisLayerFromMap: PropTypes.func.isRequired,
    addRegionalComparisonLayerToMap: PropTypes.func.isRequired,
    removeRegionalComparisonLayerFromMap: PropTypes.func.isRequired,
    addIsochroneLayerToMap: PropTypes.func.isRequired,
    loadRegionalAnalyses: PropTypes.func.isRequired
  }

  componentWillMount () {
    const { analysis, analysisId, setActiveRegionalAnalysis, addRegionalAnalysisLayerToMap, loadRegionalAnalyses, projectId } = this.props
    if (analysis == null) {
      loadRegionalAnalyses(projectId)
    }

    setActiveRegionalAnalysis({ id: analysisId, percentile: 'mean' })
    addRegionalAnalysisLayerToMap()
  }

  selectComparisonAnalysis = chosen => {
    const {
      setActiveRegionalAnalysis,
      analysisId,
      addRegionalAnalysisLayerToMap,
      removeRegionalAnalysisLayerFromMap,
      addRegionalComparisonLayerToMap,
      removeRegionalComparisonLayerFromMap
    } = this.props

    if (chosen != null) {
      setActiveRegionalAnalysis({ id: analysisId, comparisonId: chosen.value, percentile: 'mean' })
      removeRegionalAnalysisLayerFromMap()
      addRegionalComparisonLayerToMap()
    } else {
      // not a comparison
      setActiveRegionalAnalysis({ id: analysisId, percentile: 'mean' })
      removeRegionalComparisonLayerFromMap()
      addRegionalAnalysisLayerToMap()
    }
  }

  renderComparisonSelector () {
    const { regionalAnalyses, comparisonAnalysis, analysis } = this.props

    if (!analysis) return null // don't render until loaded

    const options = regionalAnalyses
      .filter(({ id }) => id !== analysis.id)
      // don't compare incomparable analyses
      .filter(({ zoom, width, height, north, west }) =>
        zoom === analysis.zoom &&
        width === analysis.width &&
        height === analysis.height &&
        north === analysis.north &&
        west === analysis.west
      )
      .map(({ id, name }) => { return { value: id, label: name } })

    return <div>
      <Select
        value={comparisonAnalysis ? comparisonAnalysis.id : null}
        options={options}
        onChange={this.selectComparisonAnalysis}
        placeholder={messages.analysis.compareTo}
        />
    </div>
  }

  setMinimumImprovementProbability = (e) =>
    this.props.setMinimumImprovementProbability(parseFloat(e.target.value))

  renderMinimumImprovementProbabilitySelector () {
    const { minimumImprovementProbability } = this.props
    return <Slider
      label={messages.analysis.minimumImprovementProbability}
      output
      format='.2f'
      min={0}
      max={1}
      step={0.01}
      value={minimumImprovementProbability}
      onChange={this.setMinimumImprovementProbability}
      />
  }

  downloadScenarioGIS = (e) => {
    e.preventDefault()
    downloadFromS3(`/api/regional/${this.props.analysis.id}/grid/mean/tiff?redirect=false`)
  }

  downloadComparisonGIS = (e) => {
    e.preventDefault()
    downloadFromS3(`/api/regional/${this.props.comparisonAnalysis.id}/grid/mean/tiff?redirect=false`)
  }

  downloadProbabilityGIS = (e) => {
    e.preventDefault()
    // NB base comes first (TODO change?)
    downloadFromS3(`/api/regional/${this.props.comparisonAnalysis.id}/${this.props.analysis.id}/tiff?redirect=false`)
  }

  renderGisExport () {
    const { analysis, comparisonAnalysis } = this.props
    // we use <a> tags not buttons in order to get text wrapping; all event handlers prevent default
    return <div>
      <b><Icon type='map-o' />{messages.analysis.gisExport}</b>
      <ul>
        <li>
          <a href='#' onClick={this.downloadScenarioGIS}>
            {sprintf(messages.analysis.downloadRegional, analysis.name)}
          </a>
        </li>
        { comparisonAnalysis &&
          <li>
            <a href='#' onClick={this.downloadComparisonGIS}>
              {sprintf(messages.analysis.downloadRegional, comparisonAnalysis.name)}
            </a>
          </li> }
        { comparisonAnalysis &&
          <li>
            <a href='#' onClick={this.downloadProbabilityGIS}>
              {messages.analysis.downloadRegionalProbability}
            </a>
          </li> }
      </ul>
    </div>
  }

  render () {
    const { analysis, comparisonAnalysis, breaks, grid, differenceGrid, indicators } = this.props

    if (analysis == null || grid == null) return null

    return <div>
      <h3>{analysis.name}</h3>

      {this.renderComparisonSelector()}

      {comparisonAnalysis && this.renderMinimumImprovementProbabilitySelector()}

      <div>
        <i>
          {sprintf(
            messages.analysis.accessTo,
            indicators.find(i => i.key === analysis.grid).name,
            analysis.cutoffMinutes)}
        </i>
      </div>

      { comparisonAnalysis && <div>
        <i>
          {sprintf(
            messages.analysis.compareAccessTo,
            indicators.find(i => i.key === analysis.grid).name,
            analysis.cutoffMinutes)}
        </i>
      </div> }

      <Legend
        breaks={breaks}
        min={comparisonAnalysis != null
          ? differenceGrid.min
          : grid.min}
        colors={comparisonAnalysis != null
          ? colors.REGIONAL_COMPARISON_GRADIENT
          : colors.REGIONAL_GRADIENT}
        />

      <Collapsible
        title={sprintf(messages.analysis.settingsFor, analysis.name)}>
        <ProfileRequestDisplay request={analysis.request} />
      </Collapsible>

      { comparisonAnalysis && <Collapsible
        title={sprintf(messages.analysis.settingsFor, comparisonAnalysis.name)}>
        <ProfileRequestDisplay request={comparisonAnalysis.request} />
      </Collapsible> }

      {this.renderGisExport()}
    </div>
  }

  componentWillUnmount () {
    const { removeRegionalAnalysisLayerFromMap, removeRegionalComparisonLayerFromMap } = this.props
    removeRegionalAnalysisLayerFromMap()
    removeRegionalComparisonLayerFromMap()
  }
}

/**
 * Perform an authenticated fetch to get a presigned URL to download a grid from S3,
 * then download it. Pass in the path to fetch.
 */
async function downloadFromS3 (path) {
  const res = await authenticatedFetch(path).then(res => res.json())
  window.open(res.url)
}

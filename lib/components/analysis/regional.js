/** render a regional analysis */

import Icon from '@conveyal/woonerf/components/icon'
import React, {Component, PropTypes} from 'react'
import Select from 'react-select'
import {sprintf} from 'sprintf-js'

import Legend from './legend'
import colors from '../../constants/colors'
import messages from '../../utils/messages'
import ProfileRequestDisplay from './profile-request-display'
import Collapsible from '../collapsible'
import {Slider} from '../input'

export default class RegionalAnalysis extends Component {
  static propTypes = {
    analysis: PropTypes.object, // can be null when loading
    analysisId: PropTypes.string.isRequired,
    breaks: PropTypes.array,
    comparisonAnalysis: PropTypes.object,
    differenceGrid: PropTypes.object,
    grid: PropTypes.object,
    indicators: PropTypes.array.isRequired,
    minimumImprovementProbability: PropTypes.number.isRequired,
    projectId: PropTypes.string,
    regionalAnalyses: PropTypes.array,

    // actions
    addRegionalAnalysisLayerToMap: PropTypes.func.isRequired,
    addRegionalComparisonLayerToMap: PropTypes.func.isRequired,
    fetch: PropTypes.func.isRequired,
    loadRegionalAnalyses: PropTypes.func.isRequired,
    removeRegionalAnalysisLayerFromMap: PropTypes.func.isRequired,
    removeRegionalComparisonLayerFromMap: PropTypes.func.isRequired,
    setActiveRegionalAnalysis: PropTypes.func.isRequired,
    setMinimumImprovementProbability: PropTypes.func.isRequired
  }

  componentWillMount () {
    const { analysis, analysisId, setActiveRegionalAnalysis, addRegionalAnalysisLayerToMap, loadRegionalAnalyses, projectId } = this.props
    if (analysis == null) {
      loadRegionalAnalyses(projectId)
    }

    setActiveRegionalAnalysis({ id: analysisId })
    addRegionalAnalysisLayerToMap()
  }

  selectComparisonAnalysis = (chosen) => {
    const {
      setActiveRegionalAnalysis,
      analysisId,
      addRegionalAnalysisLayerToMap,
      removeRegionalAnalysisLayerFromMap,
      addRegionalComparisonLayerToMap,
      removeRegionalComparisonLayerFromMap
    } = this.props

    if (chosen != null) {
      setActiveRegionalAnalysis({ id: analysisId, comparisonId: chosen.value })
      removeRegionalAnalysisLayerFromMap()
      addRegionalComparisonLayerToMap()
    } else {
      // not a comparison
      setActiveRegionalAnalysis({ id: analysisId })
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

  /**
   * Perform an authenticated fetch to get a presigned URL to download a grid from S3,
   * then download it. Pass in the path to fetch.
   */
  downloadFromS3 (url) {
    const {fetch} = this.props
    fetch({
      url,
      next (error, response) {
        if (error) {
          window.alert(error)
        } else {
          window.open(response.value.url)
        }
      }
    })
  }

  downloadScenarioGIS = (e) => {
    e.preventDefault()
    this.downloadFromS3(`/api/regional/${this.props.analysis.id}/grid/mean/tiff?redirect=false`)
  }

  downloadComparisonGIS = (e) => {
    e.preventDefault()
    this.downloadFromS3(`/api/regional/${this.props.comparisonAnalysis.id}/grid/mean/tiff?redirect=false`)
  }

  downloadProbabilityGIS = (e) => {
    e.preventDefault()
    // NB base comes first (TODO change?)
    this.downloadFromS3(`/api/regional/${this.props.comparisonAnalysis.id}/${this.props.analysis.id}/tiff?redirect=false`)
  }

  renderGisExport () {
    const { analysis, comparisonAnalysis } = this.props
    // we use <a> tags not buttons in order to get text wrapping; all event handlers prevent default
    return <div>
      <b><Icon type='map-o' />{messages.analysis.gisExport}</b>
      <ul>
        <li>
          <a onClick={this.downloadScenarioGIS} tabIndex={0}>
            {sprintf(messages.analysis.downloadRegional, analysis.name)}
          </a>
        </li>
        { comparisonAnalysis &&
          <li>
            <a onClick={this.downloadComparisonGIS} tabIndex={0}>
              {sprintf(messages.analysis.downloadRegional, comparisonAnalysis.name)}
            </a>
          </li> }
        { comparisonAnalysis &&
          <li>
            <a onClick={this.downloadProbabilityGIS} tabIndex={0}>
              {messages.analysis.downloadRegionalProbability}
            </a>
          </li> }
      </ul>
    </div>
  }

  render () {
    const {
      analysis,
      breaks,
      comparisonAnalysis,
      differenceGrid,
      grid,
      indicators,
      minimumImprovementProbability,
      setMinimumImprovementProbability
    } = this.props

    if (analysis == null || grid == null) return null

    return <div>
      <h3>{analysis.name}</h3>

      {this.renderComparisonSelector()}

      {comparisonAnalysis &&
        <MinimumImprovementProbabilitySelector
          minimumImprovementProbability={minimumImprovementProbability}
          setMinimumImprovementProbability={setMinimumImprovementProbability}
          />
      }

      <div>
        <i>
          {analysis.travelTimePercentile !== -1 && sprintf(messages.analysis.accessTo, {
            opportunity: indicators.find(i => i.key === analysis.grid).name,
            cutoff: analysis.cutoffMinutes,
            percentile: analysis.travelTimePercentile
          })}
          {analysis.travelTimePercentile === -1 && sprintf(messages.analysis.accessToInstantaneous, {
            opportunity: indicators.find(i => i.key === analysis.grid).name,
            cutoff: analysis.cutoffMinutes
          })}
        </i>
      </div>

      { comparisonAnalysis && <div>
        <i>
          {comparisonAnalysis.travelTimePercentile !== -1 && sprintf(messages.analysis.comparisonAccessTo, {
            opportunity: indicators.find(i => i.key === comparisonAnalysis.grid).name,
            cutoff: comparisonAnalysis.cutoffMinutes,
            percentile: comparisonAnalysis.travelTimePercentile
          })}
          {comparisonAnalysis.travelTimePercentile === -1 && sprintf(messages.analysis.comparisonAccessToInstantaneous, {
            opportunity: indicators.find(i => i.key === comparisonAnalysis.grid).name,
            cutoff: comparisonAnalysis.cutoffMinutes
          })}
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

function MinimumImprovementProbabilitySelector ({
  minimumImprovementProbability,
  setMinimumImprovementProbability
}) {
  return (
    <Slider
      label={messages.analysis.minimumImprovementProbability}
      output
      format='.2f'
      min={0}
      max={1}
      step={0.01}
      value={minimumImprovementProbability}
      onChange={(e) => setMinimumImprovementProbability(parseFloat(e.target.value))}
      />
  )
}

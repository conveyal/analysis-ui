/** render a regional analysis */

import React, { Component, PropTypes } from 'react'
import Legend from './legend'
import colors from '../../constants/colors'
import messages from '../../utils/messages'
import ProfileRequestDisplay from './profile-request-display'
import Select from 'react-select'
import Collapsible from '../collapsible'
import {sprintf} from 'sprintf-js'

export default class RegionalAnalysis extends Component {
  static propTypes = {
    regionalAnalyses: PropTypes.array,
    projectId: PropTypes.string,
    analysis: PropTypes.object,
    analysisId: PropTypes.object.isRequired,
    indicators: PropTypes.array.isRequired,
    comparisonAnalysis: PropTypes.object.isRequired,
    regionalAnalysisLayerOnMap: PropTypes.bool.isRequired,
    regionalComparisonLayerOnMap: PropTypes.bool.isRequired,
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
    removeIsochroneLayerFromMap: PropTypes.func.isRequired,
    addIsochroneLayerToMap: PropTypes.func.isRequired,
    removeOpportunityLayerFromMap: PropTypes.func.isRequired,
    addOpportunityLayerToMap: PropTypes.func.isRequired,
    loadRegionalAnalyses: PropTypes.func.isRequired
  }

  componentWillMount () {
    const { analysis, analysisId, setActiveRegionalAnalysis, addRegionalAnalysisLayerToMap, loadRegionalAnalyses, projectId } = this.props
    if (analysis == null) {
      loadRegionalAnalyses(projectId)
      setActiveRegionalAnalysis({ id: analysisId, percentile: 'mean' })
    }

    addRegionalAnalysisLayerToMap()
  }

  selectComparisonAnalysis = e => {
    const { setActiveRegionalAnalysis, analysisId } = this.props
    setActiveRegionalAnalysis({ id: analysisId, comparisonId: e.value, percentile: 'mean' })
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

  render () {
    const { analysis, comparisonAnalysis, breaks, grid, differenceGrid, indicators } = this.props

    if (analysis == null || grid == null) return null

    return <div>
      <h3>{analysis.name}</h3>

      {this.renderComparisonSelector()}

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
    </div>
  }
}

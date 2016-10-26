/** Show progress of regional analysis, and allow displaying a regional analysis on the map */

import React, { Component, PropTypes } from 'react'
import Icon from '../icon'

const REFETCH_INTERVAL = 5 * 1000

export default class RegionalAnalysis extends Component {
  static propTypes = {
    regionalAnalyses: PropTypes.array,
    scenarioId: PropTypes.string.isRequired,
    variantIndex: PropTypes.number.isRequired,
    load: PropTypes.func.isRequired,
    setActiveRegionalAnalysis: PropTypes.func.isRequired,
    addRegionalAnalysisLayerToMap: PropTypes.func.isRequired,
    removeRegionalAnalysisLayerFromMap: PropTypes.func.isRequired,
    activeRegionalAnalysis: PropTypes.string,
    regionalAnalysisLayerOnMap: PropTypes.bool.isRequired
  }

  componentWillMount () {
    this.props.load()
    this.interval = window.setInterval(this.fetch, REFETCH_INTERVAL)
  }

  componentWillUnmount () {
    window.clearInterval(this.interval)
  }

  fetch = () => {
    const { regionalAnalyses, load, scenarioId, variantIndex } = this.props
    if (regionalAnalyses == null) return
    const displayAnalyses = regionalAnalyses.filter(q => q.scenarioId === scenarioId && q.variant === variantIndex)
    if (displayAnalyses.findIndex(q => !q.complete) > -1) load()
  }

  selectRegionalAnalysis = (id) => {
    const {regionalAnalysisLayerOnMap, addRegionalAnalysisLayerToMap, removeRegionalAnalysisLayerFromMap, setActiveRegionalAnalysis, removeIsochroneLayerFromMap, removeOpportunityLayerFromMap, addIsochroneLayerToMap, addOpportunityLayerToMap} = this.props

    setActiveRegionalAnalysis({ id, percentile: 50 })

    if (id == null) {
      if (regionalAnalysisLayerOnMap) {
        removeRegionalAnalysisLayerFromMap()
        addIsochroneLayerToMap()
        addOpportunityLayerToMap()
      }
    } else {
      if (!regionalAnalysisLayerOnMap) {
        removeIsochroneLayerFromMap()
        removeOpportunityLayerFromMap()
        addRegionalAnalysisLayerToMap()
      }
    }
  }

  render () {
    const { variantIndex, scenarioId, regionalAnalyses } = this.props

    if (regionalAnalyses == null) return <ul />

    const displayAnalyses = regionalAnalyses.filter(a => a.scenarioId === scenarioId && a.variant === variantIndex)
    displayAnalyses.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)

    return <ul className='list-group'>
      {displayAnalyses.map(a => this.renderAnalysis(a))}
    </ul>
  }

  renderAnalysis (analysis) {
    const complete = analysis.status == null || analysis.status.complete === analysis.status.total

    let percentage = complete ? 100 : analysis.status.complete / analysis.status.total * 100

    const { activeRegionalAnalysis } = this.props
    let shown = activeRegionalAnalysis === analysis.id

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

      {complete && <a
        className={`ShowOnMap pull-right ${shown ? 'active' : 'dim'} fa-btn`}
        // call with null ID to hide layer
        onClick={e => this.selectRegionalAnalysis(shown ? null : analysis.id)}
        title='Toggle map display'
        role='checkbox'
        ariaChecked={shown}
        ><Icon type={shown ? 'eye' : 'eye-slash'} />
      </a>}
    </li>
  }
}

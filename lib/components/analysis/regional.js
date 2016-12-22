/** Show progress of regional analysis, and allow displaying a regional analysis on the map */

import React, { Component, PropTypes } from 'react'
import Icon from '../icon'
import messages from '../../utils/messages'

const REFETCH_INTERVAL = 5 * 1000

export default class RegionalAnalysisSelector extends Component {
  static propTypes = {
    regionalAnalyses: PropTypes.array,
    loadRegionalAnalyses: PropTypes.func.isRequired,
    projectId: PropTypes.string.isRequired,
    scenarioId: PropTypes.string.isRequired
  }

  componentWillMount () {
    this.fetch()
    this.interval = window.setInterval(this.fetch, REFETCH_INTERVAL)
  }

  componentWillUnmount () {
    window.clearInterval(this.interval)
  }

  fetch = () => {
    const { loadRegionalAnalyses, projectId } = this.props
    loadRegionalAnalyses(projectId)
  }

  render () {
    const { regionalAnalyses } = this.props

    if (regionalAnalyses == null) return null // not yet loaded

    const displayAnalyses = [...regionalAnalyses]
    displayAnalyses.sort(compareAnalyses)

    return <ul className='list-group'>
      {displayAnalyses.map(a => this.renderAnalysis(a))}
    </ul>
  }

  renderAnalysis (analysis) {
    const { projectId, scenarioId } = this.props
    const complete = analysis.status == null || analysis.status.complete === analysis.status.total

    let percentage = complete ? 100 : analysis.status.complete / analysis.status.total * 100

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
        href={`/projects/${projectId}/scenarios/${scenarioId}/analysis/regional/${analysis.id}`}
        title={messages.analysis.openRegionalAnalysis}
        className='pull-right'
        >
        <Icon type='arrow-right' />
        </a>}
    </li>
  }
}

/** Compare regional analysis by name */
function compareAnalyses (a, b) {
  if (a.name === b.name) return 0
  else if (a.name == null || a.name < b.name) return -1
  else return 1
}

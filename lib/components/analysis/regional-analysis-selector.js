// @flow
import memoize from 'lodash/memoize'
import sortBy from 'lodash/sortBy'
import React, {Component} from 'react'

import messages from '../../utils/messages'

type Props = {
  allAnalyses: any[],

  goToAnalysis: (analysisId: string) => void
}

/**
 * Show progress of regional analysis, and allow displaying a regional analysis
 * on the map
 */
export default class RegionalAnalysisSelector extends Component {
  props: Props

  state = {
    sortedAnalyses: sortByName(this.props.allAnalyses || [])
  }

  componentWillReceiveProps (nextProps: Props) {
    const {allAnalyses} = nextProps
    if (allAnalyses !== this.props.allAnalyses) {
      this.setState({
        sortedAnalyses: sortByName(allAnalyses || [])
      })
    }
  }

  _selectRegionalAnalysis = memoize((analysisId: string) => () => {
    this.props.goToAnalysis(analysisId)
  })

  render () {
    const {sortedAnalyses} = this.state
    return (
      <ul className='list-group'>
        {sortedAnalyses
          .filter(a => !a.deleted) // TODO: don't load the deleted ones...
          .map(a =>
            <Analysis
              analysis={a}
              key={`analysis-${a.id}`}
              onSelect={this._selectRegionalAnalysis(a.id)}
            />
          )}
      </ul>
    )
  }
}

function Analysis ({analysis, onSelect}) {
  const complete =
    analysis.status == null ||
    analysis.status.complete === analysis.status.total
  const percentage = complete
    ? 100
    : analysis.status.complete / analysis.status.total * 100

  return (
    <li className='list-group-item'>
      {complete
        ? <a
          onClick={onSelect}
          tabIndex={0}
          title={messages.analysis.openRegionalAnalysis}
          aria-label={messages.analysis.openRegionalAnalysis}
        >{analysis.name}</a>
        : `${analysis.name} - ${analysis.status.complete} of ${analysis.status.total} complete`}
      {!complete &&
        <span>
          <div className='progress'>
            <div
              className='progress-bar'
              aria-valuenow={percentage}
              aria-valuemin={0}
              aria-valuemax={100}
              style={{width: `${percentage}%`, minWidth: '2em'}}
            >
              {Math.round(percentage)}%
            </div>
          </div>
        </span>}
    </li>
  )
}

const sortByName = collection => sortBy(collection, item => item.name)

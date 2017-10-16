// @flow
import Icon from '@conveyal/woonerf/components/icon'
import memoize from 'lodash/memoize'
import sortBy from 'lodash/sortBy'
import React, {Component} from 'react'

import messages from '../../utils/messages'

type Props = {
  allAnalyses: any[],

  deleteAnalysis: (analysisId: string) => void,
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

  _deleteRegionalAnalysis = memoize((analysisId: string) => () =>
    window.confirm('Are you sure you wish to cancel this regional analysis?') &&
    this.props.deleteAnalysis(analysisId))

  _selectRegionalAnalysis = memoize((analysisId: string) => () =>
    this.props.goToAnalysis(analysisId))

  render () {
    const {sortedAnalyses} = this.state
    return (
      <ul className='list-group'>
        {sortedAnalyses
          .filter(a => !a.deleted) // TODO: don't load the deleted ones...
          .map(a => (
            <Analysis
              analysis={a}
              key={`analysis-${a.id}`}
              onDelete={this._deleteRegionalAnalysis(a.id)}
              onSelect={this._selectRegionalAnalysis(a.id)}
            />
          ))}
      </ul>
    )
  }
}

function Analysis ({analysis, onDelete, onSelect}) {
  const complete =
    analysis.status == null ||
    analysis.status.complete === analysis.status.total
  const percentage = complete
    ? 100
    : analysis.status.complete / analysis.status.total * 100

  return complete
    ? <a
      arial-label={messages.analysis.openRegionalAnalysis}
      className='list-group-item'
      onClick={onSelect}
      tabIndex={0}
      title={messages.analysis.openRegionalAnalysis}
      >
      <span className='list-group-item-heading'>
        <Icon type='arrow-right' /> {analysis.name}
      </span>
    </a>
    : <li className='list-group-item'>
      <span className='list-group-item-heading'>
        <span>
          <Icon type='cloud' />
          {' '}
          {analysis.name}
          {' '}
            -
            {' '}
          {analysis.status.complete}
          {' '}
            of
            {' '}
          {analysis.status.total}
          {' '}
            complete
          </span>
        <a
          className='pull-right'
          onClick={onDelete}
          tabIndex={0}
          title='Cancel regional analysis'
          >
          <Icon type='times' />
        </a>
      </span>
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
    </li>
}

const sortByName = collection => sortBy(collection, item => item.name)

import {withRouter} from 'next/router'
import React from 'react'
import {useDispatch} from 'react-redux'

import {deleteRegionalAnalysis} from 'lib/actions/analysis/regional'
import {RouteTo} from 'lib/constants'

import Select from '../select'
import {Group} from '../input'

import RunningAnalysis from './running-analysis'

const isRunning = analysis =>
  analysis.status && analysis.status.complete !== analysis.status.total

/**
 * Show progress of regional analysis, and allow displaying a regional analysis
 * on the map
 */
function RegionalAnalysisSelector(p) {
  const dispatch = useDispatch()

  function _deleteAnalysis(analysisId) {
    if (
      window.confirm('Are you sure you wish to cancel this regional analysis?')
    ) {
      dispatch(deleteRegionalAnalysis(analysisId))
    }
  }

  function _goToAnalysis(selected) {
    p.router.push({
      pathname: RouteTo.regionalAnalysis,
      query: {analysisId: selected.value, regionId: p.router.query.regionId}
    })
  }

  const runningAnalyses = p.allAnalyses.filter(isRunning)
  return (
    <div>
      <Group>
        <Select
          onChange={_goToAnalysis}
          options={p.allAnalyses.map(a => ({value: a._id, label: a.name}))}
          placeholder='View a regional analysis...'
        />
      </Group>
      {runningAnalyses.length > 0 && (
        <Group>
          <ul className='list-group'>
            {runningAnalyses.map(a => (
              <RunningAnalysis
                analysis={a}
                key={a._id}
                onDelete={() => _deleteAnalysis(a._id)}
              />
            ))}
          </ul>
        </Group>
      )}
    </div>
  )
}

// Expose next/router
export default withRouter(RegionalAnalysisSelector)

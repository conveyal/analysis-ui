import React from 'react'
import {useDispatch} from 'react-redux'

import {deleteRegionalAnalysis} from 'lib/actions/analysis/regional'

import Select from '../select'
import {Group} from '../input'

import RunningAnalysis from './running-analysis'

const isRunning = analysis =>
  analysis.status && analysis.status.complete !== analysis.status.total

/**
 * Show progress of regional analysis, and allow displaying a regional analysis
 * on the map
 */
export default function RegionalAnalysisSelector(p) {
  const dispatch = useDispatch()

  function _deleteAnalysis(analysisId) {
    if (
      window.confirm('Are you sure you wish to cancel this regional analysis?')
    ) {
      dispatch(deleteRegionalAnalysis(analysisId))
    }
  }

  function _onChange(a) {
    let newUrl = window.location.pathname
    if (a) newUrl += `?analysisId=${a._id}`
    window.history.replaceState(null, document.title, newUrl)
    p.onChange(a)
  }

  const runningAnalyses = p.allAnalyses.filter(isRunning)
  return (
    <>
      <Group>
        <Select
          isClearable
          onChange={_onChange}
          getOptionLabel={a => a.name}
          getOptionValue={a => a._id}
          options={p.allAnalyses}
          placeholder='View a regional analysis...'
          value={p.activeAnalysis}
        />
      </Group>
      {!p.activeAnalysis && runningAnalyses.length > 0 && (
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
    </>
  )
}

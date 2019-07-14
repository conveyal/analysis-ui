import get from 'lodash/get'
import React from 'react'

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
  const activeId = get(p, 'activeAnalysis._id')
  const runningAnalyses = p.allAnalyses.filter(isRunning)
  return (
    <>
      <Group>
        <Select
          isClearable
          onChange={p.selectAnalysis}
          getOptionLabel={a => a.name}
          getOptionValue={a => a._id}
          options={p.allAnalyses}
          placeholder='View a regional analysis...'
          value={p.allAnalyses.find(a => a._id === activeId)}
        />
      </Group>
      {!activeId && runningAnalyses.length > 0 && (
        <Group>
          <ul className='list-group'>
            {runningAnalyses.map(a => (
              <RunningAnalysis
                analysis={a}
                key={a._id}
                onDelete={p.deleteAnalysis}
              />
            ))}
          </ul>
        </Group>
      )}
    </>
  )
}

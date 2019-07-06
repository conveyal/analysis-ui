import {useRouter} from 'next/router'
import React from 'react'
import {useDispatch} from 'react-redux'

import {deleteRegionalAnalysis} from 'lib/actions/analysis/regional'
import {routeTo} from 'lib/router'

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
  const router = useRouter()

  function _deleteAnalysis(analysisId) {
    if (
      window.confirm('Are you sure you wish to cancel this regional analysis?')
    ) {
      dispatch(deleteRegionalAnalysis(analysisId))
    }
  }

  function _goToAnalysis(a) {
    const {as, href} = routeTo('regionalAnalysis', {
      analysisId: a._id,
      regionId: router.query.regionId
    })
    router.push(href, as)
  }

  const runningAnalyses = p.allAnalyses.filter(isRunning)
  return (
    <>
      <Group>
        <Select
          onChange={_goToAnalysis}
          getOptionLabel={a => a.name}
          getOptionValue={a => a._id}
          options={p.allAnalyses}
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
    </>
  )
}

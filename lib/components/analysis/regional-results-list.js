import {faServer} from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {load as loadAllAnalyses} from 'lib/actions/analysis/regional'
import useInterval from 'lib/hooks/use-interval'
import selectRegionalAnalyses from 'lib/selectors/regional-analyses'

import Icon from '../icon'
import InnerDock from '../inner-dock'

import Selector from './regional-analysis-selector'

const REFETCH_INTERVAL = 30 * 1000 // 30 seconds

export default function RegionalAnalysisResultsList(p) {
  const dispatch = useDispatch()
  const allAnalyses = useSelector(selectRegionalAnalyses)

  useInterval(() => dispatch(loadAllAnalyses(p.regionId)), REFETCH_INTERVAL)

  return (
    <InnerDock className='block'>
      <legend>
        <Icon icon={faServer} /> Regional Analyses
      </legend>
      {allAnalyses.length > 0 ? (
        <Selector allAnalyses={allAnalyses} />
      ) : (
        <div className='alert alert-warning'>
          You have no running or completed regional analysis jobs! To create
          one, go to the single point analysis page.
        </div>
      )}
    </InnerDock>
  )
}

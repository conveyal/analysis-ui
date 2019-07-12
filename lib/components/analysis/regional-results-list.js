import {faServer} from '@fortawesome/free-solid-svg-icons'
import get from 'lodash/get'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {setQueryString} from 'lib/actions'
import {
  deleteRegionalAnalysis,
  load as loadAllAnalyses
} from 'lib/actions/analysis/regional'
import RegionalAnalysis from 'lib/containers/regional-analysis-results'
import useInterval from 'lib/hooks/use-interval'
import selectRegionalAnalyses from 'lib/selectors/regional-analyses'

import Icon from '../icon'
import InnerDock from '../inner-dock'

import Selector from './regional-analysis-selector'

const REFETCH_INTERVAL = 60 * 1000 // 60 seconds

export default function RegionalAnalysisResultsList(p) {
  const dispatch = useDispatch()
  const [activeAnalysis, setActiveAnalysis] = React.useState(p.analysis)
  const allAnalyses = useSelector(selectRegionalAnalyses)
  const queryString = useSelector(state => state.queryString)

  function _selectAnalysis(a) {
    let newUrl = window.location.pathname
    const _id = get(a, '_id')
    if (_id) newUrl += `?analysisId=${a._id}`
    window.history.replaceState(null, document.title, newUrl)
    if (_id) queryString.analysisId = a._id
    else delete queryString.analysisId
    dispatch(setQueryString(queryString))
    setActiveAnalysis(a)
  }

  function _deleteAnalysis() {
    if (
      window.confirm('Are you sure you wish to remove this regional analysis?')
    ) {
      _selectAnalysis() // clear analysis
      dispatch(deleteRegionalAnalysis(activeAnalysis._id))
    }
  }

  useInterval(() => dispatch(loadAllAnalyses(p.regionId)), REFETCH_INTERVAL)

  return (
    <InnerDock className='block'>
      <legend>
        <Icon icon={faServer} /> Regional Analyses
      </legend>
      {allAnalyses.length > 0 ? (
        <Selector
          activeAnalysis={activeAnalysis}
          deleteAnalysis={_deleteAnalysis}
          allAnalyses={allAnalyses}
          key={activeAnalysis}
          selectAnalysis={_selectAnalysis}
        />
      ) : (
        <div className='alert alert-warning'>
          You have no running or completed regional analysis jobs! To create
          one, go to the single point analysis page.
        </div>
      )}
      {activeAnalysis && (
        <RegionalAnalysis
          analysis={activeAnalysis}
          deleteAnalysis={_deleteAnalysis}
          key={activeAnalysis._id}
          opportunityDatasets={p.opportunityDatasets}
          regionalAnalyses={allAnalyses}
          setMapChildren={p.setMapChildren}
        />
      )}
    </InnerDock>
  )
}

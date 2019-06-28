import React from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'

import Select from 'lib/components/select'

import * as actions from '../actions'
import * as select from '../selectors'

export function OpportunityDatasetSelector(p) {
  const {loadOpportunityDatasets, regionId} = p
  const [loading, setLoading] = React.useState(false)
  // Load datasets on mount
  React.useEffect(() => {
    loadOpportunityDatasets(regionId)
  }, [loadOpportunityDatasets, regionId])

  function selectOpportunityDataset(dataset) {
    if (!dataset) return p.setActiveOpportunityDataset()
    setLoading(true)
    p.loadOpportunityDataset(dataset).finally(() => setLoading(false))
  }

  return (
    <Select
      isDisabled={p.isDisabled || loading}
      options={p.opportunityDatasets}
      getOptionLabel={d => `${d.sourceName}: ${d.name}`}
      getOptionValue={d => d._id}
      onChange={selectOpportunityDataset}
      value={p.activeOpportunityDataset}
    />
  )
}

export default connect(
  createStructuredSelector(select),
  actions
)(OpportunityDatasetSelector)

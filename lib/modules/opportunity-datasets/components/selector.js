import React from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'

import Select from '../../../components/select'

import * as actions from '../actions'
import * as select from '../selectors'

export function OpportunityDatasetSelector(p) {
  function selectOpportunityDataset(option) {
    if (!option) return p.setActiveOpportunityDataset()

    const dataset = p.opportunityDatasets.find(d => d._id === option.value)
    if (dataset) {
      p.loadOpportunityDataset(dataset)
    }
  }

  return (
    <Select
      options={p.opportunityDatasets.map(d => ({
        label: `${d.sourceName}: ${d.name}`,
        value: d._id
      }))}
      onChange={selectOpportunityDataset}
      value={p.activeOpportunityDataset && p.activeOpportunityDataset._id}
    />
  )
}

export default connect(
  createStructuredSelector(select),
  actions
)(OpportunityDatasetSelector)

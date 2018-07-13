// @flow
import React, {PureComponent} from 'react'
import Select from 'react-select'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'

import {loadOpportunityDataset} from '../actions'
import * as select from '../selectors'

import type {ReactSelectResult} from '../../../types'
import type {OpportunityDataset} from '../types'

export class OpportunityDatasetSelector extends PureComponent {
  props: {
    activeOpportunityDataset?: OpportunityDataset,
    opportunityDatasets: OpportunityDataset[],

    load: (dataset: OpportunityDataset) => void
  }

  _selectOpportunityDataset = (option: ReactSelectResult) => {
    const dataset = this.props.opportunityDatasets.find(d => d._id === option.value)
    if (dataset) {
      this.props.load(dataset)
    }
  }

  render () {
    const {activeOpportunityDataset, opportunityDatasets} = this.props
    return <Select
      clearable={false}
      options={opportunityDatasets.map(d => ({
        label: `${d.sourceName}: ${d.name}`,
        value: d._id
      }))}
      onChange={this._selectOpportunityDataset}
      value={activeOpportunityDataset && activeOpportunityDataset._id}
    />
  }
}

export default connect(createStructuredSelector(select), {
  load: loadOpportunityDataset
})(OpportunityDatasetSelector)

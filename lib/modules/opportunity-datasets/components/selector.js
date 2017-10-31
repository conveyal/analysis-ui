// @flow
import React, {PureComponent} from 'react'
import Select from 'react-select'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'

import {loadOpportunityDataset} from '../actions'
import {
  selectActiveOpportunityDataset,
  selectOpportunityDatasets
} from '../selectors'

import type {ReactSelectResult} from '../../../types'
import type {OpportunityDataset} from '../types'

export class OpportunityDatasetSelector extends PureComponent {
  props: {
    activeDataset?: OpportunityDataset,
    datasets: OpportunityDataset[],

    load: (dataset: OpportunityDataset) => void
  }

  _selectOpportunityDataset = (option: ReactSelectResult) => {
    const dataset = this.props.datasets.find((d) => d.key === option.value)
    if (dataset) {
      this.props.load(dataset)
    }
  }

  render () {
    const {activeDataset, datasets} = this.props
    return <Select
      clearable={false}
      options={datasets.map(d => ({
        label: `${d.dataSource}: ${d.name}`,
        value: d.key
      }))}
      onChange={this._selectOpportunityDataset}
      value={activeDataset && activeDataset.key}
    />
  }
}

export default connect(createStructuredSelector({
  activeDataset: selectActiveOpportunityDataset,
  datasets: selectOpportunityDatasets
}), {
  load: loadOpportunityDataset
})(OpportunityDatasetSelector)

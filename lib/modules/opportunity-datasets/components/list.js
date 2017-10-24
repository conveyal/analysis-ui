// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'

import {Button} from '../../../components/buttons'
import {Group} from '../../../components/input'
import {
  addOpportunityComponent,
  deleteOpportunityDataset,
  removeOpportunityComponent
} from '../actions'
import {selectActiveOpportunityDataset} from '../selectors'
import Selector from './selector'

import type {OpportunityDataset} from '../types'

type Props = {
  activeDataset?: OpportunityDataset,
  opportunityDatasets: OpportunityDataset[],

  addOpportunityComponent: () => void,
  deleteOpportunityDataset: (dataset: OpportunityDataset) => void,
  removeOpportunityComponent: () => void
}

export class ListOpportunityDatasets extends PureComponent {
  props: Props

  componentDidMount () {
    this.props.addOpportunityComponent()
  }

  componentWillUnmount () {
    this.props.removeOpportunityComponent()
  }

  _deleteDataset = () => {
    const {activeDataset} = this.props
    if (window.confirm('Are you sure you would like to delete this dataset?') && activeDataset) {
      this.props.deleteOpportunityDataset(activeDataset)
    }
  }

  render () {
    const {activeDataset} = this.props
    return <div>
      <br />
      <Group label='Select a dataset'>
        <Selector />
      </Group>
      {activeDataset && activeDataset.key &&
        <div>
          <h5>{activeDataset.dataSource}: {activeDataset.name}</h5>
          <Button
            block
            onClick={this._deleteDataset}
            style='danger'
            title='Remove dataset'
            ><Icon type='trash' /> Remove dataset
          </Button>
        </div>}
    </div>
  }
}

export default connect(createStructuredSelector({
  activeDataset: selectActiveOpportunityDataset
}), {
  addOpportunityComponent,
  deleteOpportunityDataset,
  removeOpportunityComponent
})(ListOpportunityDatasets)

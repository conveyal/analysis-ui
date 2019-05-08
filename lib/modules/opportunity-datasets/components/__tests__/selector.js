//
import enzyme from 'enzyme'
import React from 'react'

import {OpportunityDatasetSelector} from '../selector'

const {describe, expect, it} = global
describe('Opportunity Datasets > Components > Selector', () => {
  it('should render', () => {
    const loadOpportunityDatasets = jest.fn()
    const tree = enzyme.shallow(
      <OpportunityDatasetSelector
        loadOpportunityDataset={jest.fn()}
        loadOpportunityDatasets={loadOpportunityDatasets}
        opportunityDatasets={[]}
        setActiveOpportunityDataset={jest.fn()}
      />
    )
    expect(tree).toMatchSnapshot()
    expect(loadOpportunityDatasets).toHaveBeenCalled()
  })
})

import enzyme from 'enzyme'
import React from 'react'

import {OpportunityDatasetSelector} from '../selector'

test('Opportunity Datasets > Components > Selector should render', () => {
  const loadOpportunityDatasets = jest.fn()
  const tree = enzyme.mount(
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

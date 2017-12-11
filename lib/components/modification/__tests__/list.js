// @flow

import renderer from 'react-test-renderer'
import React from 'react'
import {Provider} from 'react-redux'

import ModificationsList from '../list'
import {makeMockStore, mockScenario, mockStores} from '../../../utils/mock-data.js'

const mockStore = makeMockStore(mockStores.init)

describe('Component > Modification > ModificationsList', () => {
  it('renders correctly', () => {
    const props = {
      bundleId: '1',
      createModification: jest.fn(),
      defaultFeedId: '1',
      modifications: [],
      modificationsByType: {},
      regionId: '1',
      push: jest.fn(),
      updateModification: jest.fn(),
      projectId: '1',
      project: {
        name: 'Test Project',
        variants: []
      }
    }
    const tree = renderer
      .create(
        <Provider store={mockStore}>
          <ModificationsList {...props} />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
    const noCalls = ['createModification', 'updateModification']
    noCalls.forEach(fn => {
      expect(props[fn]).not.toBeCalled()
    })
  })
})

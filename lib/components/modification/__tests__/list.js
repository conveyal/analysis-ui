// @flow

import renderer from 'react-test-renderer'
import React from 'react'
import {Provider} from 'react-redux'

import ModificationsList from '../list'
import {
  makeMockStore,
  mockProject,
  mockStores
} from '../../../utils/mock-data.js'

const mockStore = makeMockStore(mockStores.init)

describe('Component > Modification > ModificationsList', () => {
  it('renders correctly', () => {
    const props = {
      modifications: [],
      project: mockProject,
      projectId: mockProject._id,
      regionId: mockProject.regionId,

      createModification: jest.fn(),
      push: jest.fn(),
      updateModification: jest.fn()
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
      expect(props[fn]).not.toHaveBeenCalled()
    })
  })
})

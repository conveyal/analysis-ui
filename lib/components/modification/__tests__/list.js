// @flow

import renderer from 'react-test-renderer'
import React from 'react'
import {Provider} from 'react-redux'

import ModificationsList from '../list'
import {
  makeMockStore,
  mockModification,
  mockProject,
  mockStores
} from '../../../utils/mock-data.js'

const mockStore = makeMockStore(mockStores.init)

describe('Component > Modification > ModificationsList', () => {
  it('renders correctly', () => {
    const props = {
      activeModification: mockModification,
      modifications: [mockModification],
      project: mockProject,
      projectId: mockProject._id,

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
      expect(props[fn]).not.toBeCalled()
    })
  })
})

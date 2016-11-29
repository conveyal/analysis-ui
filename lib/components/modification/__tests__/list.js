/* global describe, it, expect, jest */

import renderer from 'react-test-renderer'
import React from 'react'
import { Provider } from 'react-redux'

import {makeMockStore} from '../../../utils/mock-data.js'

import ModificationsList from '../list'

const mockStore = makeMockStore({
  project: {
    currentProject: {
      id: '1'
    }
  },
  scenario: {
    currentScenario: {
      id: '1',
      name: 'Test Scenario'
    },
    modifications: [],
    variants: []
  }
})

describe('Component > Modification > ModificationsList', () => {
  it('renders correctly', () => {
    const props = {
      activeModification: {},
      bundleId: '1',
      createModification: jest.fn(),
      defaultFeedId: '1',
      modificationsByType: {},
      projectId: '1',
      replaceModification: jest.fn(),
      scenarioId: '1',
      variants: []
    }
    const tree = renderer.create(
      <Provider store={mockStore}>
        <ModificationsList
          {...props}
          />
      </Provider>
    ).toJSON()
    expect(tree).toMatchSnapshot()
    const noCalls = [
      'createModification',
      'replaceModification'
    ]
    noCalls.forEach((fn) => {
      expect(props[fn]).not.toBeCalled()
    })
  })
})

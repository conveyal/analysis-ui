// @flow

import renderer from 'react-test-renderer'
import React from 'react'

import ModificationGroup from '../group'
import {mockModification} from '../../../utils/mock-data'

describe('Component > Modification > ModificationGroup', () => {
  it('renders correctly', () => {
    const replaceModificationFn = jest.fn()
    const tree = renderer
      .create(
        <ModificationGroup
          activeModification={mockModification}
          create={jest.fn()}
          editModification={jest.fn()}
          goToEditModification={jest.fn()}
          modifications={[mockModification]}
          projectId='1234'
          scenarioId='1234'
          type='test'
          updateModification={replaceModificationFn}
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
    expect(replaceModificationFn).not.toBeCalled()
  })
})

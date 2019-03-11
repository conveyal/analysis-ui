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
          modifications={[mockModification]}
          type={mockModification.type}

          goToEditModification={jest.fn()}
          updateModification={jest.fn()}
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
    expect(replaceModificationFn).not.toHaveBeenCalled()
  })
})

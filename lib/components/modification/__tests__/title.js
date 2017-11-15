/* global describe, it, expect, jest */

import renderer from 'react-test-renderer'
import React from 'react'

import {mockModification} from '../../../utils/mock-data'

import Title from '../title'

describe('Component > Modification > Scenario', () => {
  it('renders correctly', () => {
    const updateModificationFn = jest.fn()
    const tree = renderer
      .create(
        <Title
          active
          editModification={jest.fn()}
          modification={mockModification}
          name='Title'
          regionId='1234'
          updateModification={updateModificationFn}
          scenarioId='1234'
          showOnMap
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
    expect(updateModificationFn).not.toBeCalled()
  })
})

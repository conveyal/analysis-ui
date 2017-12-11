// @flow

import renderer from 'react-test-renderer'
import React from 'react'

import SelectProject from '../select-project'

describe('Component > SelectProject', () => {
  it('renders correctly', () => {
    const mockProjects = [{_id: 1, name: 'S1'}, {_id: 2, name: 'S2'}]
    const pushFn = jest.fn()
    const tree = renderer
      .create(
        <SelectProject
          regionId='P1'
          push={pushFn}
          projects={mockProjects}
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
    expect(pushFn).not.toBeCalled()
  })
})

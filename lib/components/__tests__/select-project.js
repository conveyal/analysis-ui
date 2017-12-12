// @flow

import renderer from 'react-test-renderer'
import React from 'react'

import SelectProject from '../select-project'
import {mockProject} from '../../utils/mock-data'

describe('Component > SelectProject', () => {
  it('renders correctly', () => {
    const mockProjects = [mockProject]
    const pushFn = jest.fn()
    const tree = renderer
      .create(
        <SelectProject
          regionId='P1'
          projects={mockProjects}
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
    expect(pushFn).not.toBeCalled()
  })
})

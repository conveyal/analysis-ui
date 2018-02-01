// @flow

import renderer from 'react-test-renderer'
import React from 'react'

import SelectProject from '../select-project'
import {mockProject, mockRegion} from '../../utils/mock-data'

describe('Component > SelectProject', () => {
  it('renders correctly', () => {
    const mockProjects = [mockProject]
    const pushFn = jest.fn()
    const tree = renderer
      .create(
        <SelectProject
          region={mockRegion}
          projects={mockProjects}
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
    expect(pushFn).not.toBeCalled()
  })
})

//
import enzyme from 'enzyme'
import toJSON from 'enzyme-to-json'
import React from 'react'

import SelectProject from '../select-project'
import {mockBundle, mockProject, mockRegion} from '../../utils/mock-data'

describe('Component > SelectProject', () => {
  it('renders correctly', () => {
    const mockProjects = [mockProject]
    const pushFn = jest.fn()
    const tree = enzyme.shallow(
      <SelectProject
        bundles={[mockBundle]}
        region={mockRegion}
        projects={mockProjects}
      />
    )
    expect(toJSON(tree)).toMatchSnapshot()
    expect(pushFn).not.toHaveBeenCalled()
  })
})

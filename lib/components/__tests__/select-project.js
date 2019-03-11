// @flow
import React from 'react'

import SelectProject from '../select-project'
import {mockWithProvider, mockBundle, mockProject, mockRegion} from '../../utils/mock-data'

describe('Component > SelectProject', () => {
  it('renders correctly', () => {
    const mockProjects = [mockProject]
    const pushFn = jest.fn()
    const {snapshot} = mockWithProvider(<SelectProject
      bundles={[mockBundle]}
      region={mockRegion}
      projects={mockProjects}
    />)
    expect(snapshot()).toMatchSnapshot()
    expect(pushFn).not.toHaveBeenCalled()
  })
})

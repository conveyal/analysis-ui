// @flow
import enzyme from 'enzyme'
import React from 'react'

import ModificationsList from '../list'
import {mockProject} from '../../../utils/mock-data.js'

describe('Component > Modification > ModificationsList', () => {
  it('renders correctly', () => {
    const props = {
      modifications: [],
      project: mockProject,
      projectId: mockProject._id,
      regionId: mockProject.regionId,

      createModification: jest.fn(),
      push: jest.fn(),
      updateModification: jest.fn()
    }

    const tree = enzyme.shallow(<ModificationsList {...props} />)
    expect(tree).toMatchSnapshot()

    const noCalls = ['createModification', 'updateModification']
    noCalls.forEach(fn => {
      expect(props[fn]).not.toHaveBeenCalled()
    })
  })
})

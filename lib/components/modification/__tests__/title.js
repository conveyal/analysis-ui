// @flow
import enzyme from 'enzyme'
import React from 'react'

import Title from '../title'
import {mockModification} from '../../../utils/mock-data'

describe('Component > Modification > Project', () => {
  it('renders correctly', () => {
    const updateModificationFn = jest.fn()
    const tree = enzyme.shallow(
      <Title
        active
        editModification={jest.fn()}
        goToEditModification={jest.fn()}
        modification={mockModification}
        name='Title'
        regionId='1234'
        updateModification={updateModificationFn}
        projectId='1234'
        showOnMap
      />
    )
    expect(tree).toMatchSnapshot()
    expect(updateModificationFn).not.toHaveBeenCalled()
    tree.unmount()
  })
})

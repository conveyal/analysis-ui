import enzyme from 'enzyme'
import React from 'react'

import {mockModification} from 'lib/utils/mock-data'

import ModificationGroup from '../group'
import ModificationGroupItem from '../group-item'

describe('Component > Modification > ModificationGroup', () => {
  it('renders correctly', () => {
    const replaceModificationFn = jest.fn()
    const tree = enzyme.shallow(
      <ModificationGroup defaultExpanded={true} type={mockModification.type}>
        <ModificationGroupItem modification={mockModification} />
      </ModificationGroup>
    )
    expect(tree).toMatchSnapshot()
    expect(replaceModificationFn).not.toHaveBeenCalled()
    tree.unmount()
  })
})

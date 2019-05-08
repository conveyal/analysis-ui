//
import enzyme from 'enzyme'
import React from 'react'

import ModificationGroup from '../group'
import {mockModification} from '../../../utils/mock-data'

describe('Component > Modification > ModificationGroup', () => {
  it('renders correctly', () => {
    const replaceModificationFn = jest.fn()
    const tree = enzyme.shallow(
      <ModificationGroup
        activeModification={mockModification}
        modifications={[mockModification]}
        type={mockModification.type}
        goToEditModification={jest.fn()}
        updateModification={jest.fn()}
      />
    )
    expect(tree).toMatchSnapshot()
    expect(replaceModificationFn).not.toHaveBeenCalled()
    tree.unmount()
  })
})

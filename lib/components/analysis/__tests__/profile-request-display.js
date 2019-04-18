// @flow
import enzyme from 'enzyme'
import React from 'react'

import {mockProfileRequest} from '../../../utils/mock-data'
import ProfileRequestDisplay from '../profile-request-display'

describe('Components > Analysis > Profile Request Display', () => {
  it('should render correctly', () => {
    const tree = enzyme.shallow(<ProfileRequestDisplay {...mockProfileRequest} />)
    expect(tree).toMatchSnapshot()
    tree.unmount()
  })
})

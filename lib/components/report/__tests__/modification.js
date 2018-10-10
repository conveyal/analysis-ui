// @flow

import React from 'react'
import renderer from 'react-test-renderer'

import Modification from '../modification'
import {mockFeed, mockModification} from '../../../utils/mock-data'

mockModification.type = 'adjust-dwell-time'

describe('Report > Modification', () => {
  it('renders correctly', () => {
    const props = {
      modification: {...mockModification, value: 2},
      feedsById: {'1': mockFeed}
    }

    // mount component
    const tree = renderer.create(<Modification {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

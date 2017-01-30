/* global describe, expect, it, jest */

import renderer from 'react-test-renderer'
import React from 'react'

import {mockModification} from '../../../utils/mock-data'

import EditAlignment from '../edit-alignment'

describe('Component > Modification > Edit Alignment', function () {
  it('renders correctly', function () {
    const props = {
      mapState: {
        modificationId: mockModification.id
      },
      modification: mockModification,
      setMapState: jest.fn(),
      update: jest.fn()
    }

    const tree = renderer.create(
      <EditAlignment {...props} />
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })
})

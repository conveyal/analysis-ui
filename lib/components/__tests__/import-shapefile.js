/* global describe, it, expect, jest */

import renderer from 'react-test-renderer'
import React from 'react'

import ImportShapefile from '../import-shapefile'

describe('Component > ImportShapefile', () => {
  it('renders correctly', () => {
    const props = {
      close: jest.fn(),
      setModification: jest.fn(),
      variants: [],
      scenarioId: '1'
    }

    // mount component
    const tree = renderer.create(
      <ImportShapefile
        {...props}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
    const noCalls = [
      'close',
      'setModification'
    ]
    noCalls.forEach((fn) => {
      expect(props[fn]).not.toBeCalled()
    })
  })
})

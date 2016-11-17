/* global describe, it, expect, jest */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
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
    const tree = mount(
      <ImportShapefile
        {...props}
        />
    )
    expect(mountToJson(tree)).toMatchSnapshot()
    const noCalls = [
      'close',
      'setModification'
    ]
    noCalls.forEach((fn) => {
      expect(props[fn]).not.toBeCalled()
    })
  })
})

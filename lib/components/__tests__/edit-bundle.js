// @flow
import React from 'react'
import renderer from 'react-test-renderer'

import EditBundle from '../edit-bundle'
import {mockBundle} from '../../utils/mock-data'

describe('Component > EditBundle', () => {
  it('renders correctly', () => {
    const props = {
      bundles: [mockBundle],
      bundle: mockBundle,
      isLoaded: true,

      deleteBundle: jest.fn(),
      saveBundle: jest.fn(),
      goToEditBundle: jest.fn(),
      goToCreateBundle: jest.fn()
    }

    // mount component
    const tree = renderer.create(<EditBundle {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
    const noCalls = ['deleteBundle', 'saveBundle']
    noCalls.forEach(fn => {
      expect(props[fn]).not.toBeCalled()
    })
  })
})

// @flow
import mock from 'jest-mock'
import React from 'react'
import renderer from 'react-test-renderer'

import EditBundle from '../edit-bundle'
import {mockBundle} from '../../utils/mock-data'

const {describe, expect, it} = global
describe('Component > EditBundle', () => {
  it('renders correctly', () => {
    const props = {
      bundles: [mockBundle],
      bundle: mockBundle,
      isLoaded: true,

      deleteBundle: mock.fn(),
      saveBundle: mock.fn(),
      goToEditBundle: mock.fn(),
      goToCreateBundle: mock.fn()
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

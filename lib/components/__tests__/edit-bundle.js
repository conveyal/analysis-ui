// @flow
import enzyme from 'enzyme'
import React from 'react'

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
    const tree = enzyme.shallow(<EditBundle {...props} />)
    expect(tree).toMatchSnapshot()
    const noCalls = ['deleteBundle', 'saveBundle']
    noCalls.forEach(fn => {
      expect(props[fn]).not.toHaveBeenCalled()
    })
    tree.unmount()
  })
})

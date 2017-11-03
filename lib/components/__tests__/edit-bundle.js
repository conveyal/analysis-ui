// @flow
import mock from 'jest-mock'
import React from 'react'
import renderer from 'react-test-renderer'

import EditBundle from '../edit-bundle'

const {describe, expect, it} = global
describe('Component > EditBundle', () => {
  it('renders correctly', () => {
    const bundle = {
      id: '1',
      feeds: [],
      name: 'Test Bundle',
      projectId: '1',
      totalFeeds: 1
    }
    const props = {
      bundles: [bundle],
      bundle,
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

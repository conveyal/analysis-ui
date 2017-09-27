/* global describe, it, expect, jest */

describe('Component > EditBundle', () => {
  const renderer = require('react-test-renderer')
  const React = require('react')
  const EditBundle = require('../edit-bundle')

  it('renders correctly', () => {
    const props = {
      addBundle: jest.fn(),
      bundle: {
        feeds: []
      },
      bundleId: '1',
      deleteBundle: jest.fn(),
      fetch: jest.fn(),
      fetchFeeds: jest.fn(),
      name: 'Test Bundle',
      projectId: '1',
      saveBundle: jest.fn()
    }

    // mount component
    const tree = renderer.create(<EditBundle {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
    const noCalls = ['addBundle', 'deleteBundle', 'saveBundle']
    noCalls.forEach(fn => {
      expect(props[fn]).not.toBeCalled()
    })
  })
})

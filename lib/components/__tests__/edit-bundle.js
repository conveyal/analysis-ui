/* global describe, it, expect, jest */

describe('Component > EditBundle', () => {
  const renderer = require('react-test-renderer')
  const React = require('react')
  const EditBundle = require('../edit-bundle')

  it('renders correctly', () => {
    const props = {
      bundle: {
        feeds: [],
        name: 'Test Bundle'
      },
      bundleId: '1',
      deleteBundle: jest.fn(),
      saveBundle: jest.fn()
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

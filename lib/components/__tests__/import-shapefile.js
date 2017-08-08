/* global describe, it, expect, jest */

describe('Component > ImportShapefile', () => {
  const renderer = require('react-test-renderer')
  const React = require('react')
  const ImportShapefile = require('../import-shapefile')

  it('renders correctly', () => {
    const props = {
      close: jest.fn(),
      setModification: jest.fn(),
      variants: [],
      scenarioId: '1'
    }

    // mount component
    const tree = renderer.create(<ImportShapefile {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
    const noCalls = ['close', 'setModification']
    noCalls.forEach(fn => {
      expect(props[fn]).not.toBeCalled()
    })
  })
})

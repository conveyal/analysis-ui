/* global describe, it, expect, jest */

describe('Component > EditProject', () => {
  const renderer = require('react-test-renderer')
  const React = require('react')
  const EditProject = require('../edit-project')

  it('renders correctly', () => {
    const props = {
      addComponentToMap: jest.fn(),
      bounds: {
        north: 1,
        east: 2,
        south: 3,
        west: 4
      },
      indicators: [],
      description: 'A test scenario',
      id: '1',
      name: 'Test Scenario',
      r5Version: '1 billion',
      removeComponentFromMap: jest.fn(),
      save: jest.fn(),
      load: jest.fn(),
      setLocally: jest.fn(),
      setCenter: jest.fn(),
      isEditing: true
    }

    // mount component
    const tree = renderer.create(
      <EditProject
        {...props}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
    expect(props['addComponentToMap']).toBeCalled()
    const noCalls = [
      'removeComponentFromMap',
      'save',
      'load',
      'setLocally',
      'setCenter'
    ]
    noCalls.forEach((fn) => {
      expect(props[fn]).not.toBeCalled()
    })
  })
})

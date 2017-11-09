// @flow

import React from 'react'
import renderer from 'react-test-renderer'

import Project from '../project'

describe('Component > Project', () => {
  it('renders correctly', () => {
    const loadR5Versions = jest.fn()
    const tree = renderer
      .create(
        <Project
          clearCurrentProject={jest.fn()}
          description='A test project'
          id='1234'
          isLoaded={false}
          loadR5Versions={loadR5Versions}
          name='Test'
        >
          Project content
        </Project>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
    expect(loadR5Versions).toBeCalled()
  })

  it('renders unsupported message correctly', () => {
    const loadR5Versions = jest.fn()
    const tree = renderer
      .create(
        <Project
          clearCurrentProject={jest.fn()}
          description='A test project'
          id='1234'
          isLoaded={false}
          loadR5Versions={loadR5Versions}
          name='Test'
          r5VersionUnsupported
        >
          Project content
        </Project>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
    expect(loadR5Versions).toBeCalled()
  })
})

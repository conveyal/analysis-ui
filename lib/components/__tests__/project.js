// @flow

import React from 'react'
import renderer from 'react-test-renderer'

import Project from '../project'

describe('Component > Project', () => {
  it('renders correctly', () => {
    const addComponentToMapFn = jest.fn()
    const loadFn = jest.fn()
    const tree = renderer
      .create(
        <Project
          addComponentToMap={addComponentToMapFn}
          id='1234'
          isLoaded={false}
          load={loadFn}
          name='Test'
          regionId='Test1234'
        >
          Project content
        </Project>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
    expect(addComponentToMapFn).not.toBeCalled()
    expect(loadFn).toBeCalled()
  })
})

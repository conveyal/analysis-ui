/* global describe, it, expect, jest */

import renderer from 'react-test-renderer'
import React from 'react'

import Project from '../project'

describe('Component > Project', () => {
  it('renders correctly', () => {
    const loadFn = jest.fn()
    const tree = renderer.create(
      <Project
        description='A test project'
        id='1234'
        isLoaded={false}
        load={loadFn}
        name='Test'
        >
        Project content
      </Project>
    ).toJSON()
    expect(tree).toMatchSnapshot()
    expect(loadFn).toBeCalled()
  })
})

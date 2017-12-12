// @flow

import React from 'react'
import renderer from 'react-test-renderer'

import Project from '../project'
import {mockProject} from '../../utils/mock-data'

describe('Component > Project', () => {
  it('renders correctly', () => {
    const deleteProjectFn = jest.fn()
    const downloadVariantFn = jest.fn()
    const loadFn = jest.fn()
    const setCurrentProjectFn = jest.fn()
    const tree = renderer
      .create(
        <Project
          _id={mockProject._id}
          children='Children content'
          deleteProject={deleteProjectFn}
          downloadVariant={downloadVariantFn}
          load={loadFn}
          project={mockProject}
          setCurrentProject={setCurrentProjectFn}
          />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
    expect(deleteProjectFn).not.toBeCalled()
    expect(downloadVariantFn).not.toBeCalled()
    expect(setCurrentProjectFn).not.toBeCalled()
    expect(loadFn).toBeCalled()
  })
})

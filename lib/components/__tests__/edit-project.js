// @flow

import renderer from 'react-test-renderer'
import React from 'react'

import EditProject from '../edit-project'
import {releaseVersions, allVersions, mockProject} from '../../utils/mock-data'

describe('Component > EditProject', () => {
  it('renders correctly', () => {
    const mockBundles = [{_id: 1, name: 'B1'}, {_id: 2, name: 'B2'}]
    const closeFn = jest.fn()
    const createFn = jest.fn()
    const deleteProjectFn = jest.fn()
    const saveFn = jest.fn()
    const tree = renderer
      .create(
        <EditProject
          bundles={mockBundles}
          close={closeFn}
          create={createFn}
          deleteProject={deleteProjectFn}
          isEditing={false}
          name='Mock Project'
          regionId='P1'
          variants={[]}
          save={saveFn}
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
    expect(closeFn).not.toBeCalled()
    expect(createFn).not.toBeCalled()
    expect(deleteProjectFn).not.toBeCalled()
    expect(saveFn).not.toBeCalled()
  })
})

// @flow
import React from 'react'

import EditProject from '../edit-project'
import {mockBundle, mockProject, mockWithProvider} from '../../utils/mock-data'

describe('Component > EditProject', () => {
  it('renders correctly', () => {
    const closeFn = jest.fn()
    const createFn = jest.fn()
    const deleteFn = jest.fn()
    const goToCreateBundleFn = jest.fn()
    const saveFn = jest.fn()
    const {snapshot} = mockWithProvider(
      <EditProject
        bundleId={mockBundle._id}
        bundleName={mockBundle.name}
        bundles={[mockBundle]}
        close={closeFn}
        create={createFn}
        deleteProject={deleteFn}
        goToCreateBundle={goToCreateBundleFn}
        isEditing={false}
        name={mockProject.name}
        project={mockProject}
        regionId={mockProject.regionId}
        save={saveFn}
        variants={[]}
      />
    )
    expect(snapshot()).toMatchSnapshot()
    expect(closeFn).not.toHaveBeenCalled()
    expect(createFn).not.toHaveBeenCalled()
    expect(deleteFn).not.toHaveBeenCalled()
    expect(goToCreateBundleFn).not.toHaveBeenCalled()
    expect(saveFn).not.toHaveBeenCalled()
  })
})

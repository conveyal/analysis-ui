/* global describe, it, expect, jest */

describe('Component > EditProject', () => {
  const renderer = require('react-test-renderer')
  const React = require('react')
  const EditProject = require('../edit-project')

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

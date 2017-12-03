/* global describe, it, expect, jest */

describe('Component > ImportModifications', () => {
  const React = require('react')
  const ImportModifications = require('../import-modifications')
  const {mount} = require('enzyme')
  const {mountToJson} = require('enzyme-to-json')

  it('renders correctly', () => {
    const copyFromProjectFn = jest.fn()
    const tree = mount(
      <ImportModifications
        candidateProjectOptions={[
          {label: 'Project 1', value: 'project-1-id'}
        ]}
        copyFromProject={copyFromProjectFn}
        toProjectId='1'
        variants={[]}
      />
    )
    expect(mountToJson(tree)).toMatchSnapshot()
    expect(copyFromProjectFn).not.toBeCalled()

    tree.find('.Select-control').simulate('keyDown', {keyCode: 40})
    tree.find('.Select-control').simulate('keyDown', {keyCode: 13})
    tree.find('.btn').simulate('click')

    expect(copyFromProjectFn).toBeCalled()
  })
})

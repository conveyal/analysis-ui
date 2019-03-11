// @flow
import message from '@conveyal/woonerf/message'
import React from 'react'
import renderer from 'react-test-renderer'
import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'

import ProjectTitle from '../project-title'
import {mockProject} from '../../utils/mock-data'

describe('Component > ProjectTitle', () => {
  function createTestData () {
    const deleteProjectFn = jest.fn()
    const downloadScenarioFn = jest.fn()
    const downloadLinesFn = jest.fn()
    const downloadStopsFn = jest.fn()
    return {
      component: (
        <ProjectTitle
          _id={mockProject._id}
          children='Children content'
          downloadScenario={downloadScenarioFn}
          downloadLines={downloadLinesFn}
          downloadStops={downloadStopsFn}
          project={mockProject}
        />
      ),
      deleteProjectFn,
      downloadScenarioFn,
      downloadLinesFn,
      downloadStopsFn
    }
  }

  afterEach(() => {
    // jsdom persists across test cases, so we need to remove stuff so it doesn't
    // get found again
    const ulTags = document.getElementsByTagName('ul')
    Object.keys(ulTags).forEach(key => {
      ulTags.item(key).remove()
    })
  })

  it('renders correctly', () => {
    const testData = createTestData()
    const tree = renderer
      .create(testData.component)
      .toJSON()
    expect(tree).toMatchSnapshot()
    expect(testData.downloadScenarioFn).not.toHaveBeenCalled()
  })

  it('should show export select dialogue', () => {
    const testData = createTestData()
    const tree = mount(testData.component)

    tree.find(`a[name="${message('project.export')}"]`).simulate('click')

    // snapshot to make sure modal is created
    expect(mountToJson(tree)).toMatchSnapshot()

    // find contents of modal
    const ulTag = document.querySelector('.CustomModal')
    if (ulTag != null) expect(ulTag.outerHTML).toMatchSnapshot()
    else throw new Error('.CustomModal did not appear')
  })
})

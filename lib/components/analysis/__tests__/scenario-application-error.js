// @flow

import React from 'react'
import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'

import ProjectApplicationError from '../project-application-error'
import {mockProjectApplicationError} from '../../../utils/mock-data'

describe('Components > Analysis > Project Application Error', () => {
  it('should render correctly', () => {
    const tree = mount(
      <ProjectApplicationError error={mockProjectApplicationError} />
    )
    // unfold the collapsible
    tree.find('[role="button"]').simulate('click')
    expect(mountToJson(tree)).toMatchSnapshot()
  })
})

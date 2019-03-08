import message from '@conveyal/woonerf/message'
import React from 'react'

import Editor from '../editor'
import {mockModification, mockWithProvider} from '../../../utils/mock-data'

const createProps = (mod) => ({
  allVariants: ['variant one', 'variant two'],
  clearActive: jest.fn(),
  copyModification: jest.fn(),
  feedIsLoaded: true,
  modification: mod,
  modificationId: mod._id,
  projectId: mod.projectId,
  regionId: '1',
  removeModification: jest.fn(),
  saveInProgress: false,
  setActive: jest.fn(),
  setMapState: jest.fn(),
  update: jest.fn(),
  updateAndRetrieveFeedData: jest.fn(),
  updateLocally: jest.fn()
})

describe('Components > Modification > Editor', () => {
  it('should render and execute functions properly', () => {
    const mod = {...mockModification, description: undefined}
    const props = createProps(mod)
    const {wrapper} = mockWithProvider(<Editor {...props} />)

    // Show edit description
    const editDescName = 'textarea[name="Edit description"]'
    expect(wrapper.find(editDescName).exists()).toBeFalsy()
    wrapper.find('a[name="Add description"]').simulate('click')
    const editDesc = wrapper.find(editDescName)
    expect(editDesc.exists()).toBeTruthy()

    // Set the new description
    const newDescription = 'new description'
    editDesc.getDOMNode().value = newDescription
    editDesc.simulate('change')
    expect(props.updateLocally.mock.calls).toHaveLength(1)
    expect(props.updateLocally.mock.calls[0][0]).toEqual({
      ...mod,
      description: newDescription
    })

    // Toggle a variant
    const checkBox = wrapper.find('input[title="variant two"]')
    mod.variants = [true, true]
    checkBox.getDOMNode().checked = true
    checkBox.simulate('change')
    expect(props.updateLocally.mock.calls[1][0]).toEqual(mod)

    // Save customized modification
    wrapper.find('a.CollapsibleButton').simulate('click')
    wrapper
      .find(`a[name="${message('modification.saveCustomized')}"]`)
      .simulate('click')
    expect(props.updateLocally.mock.calls).toHaveLength(3)

    // Remove
    window.confirm = jest.fn(() => true)
    wrapper.find(`a[name="${message('modification.deleteModification')}"]`)
      .simulate('click')
    expect(props.removeModification).toHaveBeenCalled()
  })
})

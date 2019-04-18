import message from '@conveyal/woonerf/message'
import enzyme from 'enzyme'
import React from 'react'

import Editor from '../editor'
import {mockModification} from '../../../utils/mock-data'

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
  it('should render and execute functions properly', async () => {
    const mod = {...mockModification, description: undefined}
    const props = createProps(mod)
    const wrapper = enzyme.shallow(<Editor {...props} />)
    expect(wrapper).toMatchSnapshot()

    // Show edit description
    expect(wrapper.find('TextArea').exists()).toBeFalsy()
    wrapper.find({name: 'Add description'}).dive().find('a').simulate('click')
    const editDesc = wrapper.find('TextArea').dive().find('textarea')

    // Set the new description
    const newDescription = 'new description'
    editDesc.simulate('change', {currentTarget: {value: newDescription}})
    expect(props.updateLocally.mock.calls).toHaveLength(1)
    expect(props.updateLocally.mock.calls[0][0]).toEqual({
      ...mod,
      description: newDescription
    })

    // Remove
    window.confirm = jest.fn(() => true)
    wrapper.find({name: message('modification.deleteModification')})
      .dive().find('Link').dive().find('a').simulate('click')
    expect(props.removeModification).toHaveBeenCalled()
  })
})

//
import enzyme from 'enzyme'
import React from 'react'

import ProfileRequestEditor from '../profile-request-editor'
import {mockProfileRequest} from '../../../utils/mock-data'

describe('Components > Analysis > Profile Request Editor', () => {
  it('should render correctly', () => {
    const wrapper = enzyme.shallow(
      <ProfileRequestEditor
        disabled={false}
        profileRequest={mockProfileRequest}
        setProfileRequest={jest.fn()}
      />
    )

    expect(wrapper).toMatchSnapshot()
    wrapper.unmount()
  })

  it('should react to input correctly', () => {
    const setProfileRequest = jest.fn()

    const wrapper = enzyme.shallow(
      <ProfileRequestEditor
        disabled={false}
        profileRequest={mockProfileRequest}
        setProfileRequest={setProfileRequest}
      />
    )

    // manipulate everything
    // NB the time picker should have its own unit test but this does cover it
    wrapper
      .find({name: 'fromTime'})
      .dive()
      .find('Text')
      .dive()
      .find('Input')
      .dive()
      .find('input')
      .simulate('change', ch('01:00'))
    wrapper
      .find({name: 'toTime'})
      .dive()
      .find('Text')
      .dive()
      .find('Input')
      .dive()
      .find('input')
      .simulate('change', ch('13:00'))

    expect(setProfileRequest.mock.calls[0][0].fromTime).toEqual(1 * 3600) // 1 AM is 3600s after midnight
    expect(setProfileRequest.mock.calls[1][0].toTime).toEqual(13 * 3600)

    wrapper.unmount()
  })
})

function ch(value) {
  return {
    currentTarget: {
      value
    }
  }
}

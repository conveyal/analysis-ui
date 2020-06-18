import enzyme from 'enzyme'
import React from 'react'

import {mockProfileRequest} from 'lib/utils/mock-data'

import ProfileRequestEditor from '../profile-request-editor'

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

    wrapper.unmount()
  })
})

// @flow

import React from 'react'

import ProfileRequestEditor from '../profile-request-editor'
import {mockWithProvider, mockProfileRequest} from '../../../utils/mock-data'

describe('Components > Analysis > Profile Request Editor', () => {
  it('should render correctly', () => {
    // nb using enzyme b/c react shallow rendering doesn't play nice with the date picker
    const {snapshot} = mockWithProvider(
      <ProfileRequestEditor
        disabled={false}
        profileRequest={mockProfileRequest}
        setProfileRequest={jest.fn()}
      />
    )

    expect(snapshot()).toMatchSnapshot()
  })

  it('should react to input correctly', () => {
    const setProfileRequest = jest.fn()

    const {wrapper} = mockWithProvider(
      <ProfileRequestEditor
        disabled={false}
        profileRequest={mockProfileRequest}
        setProfileRequest={setProfileRequest}
      />
    )

    // manipulate everything
    // TODO locale?
    // NB the time picker should have its own unit test but this does cover it
    wrapper.find('input[name="fromTime"]').simulate('change', ch('01:00'))
    wrapper.find('input[name="toTime"]').simulate('change', ch('13:00'))
    // TODO date picker

    expect(setProfileRequest.mock.calls[0][0].fromTime).toEqual(1 * 3600) // 1 AM is 3600s after midnight
    expect(setProfileRequest.mock.calls[1][0].toTime).toEqual(13 * 3600)
  })
})

function ch (value) {
  return {
    target: {
      value
    }
  }
}

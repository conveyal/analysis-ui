// @flow
import React from 'react'

import ProfileRequestEditor from '../profile-request-editor'
import {mockWithProvider, mockProfileRequest} from '../../../utils/mock-data'

describe('Components > Analysis > Profile Request Editor', () => {
  it('should render correctly', () => {
    // nb using enzyme b/c react shallow rendering doesn't play nice with the date picker
    const {snapshot} = mockWithProvider(
      <ProfileRequestEditor
        profileRequest={mockProfileRequest}
        updateProfileRequest={jest.fn()}
      />
    )

    expect(snapshot()).toMatchSnapshot()
  })

  it('should react to input correctly', () => {
    const updateProfileRequest = jest.fn()

    const {wrapper} = mockWithProvider(
      <ProfileRequestEditor
        profileRequest={mockProfileRequest}
        updateProfileRequest={updateProfileRequest}
      />
    )

    // manipulate everything
    // TODO locale?
    // NB the time picker should have its own unit test but this does cover it
    wrapper.find('input[name="fromTime"]').simulate('change', ch('01:00'))
    wrapper.find('input[name="toTime"]').simulate('change', ch('13:00'))
    // TODO date picker
    wrapper.find('input[name="maxTransfers"]').simulate('change', ch('5'))
    wrapper.find('input[name="monteCarloDraws"]').simulate('change', ch('319'))

    expect(updateProfileRequest.mock.calls[0][0].fromTime).toEqual(1 * 3600) // 1 AM is 3600s after midnight
    expect(updateProfileRequest.mock.calls[1][0].toTime).toEqual(13 * 3600)
    expect(updateProfileRequest.mock.calls[2][0].maxRides).toEqual(6) // five transfers is six rides
    expect(updateProfileRequest.mock.calls[3][0].monteCarloDraws).toEqual(319)
  })
})

function ch (value) {
  return {
    target: {
      value
    }
  }
}

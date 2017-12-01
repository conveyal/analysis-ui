// @flow
import React from 'react'
import ProfileRequestEditor from '../profile-request-editor'

import {mockWithProvider} from '../../../utils/mock-data'

const mockProfileRequest = {
  date: '2016-01-16',
  fromTime: 25200,
  toTime: 32400,
  accessModes: 'WALK',
  directModes: 'WALK',
  egressModes: 'WALK',
  transitModes: 'TRANSIT',
  walkSpeed: 1.3888888888888888,
  bikeSpeed: 4.166666666666667,
  carSpeed: 20,
  streetTime: 90,
  maxWalkTime: 20,
  maxBikeTime: 20,
  maxCarTime: 45,
  minBikeTime: 10,
  minCarTime: 10,
  suboptimalMinutes: 5,
  reachabilityThreshold: 0,
  bikeSafe: 1,
  bikeSlope: 1,
  bikeTime: 1,
  bikeTrafficStress: 4,
  monteCarloDraws: 200,
  maxRides: 4
}

describe('Components > Analysis > Profile Request Editor', () => {
  it('should render correctly', () => {
    const setProfileRequest = jest.fn()

    // nb using enzyme b/c react shallow rendering doesn't play nice with the date picker
    const {snapshot} = mockWithProvider(
      <ProfileRequestEditor
        profileRequest={mockProfileRequest}
        setProfileRequest={setProfileRequest}
      />
    )

    expect(snapshot()).toMatchSnapshot()
  })

  it('should react to input correctly', () => {
    const setProfileRequest = jest.fn()

    const {wrapper} = mockWithProvider(
      <ProfileRequestEditor
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
    wrapper.find('input[name="maxTransfers"]').simulate('change', ch('5'))
    wrapper.find('input[name="monteCarloDraws"]').simulate('change', ch('319'))

    expect(setProfileRequest.mock.calls[0][0].fromTime).toEqual(1 * 3600) // 1 AM is 3600s after midnight
    expect(setProfileRequest.mock.calls[1][0].toTime).toEqual(13 * 3600)
    expect(setProfileRequest.mock.calls[2][0].maxRides).toEqual(6) // five transfers is six rides
    expect(setProfileRequest.mock.calls[3][0].monteCarloDraws).toEqual(319)
  })
})

function ch (value) {
  return {
    target: {
      value
    }
  }
}

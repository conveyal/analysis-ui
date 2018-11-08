// @flow
import React from 'react'

import AdvancedSettings from '../advanced-settings'
import {
  mockProfileRequest,
  mockRegion,
  mockRegionalAnalyses,
  mockWithProvider
} from '../../../utils/mock-data'

describe('Components > Analysis > Advanced Settings', () => {
  const props = {
    showBoundsEditor: jest.fn(),
    disabled: false,
    profileRequest: mockProfileRequest,
    regionalAnalyses: mockRegionalAnalyses,
    regionBounds: mockRegion.bounds,
    hideBoundsEditor: jest.fn(),
    setProfileRequest: jest.fn()
  }
  it('should render correctly', () => {
    // nb using enzyme b/c react shallow rendering doesn't play nice with the date picker
    const {snapshot} = mockWithProvider(
      <AdvancedSettings {...props} />
    )

    expect(snapshot()).toMatchSnapshot()
  })

  it('should render correctly with expanded advanced settings', () => {
    // nb using enzyme b/c react shallow rendering doesn't play nice with the date picker
    const {snapshot, wrapper} = mockWithProvider(
      <AdvancedSettings {...props} />
    )

    wrapper.find('section a').simulate('click')

    expect(snapshot()).toMatchSnapshot()
  })

  it('should react to input correctly', () => {
    const setProfileRequest = jest.fn()

    const {wrapper} = mockWithProvider(
      <AdvancedSettings
        {...props}
        setProfileRequest={setProfileRequest}
      />
    )

    // manipulate everything
    // open advanced settings
    wrapper.find('section a').simulate('click')
    wrapper.find('input[name="maxTransfers"]').simulate('change', ch('5'))
    wrapper.find('input[name="monteCarloDraws"]').simulate('change', ch('319'))

    expect(setProfileRequest.mock.calls[0][0].maxRides).toEqual(6) // five transfers is six rides
    expect(setProfileRequest.mock.calls[1][0].monteCarloDraws).toEqual(319)
  })
})

function ch (value) {
  return {
    target: {
      value
    }
  }
}

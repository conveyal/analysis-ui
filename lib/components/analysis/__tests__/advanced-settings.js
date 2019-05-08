//
import enzyme from 'enzyme'
import React from 'react'

import AdvancedSettings from '../advanced-settings'
import {
  mockProfileRequest,
  mockRegion,
  mockRegionalAnalyses
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
    const tree = enzyme.shallow(<AdvancedSettings {...props} />)
    expect(tree).toMatchSnapshot()
    tree.unmount()
  })

  it('should render correctly with expanded advanced settings', () => {
    const tree = enzyme.mount(<AdvancedSettings {...props} />)
    tree.find('section a').simulate('click')
    expect(tree).toMatchSnapshot()
    tree.unmount()
  })

  it('should react to input correctly', () => {
    const setProfileRequest = jest.fn()

    const tree = enzyme.mount(
      <AdvancedSettings {...props} setProfileRequest={setProfileRequest} />
    )

    // manipulate everything
    // open advanced settings
    tree.find('section a').simulate('click')
    tree.find('input[name="maxTransfers"]').simulate('change', ch('5'))
    tree.find('input[name="monteCarloDraws"]').simulate('change', ch('319'))

    expect(setProfileRequest.mock.calls[0][0].maxRides).toEqual(6) // five transfers is six rides
    expect(setProfileRequest.mock.calls[1][0].monteCarloDraws).toEqual(319)

    tree.unmount()
  })
})

function ch(value) {
  return {
    target: {
      value
    }
  }
}

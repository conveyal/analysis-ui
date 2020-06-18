import {testComponent} from 'lib/utils/component'

import {
  mockProfileRequest,
  mockRegion,
  mockRegionalAnalyses
} from 'lib/utils/mock-data'

import AdvancedSettings from '../advanced-settings'

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
    const tree = testComponent(AdvancedSettings, {...props})
    const mounted = tree.shallow()
    expect(mounted).toMatchSnapshot()
    mounted.unmount()
  })
})

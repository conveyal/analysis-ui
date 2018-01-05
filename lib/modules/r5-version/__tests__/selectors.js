// @flow
import * as select from '../selectors'

const TEST_VERSIONS = [
  'v3.6.9-46',
  'v3.0.0',
  'v2.0.0',
  'v3.1.0',
  'v4.5.0',
  'v3.1.0-1'
]

describe('R5 Version > Selectors', () => {
  it('should properly select and sort all valid versions', () => {
    const validVersions = select.allValidVersions({
      r5Version: {
        versions: TEST_VERSIONS
      }
    })

    expect(validVersions).toHaveLength(4)
    expect(validVersions[0]).toBe(TEST_VERSIONS[4])
    expect(validVersions[2]).toBe(TEST_VERSIONS[5])
  })

  it('should properly select only the release versions', () => {
    const validVersions = select.releaseVersions({
      r5Version: {
        versions: TEST_VERSIONS
      }
    })

    expect(validVersions).toHaveLength(2)
    expect(validVersions[0]).toBe(TEST_VERSIONS[4])
    expect(validVersions[1]).toBe(TEST_VERSIONS[3])
  })
})

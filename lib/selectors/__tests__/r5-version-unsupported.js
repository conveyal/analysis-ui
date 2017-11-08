// @flow
import r5VersionUnsupported from '../r5-version-unsupported'
import {
  releaseVersions as release,
  allVersions as all
} from '../../utils/mock-data'

const {describe, expect, it} = global
describe('Selectors > R5 Version Unsupported', () => {
  it('should return true when the r5 version is unsupported', () => {
    const state = {
      project: {
        projects: [{
          _id: '1',
          r5Version: 'v2.0.1992' // no such version
        }],
        currentProjectId: '1',
        r5Versions: {release, all}
      }
    }

    expect(r5VersionUnsupported(state)).toBe(true)
  })

  it('should return false when the r5 version is supported', () => {
    const state = {
      project: {
        projects: [{
          _id: '1',
          r5Version: 'v3.0.0'
        }],
        currentProjectId: '1',
        r5Versions: {release, all}
      }
    }

    expect(r5VersionUnsupported(state)).toBe(false)
  })
})

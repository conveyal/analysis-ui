// @flow
import nock from 'nock'

import {ANALYSIS_URL} from '../../../constants'
import * as analysis from '../'
import {
  makeMockStore,
  mockScenarioApplicationError,
  createMockSurfaceData,
  mockProfileRequest,
  mockSurfaceParameters,
  getMockSurfaceValue
} from '../../../utils/mock-data'

describe('actions > analysis', () => {
  it('fetchTravelTimeSurface should work', () => {
    const store = makeMockStore()
    nock('http://mockhost.com')
      .post(ANALYSIS_URL)
      .reply(200)

    store.dispatch(analysis.fetchTravelTimeSurface())
    const actions = store.getActions()
    expect(actions).toHaveLength(3)
    expect(actions[0].type).toBe('set isochrone fetch status')
    expect(actions[1].type).toBe('set profile request')
    expect(actions[2].type).toBe('increment outstanding fetches')
  })

  it('handleSurface should work', () => {
    const actions = analysis.handleSurface(mockProfileRequest)(null, [{
      value: createMockSurfaceData()
    }])
    expect(actions).toHaveLength(6)
  })

  it('setIsochroneCutoff should work', () => {
    expect(analysis.setIsochroneCutoff()).toMatchSnapshot()
  })

  it('setIsochroneFetchStatus should work', () => {
    expect(analysis.setIsochroneFetchStatus()).toMatchSnapshot()
  })

  it('setIsochroneLonLat should work', () => {
    expect(analysis.setIsochroneLonLat({lon: 34, lat: 12})).toMatchSnapshot()
  })

  it('setIsochroneResults should work', () => {
    expect(analysis.setIsochroneResults()).toMatchSnapshot()
  })

  it('setActiveVariant should work', () => {
    expect(analysis.setActiveVariant()).toMatchSnapshot()
  })

  it('setComparisonProject should work', () => {
    expect(analysis.setComparisonProject({
      _id: 'COMPARISON_ID',
      bundleId: 'BUNDLE ID',
      variantIndex: 1
    })).toMatchSnapshot()
  })

  it('setProfileRequest should work', () => {
    expect(analysis.setProfileRequest({maxRides: 20})).toMatchSnapshot()
  })

  it('setScenarioApplicationErrors should work', () => {
    expect(
      analysis.setScenarioApplicationErrors([mockScenarioApplicationError])
    ).toMatchSnapshot()
  })

  it('responseToSurface should decode surface', () => {
    const surface = analysis.responseToSurface(createMockSurfaceData())
    expect(surface.zoom).toBe(mockSurfaceParameters.zoom)
    expect(surface.west).toBe(mockSurfaceParameters.west)
    expect(surface.north).toBe(mockSurfaceParameters.north)
    expect(surface.width).toBe(mockSurfaceParameters.width)
    expect(surface.height).toBe(mockSurfaceParameters.height)
    expect(surface.depth).toBe(mockSurfaceParameters.depth)

    for (let y = 0; y < surface.height; y++) {
      for (let x = 0; x < surface.width; x++) {
        for (let z = 0; z < surface.depth; z++) {
          // should have been de-delta-coded already
          const samplesThisPixel = surface.get(x, y, z)
          expect(samplesThisPixel).toBe(getMockSurfaceValue(x, y, z))
        }
      }
    }

    expect(surface.warnings).toHaveLength(1)
    expect(surface.warnings[0]).toEqual(mockScenarioApplicationError)
    expect(surface.errors).toEqual([])
  })

  it('responseToSurface should decode errors', () => {
    // pass in a POJSO, will have been parsed from json by woonerf in actual practice
    const surface = analysis.responseToSurface([mockScenarioApplicationError])
    expect(surface.errors).toEqual([mockScenarioApplicationError])
    expect(surface.warnings).toEqual([])
  })
})

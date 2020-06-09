import nock from 'nock'

import {
  makeMockStore,
  mockStores,
  mockScenarioApplicationError,
  createMockSurfaceData,
  mockSurfaceParameters,
  getMockSurfaceValue
} from 'lib/utils/mock-data'

import * as analysis from '../'

describe('actions > analysis', () => {
  it('fetchTravelTimeSurface should work', async () => {
    const store = makeMockStore(mockStores.init)
    nock('http://localhost').post('/api/analysis').reply(200)

    await store.dispatch(analysis.fetchTravelTimeSurface())

    const actions = store.getActions()
    expect(actions).toHaveLength(5)
    expect(actions[0].type).toBe('set isochrone fetch status')
    expect(actions[1].type).toBe('set requests settings')
  })

  it('handleSurface should work', () => {
    const actions = analysis.handleSurface(null, [
      {
        value: createMockSurfaceData()
      }
    ])
    expect(actions).toHaveLength(5)
  })

  it('setIsochroneFetchStatus should work', () => {
    expect(analysis.setIsochroneFetchStatus()).toMatchSnapshot()
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

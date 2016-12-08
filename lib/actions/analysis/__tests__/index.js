/* global describe, expect, it */

describe('actions > analysis', () => {
  const analysis = require('../')

  it('clearIsochroneResults should work', () => {
    expect(analysis.clearIsochroneResults()).toMatchSnapshot()
  })

  it('setIsochroneCutoff should work', () => {
    expect(analysis.setIsochroneCutoff()).toMatchSnapshot()
  })

  it('setIsochroneFetchStatus should work', () => {
    expect(analysis.setIsochroneFetchStatus()).toMatchSnapshot()
  })

  it('setIsochroneLatLng should work', () => {
    expect(analysis.setIsochroneLatLng({ lat: 12, lon: 34 })).toMatchSnapshot()
  })

  it('setIsochroneResults should work', () => {
    expect(analysis.setIsochroneResults()).toMatchSnapshot()
  })

  it('setCurrentIndicator should work', () => {
    expect(analysis.setCurrentIndicator()).toMatchSnapshot()
  })

  it('enterAnalysisMode should work', () => {
    expect(analysis.enterAnalysisMode()).toMatchSnapshot()
  })

  it('exitAnalysisMode should work', () => {
    expect(analysis.exitAnalysisMode()).toMatchSnapshot()
  })

  it('setActiveVariant should work', () => {
    expect(analysis.setActiveVariant()).toMatchSnapshot()
  })

  it('setComparisonScenarioId should work', () => {
    expect(analysis.setComparisonScenarioId()).toMatchSnapshot()
  })

  it('setComparisonModifications should work', () => {
    expect(analysis.setComparisonModifications()).toMatchSnapshot()
  })

  it('setComparisonInProgress should work', () => {
    expect(analysis.setComparisonInProgress()).toMatchSnapshot()
  })

  /* Not sure how this thing works
  it('fetchIsochrone should work', (done) => {
    const actionArgs = {
      scenarioId: '1',
      bundleId: '1',
      modifications: [],
      isochroneCutoff: 1,
      origin: 1
    }
    setGrids([])
    const actionResults = analysis.fetchIsochrone(actionArgs)
    expect(actionResults.slice(0, 2)).toMatchSnapshot()
    console.log(actionResults[2])
    actionResults[2].then((result) => {
      console.log('resolved')
      expect(result).toMatchSnapshot()
      done()
    })
  })
  */
})

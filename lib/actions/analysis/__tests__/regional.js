/* global describe, expect, it */

import * as regional from '../regional'
import nock from 'nock'

import { mockRegionalAnalyses } from '../../../utils/mock-data'

describe('Actions > Analysis > Regional', () => {
  it('setRegionalAnalyses should work', () => {
    expect(regional.setRegionalAnalyses(mockRegionalAnalyses)).toMatchSnapshot()
  })

  it('setActiveRegionalAnalyses should work', () => {
    expect(regional.setActiveRegionalAnalyses()).toMatchSnapshot()
  })

  it('setRegionalAnalysisGrids should work', () => {
    expect(regional.setRegionalAnalysisGrids()).toMatchSnapshot()
  })

  it('setMinimumImprovementProbability should work', () => {
    expect(regional.setMinimumImprovementProbability(0.42)).toMatchSnapshot()
  })

  it('deleteRegionalAnalysis should work', async () => {
    const nockHost = nock('http://mockhost.com')
      .delete('/api/regional/12321a')
      .reply(200, 'deleted')

    const [deleteLocally, deleteFromServer] = regional.deleteRegionalAnalysis('12321a')
    expect(deleteLocally).toMatchSnapshot()

    await deleteFromServer
    expect(nockHost.isDone()).toBeTruthy()
  })
  // TODO loadRegionalAnalysisGrids, runAnalysis, deleteRegionalAnalysis
})

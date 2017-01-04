/* global describe, expect, it, jest */

import React from 'react'
import renderer from 'react-test-renderer'
import Regional from '../regional-analysis-selector'

const mockRegionalAnalyses = [
  {
    zoom: 9,
    width: 300,
    height: 300,
    north: 20024,
    west: 20015,
    request: {},
    name: 'ANALYSIS 1',
    grid: 'Jobs_total',
    scenarioId: '1234',
    variant: 0,
    bundleId: '5678',
    id: 'abcd'
  },
  {
    zoom: 9,
    width: 300,
    height: 300,
    north: 20024,
    west: 20015,
    request: {},
    name: 'ANALYSIS 2',
    grid: 'Jobs_total',
    scenarioId: '4321',
    variant: 1,
    bundleId: '5678',
    id: 'efgh'
  }
]

describe('Components > Analysis > Regional Analysis Selector', () => {
  it('renders correctly', () => {
    const load = jest.fn()

    const tree = renderer.create(
      <Regional
        regionalAnalyses={mockRegionalAnalyses}
        scenarioId='1234'
        variantIndex={0}
        regionalAnalysisLayerOnMap={false}
        regionalComparisonLayerOnMap={false}
        minimumImprovementProbability={0.75}
        loadRegionalAnalyses={load}
        />
    ).toJSON()

    expect(load).toBeCalled()
    expect(tree).toMatchSnapshot()
  })

  it('renders a comparison selection correctly', () => {
    // snapshot should have second analysis in dropdown
    const load = jest.fn()

    const tree = renderer.create(
      <Regional
        regionalAnalyses={mockRegionalAnalyses}
        scenarioId='1234'
        variantIndex={0}
        regionalAnalysisLayerOnMap
        regionalComparisonLayerOnMap={false}
        minimumImprovementProbability={0.75}
        activeRegionalAnalysis={'abcd'}
        loadRegionalAnalyses={load}
        />
    ).toJSON()

    expect(load).toBeCalled()
    expect(tree).toMatchSnapshot()
  })

  // snapshot should have all the comparison controls rendered
  it('renders a comparison correctly', () => {
    const load = jest.fn()

    const tree = renderer.create(
      <Regional
        regionalAnalyses={mockRegionalAnalyses}
        scenarioId='1234'
        variantIndex={0}
        regionalAnalysisLayerOnMap
        regionalComparisonLayerOnMap
        minimumImprovementProbability={0.75}
        activeRegionalAnalysis={'abcd'}
        comparisonRegionalAnalysis={'efgh'}
        loadRegionalAnalyses={load}
        />
    ).toJSON()

    expect(load).toBeCalled()
    expect(tree).toMatchSnapshot()
  })
})

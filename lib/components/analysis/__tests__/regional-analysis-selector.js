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
    const select = jest.fn()

    const tree = renderer.create(
      <Regional
        loadRegionalAnalyses={load}
        projectId='5678'
        regionalAnalyses={mockRegionalAnalyses}
        scenarioId='1234'
        selectRegionalAnalysis={select}
        />
    ).toJSON()

    expect(load).toBeCalled()
    expect(select).not.toBeCalled()
    expect(tree).toMatchSnapshot()
  })
})

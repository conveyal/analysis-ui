/* global describe, expect, it, jest */

import uuid from 'uuid'
import React from 'react'
import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import Regional from '../regional'

const mockProfileRequest = {
  date: '2016-01-16',
  fromTime: 25200,
  toTime: 32400,
  accessModes: 'WALK',
  directModes: 'WALK',
  egressModes: 'WALK',
  transitModes: 'TRANSIT',
  walkSpeed: 1.3888888888888888,
  bikeSpeed: 4.166666666666667,
  carSpeed: 20,
  streetTime: 90,
  maxWalkTime: 20,
  maxBikeTime: 20,
  maxCarTime: 45,
  minBikeTime: 10,
  minCarTime: 10,
  suboptimalMinutes: 5,
  reachabilityThreshold: 0,
  bikeSafe: 1,
  bikeSlope: 1,
  bikeTime: 1,
  bikeTrafficStress: 4,
  monteCarloDraws: 200,
  maxRides: 4
}

const mockRegionalAnalyses = [
  {
    zoom: 9,
    width: 300,
    height: 300,
    north: 20024,
    west: 20015,
    name: 'ANALYSIS 1',
    grid: 'Jobs_total',
    scenarioId: '1234',
    variant: 0,
    bundleId: '5678',
    cutoffMinutes: 60,
    id: 'abcd',
    request: mockProfileRequest
  },
  {
    zoom: 9,
    width: 300,
    height: 300,
    north: 20024,
    west: 20015,
    name: 'ANALYSIS 2',
    grid: 'Jobs_total',
    scenarioId: '4321',
    variant: 1,
    bundleId: '5678',
    cutoffMinutes: 60,
    id: 'efgh',
    request: mockProfileRequest
  }
]

const mockGrid = {
  zoom: 9,
  width: 300,
  height: 300,
  north: 20024,
  west: 20015,
  data: [],
  min: 0,
  max: 2000
}

describe('Components > Analysis > Regional', () => {
  it('should render correctly', () => {
    const addRegionalAnalysisLayerToMap = jest.fn()
    const setActiveRegionalAnalysis = jest.fn()
    const tree = mount(<Regional
      regionalAnalyses={mockRegionalAnalyses}
      analysis={mockRegionalAnalyses[0]}
      analysisId={mockRegionalAnalyses[0].id}
      projectId='MOCK'
      indicators={[{ name: 'Total jobs', key: 'Jobs_total' }]}
      grid={mockGrid}
      breaks={[100, 500, 1000, 2000]}
      minimumImprovementProbability={0.83}
      addRegionalAnalysisLayerToMap={addRegionalAnalysisLayerToMap}
      setActiveRegionalAnalysis={setActiveRegionalAnalysis}
      />)

    expect(mountToJson(tree)).toMatchSnapshot()

    expect(addRegionalAnalysisLayerToMap).toHaveBeenCalledTimes(1)
    expect(setActiveRegionalAnalysis).toHaveBeenLastCalledWith({ id: mockRegionalAnalyses[0].id, percentile: 'mean' })
  })

  it('should load analysis if it is not loaded', () => {
    const addRegionalAnalysisLayerToMap = jest.fn()
    const setActiveRegionalAnalysis = jest.fn()
    const loadRegionalAnalyses = jest.fn()
    const tree = mount(<Regional
      regionalAnalyses={mockRegionalAnalyses}
      analysisId={mockRegionalAnalyses[0].id}
      projectId='MOCK'
      indicators={[{ name: 'Total jobs', key: 'Jobs_total' }]}
      grid={mockGrid}
      breaks={[100, 500, 1000, 2000]}
      minimumImprovementProbability={0.83}
      addRegionalAnalysisLayerToMap={addRegionalAnalysisLayerToMap}
      setActiveRegionalAnalysis={setActiveRegionalAnalysis}
      loadRegionalAnalyses={loadRegionalAnalyses}
      />)

    expect(mountToJson(tree)).toMatchSnapshot()

    expect(addRegionalAnalysisLayerToMap).toHaveBeenCalledTimes(1)
    expect(setActiveRegionalAnalysis).toHaveBeenLastCalledWith({ id: mockRegionalAnalyses[0].id, percentile: 'mean' })
    expect(loadRegionalAnalyses).toHaveBeenLastCalledWith('MOCK')
  })

  it('should handle rendering comparison', () => {
    // Slider uses UUIDs to sync output and slider, mock that module so as not to break snapshots
    uuid.v4 = () => '00000000-0000-0000-0000-000000000000'

    const addRegionalAnalysisLayerToMap = jest.fn()
    const setActiveRegionalAnalysis = jest.fn()
    const setMinimumImprovementProbability = jest.fn()
    const tree = mount(<Regional
      regionalAnalyses={mockRegionalAnalyses}
      analysis={mockRegionalAnalyses[0]}
      comparisonAnalysis={mockRegionalAnalyses[1]}
      analysisId={mockRegionalAnalyses[0].id}
      projectId='MOCK'
      indicators={[{ name: 'Total jobs', key: 'Jobs_total' }]}
      grid={mockGrid}
      differenceGrid={mockGrid}
      breaks={[100, 500, 1000, 2000]}
      minimumImprovementProbability={0.83}
      addRegionalAnalysisLayerToMap={addRegionalAnalysisLayerToMap}
      setActiveRegionalAnalysis={setActiveRegionalAnalysis}
      setMinimumImprovementProbability={setMinimumImprovementProbability}
      />)

    tree.find('input[type="range"]').simulate('change', { target: { value: 0.55 } })

    expect(mountToJson(tree)).toMatchSnapshot()
    expect(setMinimumImprovementProbability).toHaveBeenLastCalledWith(0.55)
  })
})

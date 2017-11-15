import React from 'react'
import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'

import {mockGrid, mockRegionalAnalyses} from '../../../utils/mock-data'
import Regional from '../regional-results'

const {describe, expect, it} = global
describe('Components > Analysis > Regional', () => {
  it('should render correctly', () => {
    const addRegionalAnalysisLayerToMap = jest.fn()
    const setActiveRegionalAnalysis = jest.fn()
    const tree = mount(
      <Regional
        analysis={mockRegionalAnalyses[0]}
        analysisId={mockRegionalAnalyses[0]._id}
        breaks={[100, 500, 1000, 2000]}
        opportunityDatasets={[{name: 'Total jobs', key: 'Jobs_total'}]}
        minimumImprovementProbability={0.83}
        regionId='MOCK'
        grid={mockGrid}
        regionalAnalyses={mockRegionalAnalyses}
        // actions
        addRegionalAnalysisLayerToMap={addRegionalAnalysisLayerToMap}
        addRegionalComparisonLayerToMap={jest.fn()}
        fetch={jest.fn()}
        loadRegionalAnalyses={jest.fn()}
        removeRegionalAnalysisLayerFromMap={jest.fn()}
        removeRegionalComparisonLayerFromMap={jest.fn()}
        setActiveRegionalAnalysis={setActiveRegionalAnalysis}
        setMinimumImprovementProbability={jest.fn()}
        aggregationAreas={[]}
      />
    )

    expect(mountToJson(tree)).toMatchSnapshot()

    expect(addRegionalAnalysisLayerToMap).toHaveBeenCalledTimes(1)
    expect(setActiveRegionalAnalysis).toHaveBeenLastCalledWith({
      _id: mockRegionalAnalyses[0]._id
    })
  })

  it('should handle rendering comparison', () => {
    const addRegionalAnalysisLayerToMap = jest.fn()
    const setActiveRegionalAnalysis = jest.fn()
    const setMinimumImprovementProbability = jest.fn()
    const tree = mount(
      <Regional
        regionalAnalyses={mockRegionalAnalyses}
        analysis={mockRegionalAnalyses[0]}
        comparisonAnalysis={mockRegionalAnalyses[1]}
        analysisId={mockRegionalAnalyses[0]._id}
        regionId='MOCK'
        opportunityDatasets={[{name: 'Total jobs', key: 'Jobs_total'}]}
        grid={mockGrid}
        differenceGrid={mockGrid}
        breaks={[100, 500, 1000, 2000]}
        minimumImprovementProbability={0.83}
        // actions
        addRegionalAnalysisLayerToMap={addRegionalAnalysisLayerToMap}
        addRegionalComparisonLayerToMap={jest.fn()}
        fetch={jest.fn()}
        loadRegionalAnalyses={jest.fn()}
        removeRegionalAnalysisLayerFromMap={jest.fn()}
        removeRegionalComparisonLayerFromMap={jest.fn()}
        setActiveRegionalAnalysis={setActiveRegionalAnalysis}
        setMinimumImprovementProbability={setMinimumImprovementProbability}
        aggregationAreas={[]}
      />
    )

    tree.find('input[type="range"]').simulate('change', {target: {value: 0.55}})

    expect(mountToJson(tree)).toMatchSnapshot()
    expect(setMinimumImprovementProbability).toHaveBeenLastCalledWith(0.55)
  })
})

// @flow
import React from 'react'

import {mockWithProvider, mockGrid, mockRegionalAnalyses} from '../../../utils/mock-data'
import Regional from '../regional-results'

describe('Components > Analysis > Regional', () => {
  it('should render correctly', () => {
    const addRegionalAnalysisLayerToMap = jest.fn()
    const setActiveRegionalAnalysis = jest.fn()
    const {snapshot} = mockWithProvider(
      <Regional
        accessToName='Grid name'
        aggregationAreas={[]}
        analysis={mockRegionalAnalyses[0]}
        analysisId={mockRegionalAnalyses[0]._id}
        breaks={[100, 500, 1000, 2000]}
        opportunityDatasets={[{name: 'Total jobs', key: 'Jobs_total'}]}
        minimumImprovementProbability={0.83}
        regionId='MOCK_REGION_ID'
        projectId='MOCK_PROJECT_ID'
        grid={mockGrid}
        regionalAnalyses={mockRegionalAnalyses}
        // actions
        addAggregationAreaComponentToMap={jest.fn()}
        addRegionalAnalysisLayerToMap={addRegionalAnalysisLayerToMap}
        addRegionalComparisonLayerToMap={jest.fn()}
        deleteAnalysis={jest.fn()}
        fetch={jest.fn()}
        loadRegionalAnalyses={jest.fn()}
        removeRegionalAnalysisLayerFromMap={jest.fn()}
        removeRegionalComparisonLayerFromMap={jest.fn()}
        setActiveRegionalAnalysis={setActiveRegionalAnalysis}
        setAggregationArea={jest.fn()}
        setAggregationWeights={jest.fn()}
        setMinimumImprovementProbability={jest.fn()}
        removeAggregationAreaComponentFromMap={jest.fn()}
        uploadAggregationArea={jest.fn()}
      />
    )

    expect(snapshot()).toMatchSnapshot()

    expect(addRegionalAnalysisLayerToMap).toHaveBeenCalledTimes(1)
    expect(setActiveRegionalAnalysis).toHaveBeenLastCalledWith({
      _id: mockRegionalAnalyses[0]._id
    })
  })

  it('should handle rendering comparison', () => {
    const addRegionalAnalysisLayerToMap = jest.fn()
    const setActiveRegionalAnalysis = jest.fn()
    const setMinimumImprovementProbability = jest.fn()
    const {wrapper, snapshot} = mockWithProvider(
      <Regional
        accessToName='Grid name'
        aggregationAreas={[]}
        regionalAnalyses={mockRegionalAnalyses}
        analysis={mockRegionalAnalyses[0]}
        comparisonAnalysis={mockRegionalAnalyses[1]}
        analysisId={mockRegionalAnalyses[0]._id}
        projectId='MOCK_PROJECT_ID'
        regionId='MOCK_REGION_ID'
        opportunityDatasets={[{name: 'Total jobs', key: 'Jobs_total'}]}
        grid={mockGrid}
        differenceGrid={mockGrid}
        breaks={[100, 500, 1000, 2000]}
        minimumImprovementProbability={0.83}
        // actions
        addAggregationAreaComponentToMap={jest.fn()}
        addRegionalAnalysisLayerToMap={addRegionalAnalysisLayerToMap}
        addRegionalComparisonLayerToMap={jest.fn()}
        deleteAnalysis={jest.fn()}
        fetch={jest.fn()}
        loadRegionalAnalyses={jest.fn()}
        removeAggregationAreaComponentFromMap={jest.fn()}
        removeRegionalAnalysisLayerFromMap={jest.fn()}
        removeRegionalComparisonLayerFromMap={jest.fn()}
        setActiveRegionalAnalysis={setActiveRegionalAnalysis}
        setAggregationArea={jest.fn()}
        setAggregationWeights={jest.fn()}
        setMinimumImprovementProbability={setMinimumImprovementProbability}
        uploadAggregationArea={jest.fn()}
      />
    )

    wrapper.find('input[type="range"]').simulate('change', {target: {value: 0.55}})

    expect(snapshot()).toMatchSnapshot()
    expect(setMinimumImprovementProbability).toHaveBeenLastCalledWith(0.55)
  })
})

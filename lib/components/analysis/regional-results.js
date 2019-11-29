import get from 'lodash/get'
import React from 'react'

import colors from 'lib/constants/colors'
import useOnMount from 'lib/hooks/use-on-mount'
import message from 'lib/message'

import Select from '../select'
import {Group} from '../input'
import P from '../p'

import ProfileRequestDisplay from './profile-request-display'
import Legend from './legend'
import AggregationArea from './aggregation-area'
import AggregateAccessibility from './aggregate-accessibility'

/**
 * Render a regional analysis results.
 */
export default function RegionalResults(p) {
  useOnMount(() => {
    p.loadRegionalAnalysisGrids({_id: p.analysisId})
  })

  function selectComparisonAnalysis(chosen) {
    const ids = {_id: p.analysisId, comparisonId: undefined}
    if (chosen != null) ids.comparisonId = chosen._id

    p.setActiveRegionalAnalysis(ids)
    p.loadRegionalAnalysisGrids(ids)
  }

  function findOpportunityDatasetName(_id) {
    const value = p.opportunityDatasets.find(i => i._id === _id)
    return get(value, 'name', _id)
  }

  return (
    <>
      <Group label={message('analysis.compareTo')}>
        <Select
          isClearable
          getOptionLabel={ra => ra.name}
          getOptionValue={ra => ra._id}
          onChange={selectComparisonAnalysis}
          options={p.comparisonAnalyses}
          value={p.comparisonAnalyses.find(
            ra => ra._id === get(p.comparisonAnalysis, '_id')
          )}
        />
      </Group>

      {p.comparisonAnalysis && (
        <>
          {p.analysis.workerVersion !== p.comparisonAnalysis.workerVersion && (
            <div className='alert alert-danger'>
              {message('r5Version.comparisonIsDifferent')}
            </div>
          )}

          <ProfileRequestDisplay
            {...p.comparisonAnalysis}
            {...p.comparisonAnalysis.request}
          />
        </>
      )}

      <Group label='Access to'>
        <P>
          {p.analysis.travelTimePercentile !== -1
            ? message('analysis.accessTo', {
                opportunity: findOpportunityDatasetName(p.analysis.grid),
                cutoff: p.analysis.cutoffMinutes,
                percentile: p.analysis.travelTimePercentile
              })
            : message('analysis.accessToInstantaneous', {
                opportunity: findOpportunityDatasetName(p.analysis.grid),
                cutoff: p.analysis.cutoffMinutes
              })}
        </P>

        {p.comparisonAnalysis && (
          <P>
            {p.comparisonAnalysis.travelTimePercentile !== -1
              ? message('analysis.comparisonAccessTo', {
                  opportunity: findOpportunityDatasetName(
                    p.comparisonAnalysis.grid
                  ),
                  cutoff: p.comparisonAnalysis.cutoffMinutes,
                  percentile: p.comparisonAnalysis.travelTimePercentile
                })
              : message('analysis.comparisonAccessToInstantaneous', {
                  opportunity: findOpportunityDatasetName(
                    p.comparisonAnalysis.grid
                  ),
                  cutoff: p.comparisonAnalysis.cutoffMinutes
                })}
          </P>
        )}
      </Group>

      {p.grid ? (
        <Legend
          breaks={p.breaks}
          min={
            p.comparisonAnalysis != null && p.differenceGrid != null
              ? p.differenceGrid.min
              : p.grid.min
          }
          colors={
            p.comparisonAnalysis != null
              ? colors.REGIONAL_COMPARISON_GRADIENT
              : colors.REGIONAL_GRADIENT
          }
        />
      ) : (
        <P>Loading grids...</P>
      )}

      <AggregationArea regionId={p.regionId} />

      {p.analysis && p.aggregateAccessibility && p.aggregationWeightsId && (
        <AggregateAccessibility
          aggregateAccessibility={p.aggregateAccessibility}
          comparisonAggregateAccessibility={p.comparisonAggregateAccessibility}
          weightByName={findOpportunityDatasetName(p.aggregationWeightsId)}
          accessToName={findOpportunityDatasetName(p.analysis.grid)}
          regionalAnalysisName={p.analysis.name}
          comparisonAccessToName={
            p.comparisonAnalysis
              ? findOpportunityDatasetName(p.comparisonAnalysis.grid)
              : ''
          }
          comparisonRegionalAnalysisName={get(p.comparisonAnalysis, 'name')}
        />
      )}
    </>
  )
}

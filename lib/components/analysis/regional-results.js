import get from 'lodash/get'
import React, {Component} from 'react'

import colors from 'lib/constants/colors'
import message from 'lib/message'

import Select from '../select'
import {Group} from '../input'

import ProfileRequestDisplay from './profile-request-display'
import Legend from './legend'
import AggregationArea from './aggregation-area'
import AggregateAccessibility from './aggregate-accessibility'

/** render a regional analysis */
export default class RegionalResults extends Component {
  componentDidMount() {
    this.props.loadRegionalAnalysisGrids({_id: this.props.analysisId})
  }

  selectComparisonAnalysis = chosen => {
    const ids = {_id: this.props.analysisId, comparisonId: undefined}
    if (chosen != null) ids.comparisonId = chosen._id

    this.props.setActiveRegionalAnalysis(ids)
    this.props.loadRegionalAnalysisGrids(ids)
  }

  render() {
    const p = this.props

    return (
      <>
        {p.analysis && (
          <Group label={message('analysis.compareTo')}>
            <Select
              isClearable
              getOptionLabel={ra => ra.name}
              getOptionValue={ra => ra._id}
              onChange={this.selectComparisonAnalysis}
              options={p.comparisonAnalyses}
              value={p.comparisonAnalyses.find(
                ra => ra._id === get(p.comparisonAnalysis, '_id')
              )}
            />
          </Group>
        )}

        {p.comparisonAnalysis && (
          <>
            {p.analysis.workerVersion !==
              p.comparisonAnalysis.workerVersion && (
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
          <p>
            {p.analysis.travelTimePercentile !== -1
              ? message('analysis.accessTo', {
                  opportunity: this.findOpportunityDatasetName(p.analysis.grid),
                  cutoff: p.analysis.cutoffMinutes,
                  percentile: p.analysis.travelTimePercentile
                })
              : message('analysis.accessToInstantaneous', {
                  opportunity: this.findOpportunityDatasetName(p.analysis.grid),
                  cutoff: p.analysis.cutoffMinutes
                })}
          </p>

          {p.comparisonAnalysis && (
            <p>
              {p.comparisonAnalysis.travelTimePercentile !== -1
                ? message('analysis.comparisonAccessTo', {
                    opportunity: this.findOpportunityDatasetName(
                      p.comparisonAnalysis.grid
                    ),
                    cutoff: p.comparisonAnalysis.cutoffMinutes,
                    percentile: p.comparisonAnalysis.travelTimePercentile
                  })
                : message('analysis.comparisonAccessToInstantaneous', {
                    opportunity: this.findOpportunityDatasetName(
                      p.comparisonAnalysis.grid
                    ),
                    cutoff: p.comparisonAnalysis.cutoffMinutes
                  })}
            </p>
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
          <p>Loading grids...</p>
        )}

        <AggregationArea
          activeId={p.aggregationAreaId}
          areas={p.aggregationAreas}
          regionId={p.regionId}
          setActive={aa =>
            aa
              ? p.setAggregationArea({
                  regionId: p.regionId,
                  aggregationAreaId: aa._id
                })
              : p.setAggregationArea()
          }
          uploadAggregationArea={p.uploadAggregationArea}
          uploadInProgress={p.aggregationAreaUploadInProgress}
        />

        {p.analysis && p.aggregateAccessibility && p.aggregationWeightsId && (
          <AggregateAccessibility
            aggregateAccessibility={p.aggregateAccessibility}
            comparisonAggregateAccessibility={
              p.comparisonAggregateAccessibility
            }
            weightByName={this.findOpportunityDatasetName(
              p.aggregationWeightsId
            )}
            accessToName={this.findOpportunityDatasetName(p.analysis.grid)}
            regionalAnalysisName={p.analysis.name}
            comparisonAccessToName={
              p.comparisonAnalysis
                ? this.findOpportunityDatasetName(p.comparisonAnalysis.grid)
                : ''
            }
            comparisonRegionalAnalysisName={get(p.comparisonAnalysis, 'name')}
          />
        )}
      </>
    )
  }

  findOpportunityDatasetName(_id) {
    const value = this.props.opportunityDatasets.find(i => i._id === _id)
    return get(value, 'name', _id)
  }
}

import {color} from 'd3-color'
import {format} from 'd3-format'
import React, {PureComponent} from 'react'
import memoize from 'lodash/memoize'

import message from 'lib/message'
import colors from 'lib/constants/colors'
import {UNDEFINED_PROJECT_NAME} from 'lib/constants'

import {Button, Group as ButtonGroup} from '../buttons'
import P from '../p'

import StackedPercentile from './stacked-percentile'

export const PROJECT = 'project'
export const BASE = 'base'
export const COMPARISON = 'comparison'

const GRAPH_HEIGHT = 300
const GRAPH_WIDTH = 600

/**
 * A component allowing toggling between up to two stacked percentile plots and
 * comparisons of said
 */
export default class StackedPercentileSelector extends PureComponent {
  state = {
    scenarioPlotted: PROJECT
  }

  _selectView = memoize(scenarioPlotted => () =>
    this.setState({scenarioPlotted})
  )

  render() {
    const p = this.props
    if (p.accessibility == null) return null

    const {
      accessibility,
      comparisonAccessibility,
      comparisonInProgress,
      comparisonPercentileCurves,
      comparisonProjectName,
      disabled,
      opportunityDatasetName,
      isochroneCutoff,
      maxAccessibility,
      nearestPercentile,
      percentileCurves,
      projectName,
      stale
    } = this.props
    const {scenarioPlotted} = this.state
    const noComparison =
      !comparisonProjectName && comparisonProjectName !== UNDEFINED_PROJECT_NAME

    const commaFormat = format(',d')

    const projectColor =
      disabled || stale
        ? colors.STALE_PERCENTILE_COLOR
        : colors.PROJECT_PERCENTILE_COLOR
    const comparisonColor =
      disabled || stale
        ? colors.STALE_PERCENTILE_COLOR
        : colors.COMPARISON_PERCENTILE_COLOR

    const colorBar = color(projectColor)
    colorBar.opacity = 0.3
    const comparisonColorBar = color(comparisonColor)
    comparisonColorBar.opacity = 0.3

    return (
      <>
        {!stale && (
          <P>
            {message('analysis.accessibilityTo')}{' '}
            <strong>
              {opportunityDatasetName ||
                `[${message('analysis.selectOpportunityDataset')}]`}
            </strong>{' '}
            in <strong>{isochroneCutoff}</strong> minutes (travel time
            percentile: <strong>{nearestPercentile}</strong>th)
          </P>
        )}
        {stale && <P>{message('analysis.willUpdate')}</P>}

        <div className='progress' style={{marginBottom: '4px'}}>
          <div
            className='progress-bar'
            role='progressbar'
            style={{
              backgroundColor: colorBar.toString(),
              minWidth: '3em',
              width: `${((accessibility || 1) / maxAccessibility) * 100}%`
            }}
          >
            {commaFormat(accessibility)}
          </div>
        </div>

        {comparisonInProgress &&
          comparisonProjectName &&
          comparisonAccessibility != null && (
            <div className='progress' style={{marginBottom: '4px'}}>
              <div
                className='progress-bar'
                role='progressbar'
                style={{
                  backgroundColor: comparisonColorBar.toString(),
                  minWidth: '3em',
                  width: `${(comparisonAccessibility / maxAccessibility) *
                    100}%`
                }}
              >
                {commaFormat(comparisonAccessibility)}
              </div>
            </div>
          )}

        {comparisonAccessibility !== null && (
          <ButtonGroup justified>
            <Button
              active={noComparison || scenarioPlotted === PROJECT}
              disabled={noComparison}
              onClick={this._selectView(PROJECT)}
              size='sm'
              value={PROJECT}
            >
              {projectName}
            </Button>
            <Button
              active={!noComparison && scenarioPlotted === BASE}
              disabled={noComparison}
              onClick={this._selectView(BASE)}
              size='sm'
            >
              {comparisonProjectName || 'No comparison selected'}
            </Button>
            <Button
              active={!noComparison && scenarioPlotted === COMPARISON}
              disabled={noComparison}
              onClick={this._selectView(COMPARISON)}
              size='sm'
            >
              {message('analysis.comparison')}
            </Button>
          </ButtonGroup>
        )}

        {percentileCurves && (
          <StackedPercentile
            percentileCurves={percentileCurves}
            comparisonPercentileCurves={comparisonPercentileCurves}
            width={GRAPH_WIDTH}
            height={GRAPH_HEIGHT}
            isochroneCutoff={isochroneCutoff}
            opportunityDatasetName={opportunityDatasetName}
            textColor={'#333333'}
            color={projectColor}
            comparisonColor={comparisonColor}
            maxAccessibility={maxAccessibility}
            selected={comparisonPercentileCurves ? scenarioPlotted : PROJECT}
            label={projectName}
            comparisonLabel={comparisonProjectName}
          />
        )}
      </>
    )
  }
}

// @flow
import message from '@conveyal/woonerf/message'
import {color} from 'd3-color'
import {format} from 'd3-format'
import React, {PureComponent} from 'react'
import memoize from 'lodash/memoize'

import {Button, Group as ButtonGroup} from '../buttons'
import colors from '../../constants/colors'
import {UNDEFINED_PROJECT_NAME} from '../../constants'

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
  props: {
    accessibility?: number,
    comparisonAccessibility?: number,
    comparisonInProgress: boolean,
    comparisonPercentileCurves?: number[][],
    comparisonProjectName?: string,
    disabled: boolean,
    isochroneCutoff: number,
    maxAccessibility: number,
    nearestPercentile: number,
    opportunityDatasetName?: string,
    percentileCurves: number[][],
    projectName: string,
    setIsochroneCutoff: (cutoff: number) => void,
    stale: boolean
  }

  state: {
    scenarioPlotted: 'project' | 'base' | 'comparison'
  }

  state = {
    scenarioPlotted: PROJECT
  }

  _setIsochroneCutoff = (e: Event & {target: HTMLInputElement}) =>
    this.props.setIsochroneCutoff(parseInt(e.target.value))

  _selectView = memoize((scenarioPlotted: string) => () => this.setState({scenarioPlotted}))

  render () {
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
    const noComparison = !comparisonProjectName &&
      comparisonProjectName !== UNDEFINED_PROJECT_NAME

    const commaFormat = format(',d')

    const projectColor = disabled || stale
      ? colors.STALE_PERCENTILE_COLOR
      : colors.PROJECT_PERCENTILE_COLOR
    const comparisonColor = disabled || stale
      ? colors.STALE_PERCENTILE_COLOR
      : colors.COMPARISON_PERCENTILE_COLOR

    const colorBar = color(projectColor)
    colorBar.opacity = 0.3
    const comparisonColorBar = color(comparisonColor)
    comparisonColorBar.opacity = 0.3

    return (
      <div>
        {!stale &&
          <h5>
            {message('analysis.accessibilityTo')} <strong>{opportunityDatasetName ||
              `[${message('analysis.selectOpportunityDataset')}]`}</strong> in <strong>{isochroneCutoff}</strong> minutes (travel time percentile: <strong>{nearestPercentile}</strong>th)
          </h5>
        }
        {stale &&
          <h5>
            {message('analysis.willUpdate')}
          </h5>
        }
        <input
          className='form-control'
          disabled={disabled || stale}
          type='range'
          value={isochroneCutoff}
          min={1}
          max={120}
          title={message('analysis.cutoff')}
          onChange={this._setIsochroneCutoff}
          style={{
            boxShadow: 'none',
            width: 568,
            position: 'relative',
            left: 46
          }}
        />
        {accessibility !== null &&
          <div className='progress'>
            <div
              className='progress-bar'
              role='progressbar'
              style={{
                backgroundColor: colorBar.toString(),
                width: `${(accessibility || 1) / maxAccessibility * 100}%`
              }}
            >
              <div className='project-name'>{projectName}</div>
            </div>
            <div className='statistic'>
              {commaFormat(accessibility)}
            </div>
          </div>}

        {comparisonInProgress &&
          comparisonProjectName &&
          comparisonAccessibility != null &&
          <div className='progress'>
            <div
              className='progress-bar'
              role='progressbar'
              style={{
                backgroundColor: comparisonColorBar.toString(),
                width: `${comparisonAccessibility / maxAccessibility * 100}%`
              }}
            >
              <div className='project-name'>
                {`${comparisonProjectName}`}
              </div>
            </div>
            <div className='statistic'>
              {commaFormat(comparisonAccessibility)}
            </div>
          </div>}

        {comparisonAccessibility !== null &&
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
          </ButtonGroup>}

        {percentileCurves &&
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
          />}
      </div>
    )
  }
}
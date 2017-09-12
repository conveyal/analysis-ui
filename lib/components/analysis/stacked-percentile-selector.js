// @flow
import {color} from 'd3-color'
import {format} from 'd3-format'
import React, {PureComponent} from 'react'
import memoize from 'lodash/memoize'

import StackedPercentile from './stacked-percentile'
import messages from '../../utils/messages'
import {Button, Group as ButtonGroup} from '../buttons'
import colors from '../../constants/colors'

export const SCENARIO = 'scenario'
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
    comparisonPercentileCurves?: number[][],
    comparisonInProgress: boolean,
    comparisonScenarioName?: string,
    indicatorName?: string,
    isochroneCutoff: number,
    isFetchingIsochrone: boolean,
    maxAccessibility: number,
    percentileCurves: number[][],
    scenarioName: string,
    setIsochroneCutoff: (cutoff: number) => void
  }

  state = {
    selection: SCENARIO
  }

  _setIsochroneCutoff = (e: Event & {target: HTMLInputElement}) =>
    this.props.setIsochroneCutoff(parseInt(e.target.value))

  _selectView = memoize((selection: string) =>
    () => this.setState({selection}))

  render () {
    const {
      accessibility,
      comparisonAccessibility,
      comparisonInProgress,
      comparisonPercentileCurves,
      comparisonScenarioName,
      indicatorName,
      isFetchingIsochrone,
      isochroneCutoff,
      maxAccessibility,
      percentileCurves,
      scenarioName
    } = this.props
    const {selection} = this.state
    const noComparison = !comparisonScenarioName

    const commaFormat = format(',d')

    const scenarioColor = isFetchingIsochrone
      ? colors.STALE_PERCENTILE_COLOR
      : colors.SCENARIO_PERCENTILE_COLOR
    const comparisonColor = isFetchingIsochrone
      ? colors.STALE_PERCENTILE_COLOR
      : colors.COMPARISON_PERCENTILE_COLOR

    const colorBar = color(colors.SCENARIO_PERCENTILE_COLOR)
    colorBar.opacity = 0.6
    const comparisonColorBar = color(colors.COMPARISON_PERCENTILE_COLOR)
    comparisonColorBar.opacity = 0.6

    return (
      <div className='block'>
        <h5>Aggregate accessibility to {indicatorName} within {isochroneCutoff} minutes</h5>

        <div className='progress'>
          <div
            className='progress-bar'
            role='progressbar'
            style={{
              backgroundColor: colorBar.toString(),
              width: `${(accessibility || 1) / maxAccessibility * 100}%`
            }}
            >
            {`${scenarioName} ${commaFormat(accessibility)}`}
          </div>
        </div>

        {comparisonInProgress &&
          comparisonScenarioName &&
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
              {`${comparisonScenarioName} ${commaFormat(comparisonAccessibility)}`}
            </div>
          </div>}

        <ButtonGroup justified>
          <Button
            active={noComparison || selection === SCENARIO}
            disabled={noComparison}
            onClick={this._selectView(SCENARIO)}
            size='sm'
            value={SCENARIO}
          >
            {scenarioName}
          </Button>
          <Button
            active={!noComparison && selection === BASE}
            disabled={noComparison}
            onClick={this._selectView(BASE)}
            size='sm'
          >
            {comparisonScenarioName || 'No comparison selected'}
          </Button>
          <Button
            active={!noComparison && selection === COMPARISON}
            disabled={noComparison}
            onClick={this._selectView(COMPARISON)}
            size='sm'
          >
            {messages.analysis.comparison}
          </Button>
        </ButtonGroup>

        {percentileCurves &&
          <StackedPercentile
            percentileCurves={percentileCurves}
            comparisonPercentileCurves={comparisonPercentileCurves}
            width={GRAPH_WIDTH}
            height={GRAPH_HEIGHT}
            isochroneCutoff={isochroneCutoff}
            indicator={indicatorName}
            textColor={'#333333'}
            color={scenarioColor}
            comparisonColor={comparisonColor}
            maxAccessibility={maxAccessibility}
            selected={comparisonPercentileCurves ? selection : SCENARIO}
            label={scenarioName}
            comparisonLabel={comparisonScenarioName}
          />}

        <input
          className='form-control'
          type='range'
          value={isochroneCutoff}
          min={1}
          max={120}
          title={messages.analysis.cutoff}
          onChange={this._setIsochroneCutoff}
          style={{
            width: 568,
            position: 'relative',
            left: 46
          }}
        />
      </div>
    )
  }
}

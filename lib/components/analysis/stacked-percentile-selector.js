// @flow
import React, {PureComponent} from 'react'
import memoize from 'lodash/memoize'

import StackedPercentile from './stacked-percentile'
import messages from '../../utils/messages'
import {Group as ButtonGroup, RadioButton} from '../buttons'
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
    comparisonPercentileCurves?: number[][],
    comparisonScenarioName?: string,
    indicatorName?: string,
    isochroneCutoff: number,
    isFetchingIsochrone: boolean,
    percentileCurves: number[][],
    scenarioName: string,
    setIsochroneCutoff: (cutoff: number) => void
  }

  state = {
    selection: COMPARISON
  }

  setIsochroneCutoff = (e: Event & {target: HTMLInputElement}) =>
    this.props.setIsochroneCutoff(parseInt(e.target.value))

  _selectView = memoize((selection: string) =>
    (e: Event & {target: HTMLInputElement}) => {
      if (e.target.checked) this.setState({selection})
    })

  render () {
    const {
      comparisonPercentileCurves,
      isochroneCutoff
    } = this.props

    return (
      <div>
        {/* Only show selector when doing a comparison */}
        {comparisonPercentileCurves && this.renderViewSelector()}
        {this.renderStackedPercentiles()}
        <input
          type='range'
          value={isochroneCutoff}
          min={1}
          max={120}
          title={messages.analysis.cutoff}
          onChange={this.setIsochroneCutoff}
          style={{
            width: 540,
            position: 'relative',
            marginTop: '8px',
            left: 60
          }}
        />
      </div>
    )
  }

  /** Render the toggle between scenario 1, 2 and the difference */
  renderViewSelector () {
    const {scenarioName, comparisonScenarioName} = this.props

    return (
      <ButtonGroup justified>
        <RadioButton
          checked={this.state.selection === SCENARIO}
          onChange={this._selectView(SCENARIO)}
          name='selection'
          size='sm'
          value={SCENARIO}
        >
          {scenarioName}
        </RadioButton>
        <RadioButton
          checked={this.state.selection === BASE}
          onChange={this._selectView(BASE)}
          name='selection'
          size='sm'
          value={SCENARIO}
        >
          {comparisonScenarioName}
        </RadioButton>
        <RadioButton
          checked={this.state.selection === COMPARISON}
          onChange={this._selectView(COMPARISON)}
          name='selection'
          size='sm'
          value={SCENARIO}
        >
          {messages.analysis.comparison}
        </RadioButton>
      </ButtonGroup>
    )
  }

  /** Render the stacked percentile plot itself */
  renderStackedPercentiles () {
    const {
      isFetchingIsochrone,
      percentileCurves,
      comparisonPercentileCurves,
      isochroneCutoff,
      indicatorName,
      scenarioName,
      comparisonScenarioName
    } = this.props
    const {selection} = this.state

    // compute max value
    const maxAccessibility = comparisonPercentileCurves
      ? Math.max(
          computeMaxAccessibility(percentileCurves),
          computeMaxAccessibility(comparisonPercentileCurves)
        )
      : computeMaxAccessibility(percentileCurves)

    const scenarioColor = isFetchingIsochrone
      ? colors.STALE_PERCENTILE_COLOR
      : colors.SCENARIO_PERCENTILE_COLOR
    const comparisonColor = isFetchingIsochrone
      ? colors.STALE_PERCENTILE_COLOR
      : colors.COMPARISON_PERCENTILE_COLOR

    return (
      <StackedPercentile
        percentileCurves={percentileCurves}
        comparisonPercentileCurves={comparisonPercentileCurves}
        width={GRAPH_WIDTH}
        height={GRAPH_HEIGHT}
        isochroneCutoff={isochroneCutoff}
        indicator={indicatorName}
        textColor={'#444444'}
        color={scenarioColor}
        comparisonColor={comparisonColor}
        maxAccessibility={maxAccessibility}
        selected={comparisonPercentileCurves ? selection : SCENARIO}
        label={scenarioName}
        comparisonLabel={comparisonScenarioName}
      />
    )
  }
}

/**
 * Compute the maximum value of stacked percentiles
 */
function computeMaxAccessibility (data) {
  // TODO held over from spectrogram data, but we know which value is the
  // highest, it's the 120th minute of the lowest percentile travel time
  return Math.max(...data.map(iteration => Math.max(...iteration)))
}

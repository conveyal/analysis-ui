/** A component allowing toggling between up to two spectrograms and comparisons of said */

import React, { Component, PropTypes } from 'react'
import StackedPercentile from './stacked-percentile'
import messages from '../../utils/messages'
import {Group as ButtonGroup, RadioButton} from '../buttons'
import colors from '../../constants/colors'

export const SCENARIO = 'scenario'
export const BASE = 'base'
export const COMPARISON = 'comparison'

export default class SpectrogramSelector extends Component {
  static propTypes = {
    spectrogramData: PropTypes.array.isRequired,
    comparisonSpectrogramData: PropTypes.array,
    scenarioName: PropTypes.string.isRequired,
    comparisonScenarioName: PropTypes.string,
    indicatorName: PropTypes.string,
    setIsochroneCutoff: PropTypes.func.isRequired,
    isFetchingIsochrone: PropTypes.bool.isRequired
  }

  state = {
    selection: SCENARIO
  }

  render () {
    const { comparisonSpectrogramData } = this.props

    return <div>
      {/* Only show selector when doing a comparison */}
      {comparisonSpectrogramData && this.renderViewSelector()}
      {this.renderSpectrogram()}
      {this.renderCutoffSlider()}
    </div>
  }

  /** Select the spectrogram for the scenario being analyzed */
  selectScenario = (e) => {
    if (e.target.checked) this.setState({selection: SCENARIO})
  }

  /** Select the spectrogram for the comparison */
  selectComparison = (e) => {
    if (e.target.checked) this.setState({selection: BASE})
  }

  /** Select the spectrogram for the difference between the two scenarios */
  selectDifference = (e) => {
    if (e.target.checked) this.setState({selection: COMPARISON})
  }

  /** Render the toggle between scenario 1, 2 and the difference */
  renderViewSelector () {
    const { scenarioName, comparisonScenarioName } = this.props

    return <ButtonGroup>
      <RadioButton
        checked={this.state.selection === SCENARIO}
        onChange={this.selectScenario}
        name='selection'
        size='sm'
        value={SCENARIO}>
        {scenarioName}
      </RadioButton>
      <RadioButton
        checked={this.state.selection === BASE}
        onChange={this.selectComparison}
        name='selection'
        size='sm'
        value={SCENARIO}>
        {comparisonScenarioName}
      </RadioButton>
      <RadioButton
        checked={this.state.selection === COMPARISON}
        onChange={this.selectDifference}
        name='selection'
        size='sm'
        value={SCENARIO}>
        {messages.analysis.comparison}
      </RadioButton>
    </ButtonGroup>
  }

  /** Render the spectrogram itself, with the scale selector */
  renderSpectrogram () {
    const { isFetchingIsochrone, spectrogramData, comparisonSpectrogramData, isochroneCutoff, indicatorName, scenarioName, comparisonScenarioName } = this.props
    const { selection } = this.state

    // compute max value
    const maxAccessibility = comparisonSpectrogramData
      ? Math.max(computeMaxAccessibility(spectrogramData), computeMaxAccessibility(comparisonSpectrogramData))
      : computeMaxAccessibility(spectrogramData)

    const scenarioColor = isFetchingIsochrone
      ? colors.STALE_SPECTROGRAM_COLOR
      : colors.SCENARIO_SPECTROGRAM_COLOR
    const comparisonColor = isFetchingIsochrone
      ? colors.STALE_SPECTROGRAM_COLOR
      : colors.COMPARISON_SPECTROGRAM_COLOR

    return <StackedPercentile
      percentileCurves={spectrogramData}
      comparisonPercentileCurves={comparisonSpectrogramData}
      width={600}
      height={400}
      isochroneCutoff={isochroneCutoff}
      indicator={indicatorName}
      scale={this.state.scale}
      textColor={'#444444'}
      color={scenarioColor}
      comparisonColor={comparisonColor}
      maxAccessibility={maxAccessibility}
      selected={selection}
      label={scenarioName}
      comparisonLabel={comparisonScenarioName}
      />
  }

  setIsochroneCutoff = (e) => this.props.setIsochroneCutoff(parseInt(e.target.value))

  renderCutoffSlider () {
    const { isochroneCutoff } = this.props
    return <input
      type='range'
      value={isochroneCutoff}
      min={1}
      max={120}
      title={messages.analysis.cutoff}
      onChange={this.setIsochroneCutoff}
      style={{
        width: 540,
        position: 'relative',
        left: 60
      }}
      />
  }
}

/** compute the maximum value of spectrogram data */
function computeMaxAccessibility (data) {
  return Math.max(...data.map(iteration => Math.max(...iteration)))
}

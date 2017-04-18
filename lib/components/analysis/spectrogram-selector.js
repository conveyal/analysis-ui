/** A component allowing toggling between up to two spectrograms and comparisons of said */

import React, { Component, PropTypes } from 'react'
import {constructor as XorShift} from 'xorshift'
import Spectrogram, { SQUARE_ROOT, LINEAR, LOG } from './spectrogram'
import messages from '../../utils/messages'
import {Group as ButtonGroup, RadioButton} from '../buttons'
import colors from '../../constants/colors'
import Icon from '../icon'

const SCENARIO = 'scenario'
const COMPARISON = 'comparison'
const DIFFERENCE = 'difference'

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
    scale: SQUARE_ROOT,
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
    if (e.target.checked) this.setState({selection: COMPARISON})
  }

  /** Select the spectrogram for the difference between the two scenarios */
  selectDifference = (e) => {
    if (e.target.checked) this.setState({selection: DIFFERENCE})
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
        checked={this.state.selection === COMPARISON}
        onChange={this.selectComparison}
        name='selection'
        size='sm'
        value={SCENARIO}>
        {comparisonScenarioName}
      </RadioButton>
      <RadioButton
        checked={this.state.selection === DIFFERENCE}
        onChange={this.selectDifference}
        name='selection'
        size='sm'
        value={SCENARIO}>
        {messages.analysis.difference}
      </RadioButton>
    </ButtonGroup>
  }

  scaleLog = (e) => {
    if (e.target.checked) this.setState({scale: LOG})
  }

  scaleSquareRoot = (e) => {
    if (e.target.checked) this.setState({scale: SQUARE_ROOT})
  }

  scaleLinear = (e) => {
    if (e.target.checked) this.setState({scale: LINEAR})
  }

  /** Render the spectrogram itself, with the scale selector */
  renderSpectrogram () {
    const { isFetchingIsochrone, spectrogramData, comparisonSpectrogramData, isochroneCutoff, indicatorName } = this.props
    const { scale, selection } = this.state

    // compute max value
    const maxAccessibility = comparisonSpectrogramData
      ? Math.max(computeMaxAccessibility(spectrogramData), computeMaxAccessibility(comparisonSpectrogramData))
      : computeMaxAccessibility(spectrogramData)

    let data
    switch (selection) {
      case SCENARIO:
        data = spectrogramData
        break
      case COMPARISON:
        data = comparisonSpectrogramData
        break
      case DIFFERENCE:
        data = computeSpectrogramDifference(spectrogramData, comparisonSpectrogramData)
        break
      default: throw new Error('Unrecognized spectrogram selection!')
    }

    const scenarioColor = isFetchingIsochrone
      ? colors.STALE_SPECTROGRAM_COLOR
      : colors.SCENARIO_SPECTROGRAM_COLOR
    const comparisonColor = isFetchingIsochrone
      ? colors.STALE_SPECTROGRAM_COLOR
      : colors.COMPARISON_SPECTROGRAM_COLOR

    return <div style={{position: 'relative'}}>
      <Spectrogram
        data={data}
        width={600}
        height={400}
        isochroneCutoff={isochroneCutoff}
        indicator={indicatorName}
        scale={this.state.scale}
        positiveColors={['white', selection === COMPARISON ? comparisonColor : scenarioColor, 'black']}
        positiveColorStops={[0, 0.1, 0.35]}
        negativeColors={['white', comparisonColor, 'black']}
        negativeColorStops={[0, 0.1, 0.35]}
        textColor={'#444444'}
        bins={100}
        difference={selection === DIFFERENCE}
        maxAccessibility={selection === DIFFERENCE ? undefined : maxAccessibility}
        />

      <div style={{position: 'absolute', right: 30, top: 75}}>
        <ButtonGroup vertical>
          <RadioButton
            checked={scale === SQUARE_ROOT}
            onChange={this.scaleSquareRoot}
            name='scale'
            size='sm'
            value={SQUARE_ROOT}
            title={messages.analysis.squareRoot}>
            &radic;
          </RadioButton>
          <RadioButton
            checked={scale === LOG}
            onChange={this.scaleLog}
            name='scale'
            size='sm'
            value={LOG}
            title={messages.analysis.log}>
            <i>log</i>
          </RadioButton>
          <RadioButton
            checked={scale === LINEAR}
            onChange={this.scaleLinear}
            name='scale'
            size='sm'
            value={LINEAR}
            title={messages.analysis.linear}>
            <Icon type='line-chart' />
          </RadioButton>
        </ButtonGroup>
      </div>
    </div>
  }

  setIsochroneCutoff = (e) => this.props.setIsochroneCutoff(parseInt(e.target.value))

  renderCutoffSlider () {
    const { isochroneCutoff } = this.props
    return <input
      type='range'
      value={isochroneCutoff}
      min={0}
      max={120}
      title={messages.analysis.cutoff}
      onChange={this.setIsochroneCutoff}
      style={{width: 600}}
      />
  }
}

/** convolve the difference between two spectrograms, retrieving the probability of changes of a particular magnitude */
function computeSpectrogramDifference (minuend, subtrahend) {
  const difference = []
  const rng = new XorShift([minuend[0][10], subtrahend[0][10], minuend[0][20], subtrahend[0][20]])

  // sample to avoid creating enormous spectrogram data
  const outSize = Math.max(minuend.length, subtrahend.length)
  for (let i = 0; i < outSize; i++) {
    // TODO static seed for reproducible visualizations?
    const minuendComponent = minuend[rng.random() * minuend.length | 0]
    const subtrahendComponent = subtrahend[rng.random() * subtrahend.length | 0]
    // map it into an Int32Array rather than an unsigned array
    const differenceComponent = new Int32Array(minuendComponent.length)

    for (let minute = 0; minute < differenceComponent.length; minute++) {
      differenceComponent[minute] = minuendComponent[minute] - subtrahendComponent[minute]
    }

    difference.push(differenceComponent)
  }

  return difference
}

/** compute the maximum value of spectrogram data */
function computeMaxAccessibility (data) {
  // map to convert to cumulative accessibility at last minute, then take the max
  // assumes that accessibility increases as travel time increases (it had sure better).
  return Math.max(...data.map(iteration => iteration.reduce((a, b) => a + b)))
}

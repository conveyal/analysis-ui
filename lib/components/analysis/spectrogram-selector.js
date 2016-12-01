/** A component allowing toggling between up to two spectrograms and comparisons of said */

import React, { Component, PropTypes } from 'react'
import Spectrogram, { SQUARE_ROOT, LINEAR, LOG } from './spectrogram'
import messages from '../../utils/messages'
import { Group as ButtonGroup, Button } from '../buttons'
import Icon from '../icon'
import MersenneTwister from 'mersenne-twister'

const SCENARIO = 'scenario'
const COMPARISON = 'comparison'
const DIFFERENCE = 'difference'

const RNG = new MersenneTwister()

export default class SpectrogramSelector extends Component {
  static propTypes = {
    spectrogramData: PropTypes.array.isRequired,
    comparisonSpectrogramData: PropTypes.array,
    scenarioName: PropTypes.string.isRequired,
    comparisonScenarioName: PropTypes.string,
    indicatorName: PropTypes.string,
    setIsochroneCutoff: PropTypes.func.isRequired
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
    if (e.target.checked) this.setState({...this.state, selection: SCENARIO})
  }

  /** Select the spectrogram for the comparison */
  selectComparison = (e) => {
    if (e.target.checked) this.setState({...this.state, selection: COMPARISON})
  }

  /** Select the spectrogram for the difference between the two scenarios */
  selectDifference = (e) => {
    if (e.target.checked) this.setState({...this.state, selection: DIFFERENCE})
  }

  /** Render the toggle between scenario 1, 2 and the difference */
  renderViewSelector () {
    const { scenarioName, comparisonScenarioName } = this.props

    return <ButtonGroup radio>
      <Button radio checked={this.state.selection === SCENARIO}
        onChange={this.selectScenario}
        name='selection'
        value={SCENARIO}
        className='btn-small'>
        {scenarioName}
      </Button>
      <Button radio checked={this.state.selection === COMPARISON}
        onChange={this.selectComparison}
        name='selection'
        value={SCENARIO}
        className='btn-small'>
        {comparisonScenarioName}
      </Button>
      <Button radio checked={this.state.selection === DIFFERENCE}
        onChange={this.selectDifference}
        name='selection'
        value={SCENARIO}
        className='btn-small'>
        {messages.analysis.difference}
      </Button>
    </ButtonGroup>
  }

  scaleLog = (e) => {
    if (e.target.checked) this.setState({ ...this.state, scale: LOG })
  }

  scaleSquareRoot = (e) => {
    if (e.target.checked) this.setState({ ...this.state, scale: SQUARE_ROOT })
  }

  scaleLinear = (e) => {
    if (e.target.checked) this.setState({ ...this.state, scale: LINEAR })
  }

  /** Render the spectrogram itself, with the scale selector */
  renderSpectrogram () {
    const { spectrogramData, comparisonSpectrogramData, isochroneCutoff, indicatorName } = this.props
    const { scale, selection } = this.state

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

    return <div style={{position: 'relative'}}>
      <Spectrogram
        data={data}
        width={600}
        height={400}
        isochroneCutoff={isochroneCutoff}
        indicator={indicatorName}
        scale={this.state.scale}
        colors={['white', 'blue', 'black']}
        colorStops={[0, 0.1, 0.35]}
        textColor={'#444444'}
        bins={100}
        difference={selection === DIFFERENCE}
        />

      <div style={{position: 'absolute', right: 30, top: 75}}>
        <ButtonGroup vertical radio>
          <Button radio checked={scale === SQUARE_ROOT}
            onChange={this.scaleSquareRoot}
            name='scale'
            value={SQUARE_ROOT}
            className='btn-small'
            title={messages.analysis.squareRoot}>
            &radic;
          </Button>
          <Button radio checked={scale === LOG}
            onChange={this.scaleLog}
            name='scale'
            className='btn-small'
            value={LOG}
            title={messages.analysis.log}>
            <i>log</i>
          </Button>
          <Button radio checked={scale === LINEAR}
            onChange={this.scaleLinear}
            name='scale'
            className='btn-small'
            value={LINEAR}
            title={messages.analysis.linear}>
            <Icon type='line-chart' />
          </Button>
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

  // sample to avoid creating enormous spectrogram data
  const outSize = Math.max(minuend.length, subtrahend.length)
  for (let i = 0; i < outSize; i++) {
    // TODO static seed for reproducible visualizations?
    const minuendComponent = minuend[RNG.random() * minuend.length | 0]
    const subtrahendComponent = subtrahend[RNG.random() * subtrahend.length | 0]
    // map it into an Int32Array rather than an unsigned array
    const differenceComponent = new Int32Array(minuendComponent.length)

    for (let minute = 0; minute < differenceComponent.length; minute++) {
      differenceComponent[minute] = minuendComponent[minute] - subtrahendComponent[minute]
    }

    difference.push(differenceComponent)
  }

  return difference
}

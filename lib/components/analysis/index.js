/**
 * The side panel for single point analysis, including the spectrogram.
 */

import React, { Component, PropTypes } from 'react'
import Select from 'react-select'
import {sprintf} from 'sprintf-js'
import messages from '../../utils/messages'
import timeout from '../../utils/timeout'
import {getGrids} from '../../utils/browsochrones'
import Spectrogram from './spectrogram'
import Histogram from './histogram'
import {Group as ButtonGroup, Button} from '../buttons'
import Icon from '../icon'

export default class SinglePointAnalysis extends Component {
  static propTypes = {
    bundleId: PropTypes.string.isRequired,
    isochroneCutoff: PropTypes.number.isRequired,
    isFetchingIsochrone: PropTypes.bool.isRequired,
    isShowingIsochrone: PropTypes.bool.isRequired,
    isShowingOpportunities: PropTypes.bool.isRequired,
    modifications: PropTypes.array.isRequired,
    scenarioId: PropTypes.string.isRequired,
    variantIndex: PropTypes.number.isRequired,
    variantName: PropTypes.string.isRequired,
    workerVersion: PropTypes.string.isRequired,
    scenarioName: PropTypes.string.isRequired,
    accessibility: PropTypes.number,
    indicators: PropTypes.array.isRequired,
    currentIndicator: PropTypes.string,
    isochroneLatLng: PropTypes.object.isRequired,
    addIsochroneLayerToMap: PropTypes.func.isRequired,
    addOpportunityLayerToMap: PropTypes.func.isRequired,
    fetchIsochrone: PropTypes.func.isRequired,
    removeIsochroneLayerFromMap: PropTypes.func.isRequired,
    removeOpportunityLayerFromMap: PropTypes.func.isRequired,
    setIsochroneCutoff: PropTypes.func.isRequired,
    setCurrentIndicator: PropTypes.func.isRequired,
    spectrogramData: PropTypes.array,
    enterAnalysisMode: PropTypes.func.isRequired,
    exitAnalysisMode: PropTypes.func.isRequired,
    setActiveVariant: PropTypes.func.isRequired,
    clearIsochroneResults: PropTypes.func.isRequired
  }

  state = {
    scale: Spectrogram.SQUARE_ROOT
  }

  /** signal the UI to make a wider sidebar for analysis mode */
  componentWillMount () {
    this.props.enterAnalysisMode()
    this.props.setActiveVariant(this.props.activeVariant)
  }

  componentWillUnmount () {
    this.props.exitAnalysisMode()
    if (this.props.isShowingIsochrone) this.props.removeIsochroneLayerFromMap()
    if (this.props.isShowingOpportunities) this.props.removeOpportunityLayerFromMap()
    this.props.clearIsochroneResults()
  }

  async componentDidMount () {
    // wait to fetch isochrone until grids are loaded
    // TODO lazy load grids
    while (getGrids() == null) {
      await timeout(2000)
    }

    const { currentIndicator, indicators, addIsochroneLayerToMap, addOpportunityLayerToMap } = this.props
    const chosenIndicator = currentIndicator || indicators[0].key

    this.fetchIsochrone({ chosenIndicator })
    addIsochroneLayerToMap()
    addOpportunityLayerToMap()
  }

  changeIndicator = (e) => {
    this.fetchIsochrone({ chosenIndicator: e.value })
  }

  setIsochroneCutoff = (e) => {
    this.fetchIsochrone({ chosenCutoff: parseInt(e.target.value) })
  }

  fetchIsochrone = ({ chosenIndicator, chosenCutoff }) => {
    const { scenarioId, bundleId, modifications, isochroneCutoff, fetchIsochrone, isochroneLatLng, currentIndicator, workerVersion } = this.props
    fetchIsochrone({
      scenarioId,
      workerVersion,
      bundleId,
      modifications,
      isochroneCutoff: chosenCutoff || isochroneCutoff,
      origin: isochroneLatLng,
      indicator: chosenIndicator || currentIndicator
    })
  }

  render () {
    const { currentIndicator, indicators, accessibility, isochroneCutoff, spectrogramData, variantName, scenarioName } = this.props

    const indicatorName = currentIndicator != null ? indicators.find(i => i.key === currentIndicator).name : undefined

    return <div className='Analysis'>
      <h3>{scenarioName}: {variantName}</h3>
      <p>
        <Select
          name='indicator'
          label={messages.analysis.indicator}
          value={currentIndicator}
          options={indicators.map(({ name, key }) => { return { value: key, label: name } })}
          onChange={this.changeIndicator}
          />
      </p>

      {spectrogramData && <div style={{position: 'relative'}}>
        <Spectrogram
          data={spectrogramData}
          width={600}
          height={400}
          isochroneCutoff={isochroneCutoff}
          indicator={indicatorName}
          scale={this.state.scale}
          />

        <div style={{position: 'absolute', right: 30, top: 75}}>
          <ButtonGroup vertical radio>
            <Button radio checked={this.state.scale === Spectrogram.SQUARE_ROOT}
              onClick={e => this.setState({...this.state, scale: Spectrogram.SQUARE_ROOT})}
              name='scale'
              value={Spectrogram.SQUARE_ROOT}
              className='btn-small'
              title={messages.analysis.squareRoot}>
              &radic;
            </Button>
            <Button radio checked={this.state.scale === Spectrogram.LOG}
              onClick={e => this.setState({...this.state, scale: Spectrogram.LOG})}
              name='scale'
              className='btn-small'
              value={Spectrogram.LOG}
              title={messages.analysis.log}>
              <i>log</i>
            </Button>
            <Button radio checked={this.state.scale === Spectrogram.LINEAR}
              onClick={e => this.setState({...this.state, scale: Spectrogram.LINEAR})}
              name='scale'
              className='btn-small'
              value={Spectrogram.LINEAR}
              title={messages.analysis.linear}>
              <Icon type='line-chart' />
            </Button>
          </ButtonGroup>
        </div>

        <input
          type='range'
          value={isochroneCutoff}
          min={0}
          max={120}
          title={messages.analysis.cutoff}
          onChange={this.setIsochroneCutoff}
          style={{width: 600}}
          />

      <Histogram data={spectrogramData} width={600} height={250} isochroneCutoff={isochroneCutoff} />
    </div>}

      {accessibility != null && currentIndicator && <div>
        {sprintf(messages.analysis.accessibility, {
          indicator: indicatorName,
          cutoff: isochroneCutoff,
          number: accessibility
        })}
        </div>}
    </div>
  }
}

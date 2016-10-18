/**
 * The side panel for single point analysis, including the spectrogram.
 */

import React, { Component, PropTypes } from 'react'
import Select from 'react-select'
import {sprintf} from 'sprintf-js'
import messages from '../utils/messages'
import timeout from '../utils/timeout'
import {getGrids} from '../utils/browsochrones'

export default class SinglePointAnalysis extends Component {
  static propTypes = {
    bundleId: PropTypes.string.isRequired,
    isochroneCutoff: PropTypes.number.isRequired,
    isFetchingIsochrone: PropTypes.bool.isRequired,
    isShowingIsochrone: PropTypes.bool.isRequired,
    isShowingOpportunities: PropTypes.bool.isRequired,
    modifications: PropTypes.array.isRequired,
    scenarioId: PropTypes.string.isRequired,
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
    setCurrentIndicator: PropTypes.func.isRequired
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

  componentWillUnmount () {
    if (this.props.isShowingIsochrone) this.props.removeIsochroneLayerFromMap()
    if (this.props.isShowingOpportunities) this.props.removeOpportunityLayerFromMap()
  }

  changeIndicator = (e) => {
    this.fetchIsochrone({ chosenIndicator: e.value })
  }

  setIsochroneCutoff = (e) => {
    this.fetchIsochrone({ chosenCutoff: e.target.value })
  }

  fetchIsochrone = ({ chosenIndicator, chosenCutoff }) => {
    const { scenarioId, bundleId, modifications, isochroneCutoff, fetchIsochrone, isochroneLatLng, currentIndicator } = this.props
    fetchIsochrone({
      scenarioId,
      bundleId,
      modifications,
      isochroneCutoff: chosenCutoff || isochroneCutoff,
      origin: isochroneLatLng,
      indicator: chosenIndicator || currentIndicator
    })
  }

  render () {
    const { currentIndicator, indicators, accessibility, isochroneCutoff } = this.props

    return <div style={{minHeight: 600}}>
      <input
        type='range'
        value={isochroneCutoff}
        min={0}
        max={120}
        title={messages.analysis.cutoff}
        onChange={this.setIsochroneCutoff}
        />

      <Select
        name='indicator'
        label={messages.analysis.indicator}
        value={currentIndicator}
        options={indicators.map(({ name, key }) => { return { value: key, label: name } })}
        onChange={this.changeIndicator}
        />

      {accessibility != null && currentIndicator && <div>
        {sprintf(messages.analysis.accessibility, {
          indicator: indicators.find(i => i.key === currentIndicator).name,
          cutoff: isochroneCutoff,
          number: accessibility
        })}
        </div>}
    </div>
  }
}

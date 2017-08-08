import React, {Component, PropTypes} from 'react'
import Geocoder from 'react-select-geocoder'

import Icon from '../icon'

const ISOCHRONE_CUTOFF_MIN = 0
const ISOCHRONE_CUTOFF_MAX = 120
const ISOCHRONE_CUTOFF_STEP = 1

export default class Control extends Component {
  static propTypes = {
    addIsochroneLayerToMap: PropTypes.func.isRequired,
    addOpportunityLayerToMap: PropTypes.func.isRequired,
    center: PropTypes.object.isRequired,
    fetchIsochrone: PropTypes.func.isRequired,
    geocoderApiKey: PropTypes.string.isRequired,
    isochroneCutoff: PropTypes.number.isRequired,
    isochroneLonLat: PropTypes.object,
    isFetchingIsochrone: PropTypes.bool.isRequired,
    isShowingIsochrone: PropTypes.bool.isRequired,
    removeIsochroneLayerFromMap: PropTypes.func.isRequired,
    removeOpportunityLayerFromMap: PropTypes.func.isRequired,
    setIsochroneCutoff: PropTypes.func.isRequired,
    accessibility: PropTypes.number
  }

  state = {
    showGeocoder: false
  }

  _fetchIsochrone = lonlat => {
    const {
      bundleId,
      fetchIsochrone,
      isochroneLonLat,
      modifications,
      scenarioId,
      isochroneCutoff
    } = this.props
    fetchIsochrone({
      bundleId,
      origin: lonlat || isochroneLonLat,
      modifications,
      scenarioId,
      isochroneCutoff
    })
  }

  _setCenter = feature => {
    const {isShowingIsochrone, setMapCenter} = this.props
    if (feature && feature.geometry) {
      const {coordinates} = feature.geometry
      if (isShowingIsochrone) {
        setMapCenter(coordinates)
        this._fetchIsochrone(coordinates)
      } else {
        setMapCenter(coordinates)
      }
    }
    this.setState({
      ...this.state,
      showGeocoder: false
    })
  }

  _setIsochroneCutoff = e => {
    const {
      bundleId,
      isochroneLonLat,
      modifications,
      scenarioId,
      setIsochroneCutoff,
      fetchIsochrone
    } = this.props

    setIsochroneCutoff(parseInt(e.target.value, 10))

    fetchIsochrone({
      bundleId,
      origin: isochroneLonLat,
      modifications,
      scenarioId,
      isochroneCutoff: parseInt(e.target.value, 10)
    })
  }

  _showGeocoder = e => {
    this.setState({
      ...this.state,
      showGeocoder: true
    })
  }

  _toggleIsochroneLayer = e => {
    console.log()
    e.preventDefault()
    const {
      addIsochroneLayerToMap,
      isShowingIsochrone,
      removeIsochroneLayerFromMap,
      addOpportunityLayerToMap,
      removeOpportunityLayerFromMap
    } = this.props
    if (isShowingIsochrone) {
      removeIsochroneLayerFromMap()
      removeOpportunityLayerFromMap()
    } else {
      addIsochroneLayerToMap()
      addOpportunityLayerToMap()
    }
  }

  render () {
    const {
      center,
      geocoderApiKey,
      isFetchingIsochrone,
      isochroneCutoff,
      isShowingIsochrone,
      accessibility
    } = this.props
    const {showGeocoder} = this.state
    return (
      <div className='MapControl'>
        <div className='block'>
          <a
            onClick={this._toggleIsochroneLayer}
            tabIndex={0}
            title='Toggle isochrone'
          >
            <Icon type='dot-circle-o' /> Isochrone
          </a>
          {isFetchingIsochrone &&
            <Icon type='spinner' className='fa-spin pull-right' />}
          {!isFetchingIsochrone &&
            isShowingIsochrone &&
            <a
              className='pull-right'
              onClick={() =>
                this._fetchIsochrone()} /* use arrow to make sure no arguments are passed */
              tabIndex={0}
              title='Fetch new isochrones'
            >
              <Icon type='refresh' />
            </a>}
        </div>
        {isShowingIsochrone &&
          <div className='block'>
            <Icon type='clock-o' /> <span>{isochroneCutoff} minutes</span>
            <input
              className='pull-right'
              value={isochroneCutoff}
              type='range'
              min={ISOCHRONE_CUTOFF_MIN}
              max={ISOCHRONE_CUTOFF_MAX}
              step={ISOCHRONE_CUTOFF_STEP}
              onChange={this._setIsochroneCutoff}
            />
          </div>}
        {isShowingIsochrone &&
          <span>
            {accessibility} jobs accessible
          </span>}

        {showGeocoder &&
          <Geocoder
            apiKey={geocoderApiKey}
            autoBlur
            autofocus
            focusPoint={center}
            onChange={this._setCenter}
            placeholder='Search for an address...'
          />}
        {!showGeocoder &&
          <a
            className='block'
            onClick={this._showGeocoder}
            tabIndex={0}
            title='Search for an address'
          >
            <Icon type='search' /> Search
          </a>}
      </div>
    )
  }
}

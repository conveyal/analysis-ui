import React, {Component, PropTypes} from 'react'
import Geocoder from 'react-select-geocoder'

import Icon from '../icon'

const ISOCHRONE_CUTOFF_MIN = 0
const ISOCHRONE_CUTOFF_MAX = 120
const ISOCHRONE_CUTOFF_STEP = 1

export default class Control extends Component {
  static propTypes = {
    addIsochroneLayerToMap: PropTypes.func.isRequired,
    center: PropTypes.object.isRequired,
    fetchIsochrone: PropTypes.func.isRequired,
    geocoderApiKey: PropTypes.string.isRequired,
    isochroneCutoff: PropTypes.number.isRequired,
    isochroneLatLng: PropTypes.object,
    isFetchingIsochrone: PropTypes.bool.isRequired,
    isShowingIsochrone: PropTypes.bool.isRequired,
    removeIsochroneLayerFromMap: PropTypes.func.isRequired,
    setIsochroneCutoff: PropTypes.func.isRequired
  }

  state = {
    showGeocoder: false
  }

  _fetchIsochrone = (latlng) => {
    const {bundleId, fetchIsochrone, isochroneLatLng, modifications, scenarioId, isochroneCutoff} = this.props
    fetchIsochrone({
      bundleId,
      origin: latlng || isochroneLatLng,
      modifications,
      scenarioId,
      isochroneCutoff
    })
  }

  _setCenter = (feature) => {
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

  _setIsochroneCutoff = (e) => {
    const {bundleId, isochroneLatLng, modifications, scenarioId, setIsochroneCutoff, fetchIsochrone} = this.props

    setIsochroneCutoff(parseInt(e.target.value, 10))

    fetchIsochrone({
      bundleId,
      origin: isochroneLatLng,
      modifications,
      scenarioId,
      isochroneCutoff: parseInt(e.target.value, 10)
    })
  }

  _showGeocoder = (e) => {
    this.setState({
      ...this.state,
      showGeocoder: true
    })
  }

  _toggleIsochroneLayer = (e) => {
    console.log()
    e.preventDefault()
    const {addIsochroneLayerToMap, isShowingIsochrone, removeIsochroneLayerFromMap} = this.props
    if (isShowingIsochrone) {
      removeIsochroneLayerFromMap()
    } else {
      addIsochroneLayerToMap()
    }
  }

  render () {
    const {center, geocoderApiKey, isFetchingIsochrone, isochroneCutoff, isShowingIsochrone} = this.props
    const {showGeocoder} = this.state
    return (
      <div className='MapControl'>
        <div>
          <a
            onClick={this._toggleIsochroneLayer}
            title='Toggle isochrone'
            >
            <Icon type='dot-circle-o' /> Isochrone
          </a>
          {isFetchingIsochrone && <Icon type='spinner' className='fa-spin pull-right' />}
          {!isFetchingIsochrone && isShowingIsochrone &&
            <a
              className='pull-right'
              onClick={() => this._fetchIsochrone() /* use arrow to make sure no arguments are passed */}
              title='Fetch new isochrones'
              ><Icon type='refresh' />
            </a>
          }
        </div>
        {isShowingIsochrone &&
          <div className='block'>
            <Icon type='clock-o' /> <span>{isochroneCutoff} minutes</span>
            <input
              className='pull-right'
              defaultValue={isochroneCutoff}
              type='range'
              min={ISOCHRONE_CUTOFF_MIN}
              max={ISOCHRONE_CUTOFF_MAX}
              step={ISOCHRONE_CUTOFF_STEP}
              onChange={this._setIsochroneCutoff}
              />
          </div>
        }
        {showGeocoder &&
          <Geocoder
            apiKey={geocoderApiKey}
            autoBlur
            autofocus
            focusLatlng={center}
            onChange={this._setCenter}
            placeholder='Search for an address...'
            />
        }
        {!showGeocoder &&
          <a
            className='block'
            onClick={this._showGeocoder}
            title='Search for an address'
            ><Icon type='search' /> Search
          </a>
        }
      </div>
    )
  }
}

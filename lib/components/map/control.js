import React, {Component, PropTypes} from 'react'
import Geocoder from 'react-select-geocoder'

import Icon from '../icon'

const ISOCHRONE_CUTOFF_MIN = 300
const ISOCHRONE_CUTOFF_MAX = 7200
const ISOCHRONE_CUTOFF_STEP = 300

export default class Control extends Component {
  static propTypes = {
    addIsochroneLayerToMap: PropTypes.func.isRequired,
    center: PropTypes.object.isRequired,
    clearIsochroneResults: PropTypes.func.isRequired,
    isochroneCutoff: PropTypes.number.isRequired,
    isFetchingIsochrone: PropTypes.bool.isRequired,
    isShowingIsochrone: PropTypes.bool.isRequired,
    removeIsochroneLayerFromMap: PropTypes.func.isRequired,
    setIsochroneCutoff: PropTypes.func.isRequired,
    setIsochroneLatLng: PropTypes.func.isRequired
  }

  state = {
    showGeocoder: false
  }

  _setCenter = (feature) => {
    const {clearIsochroneResults, isShowingIsochrone, setIsochroneLatLng, setMapCenter} = this.props
    if (feature && feature.geometry) {
      const {coordinates} = feature.geometry
      if (isShowingIsochrone) {
        clearIsochroneResults()
        setMapCenter(coordinates)
        setIsochroneLatLng(coordinates)
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
    this.props.setIsochroneCutoff(parseInt(e.target.value, 10))
  }

  _showGeocoder = (e) => {
    this.setState({
      ...this.state,
      showGeocoder: true
    })
  }

  _toggleIsochroneLayer = (e) => {
    e.preventDefault()
    if (this.props.isShowingIsochrone) {
      this.props.removeIsochroneLayerFromMap()
    } else {
      this.props.addIsochroneLayerToMap()
    }
  }

  render () {
    const {center, isFetchingIsochrone, isochroneCutoff, isShowingIsochrone} = this.props
    const {showGeocoder} = this.state
    return (
      <div className='MapControl'>
        <a
          className='block'
          onClick={this._toggleIsochroneLayer}
          title='Toggle isochrone'
          ><Icon type='dot-circle-o' /> Isochrone
          {isFetchingIsochrone && <Icon type='spinner' className='fa-spin pull-right' />}
          {!isFetchingIsochrone && isShowingIsochrone && <span className='pull-right'>{isochroneCutoff / 60} minutes</span>}
        </a>
        {!isFetchingIsochrone && isShowingIsochrone &&
          <div className='block'>
            <Icon type='clock-o' />
            <input
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
            apiKey={process.env.MAPZEN_SEARCH_KEY}
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

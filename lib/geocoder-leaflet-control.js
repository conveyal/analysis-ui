import React, {Component, PropTypes} from 'react'
import Control from 'react-leaflet-control'
import Geocoder from 'react-select-geocoder'

export default class GeocoderControl extends Component {
  static defaultProps = {
    position: 'topright'
  }

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    position: PropTypes.string
  }

  render () {
    const {onChange, position, ...props} = this.props
    return (
      <Control
        position={position}
        >
        <Geocoder
          onChange={onChange}
          {...props}
          />
      </Control>
    )
  }
}

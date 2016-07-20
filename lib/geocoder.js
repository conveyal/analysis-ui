import React, {Component, PropTypes} from 'react'
import Modal from 'react-modal'
import Geocoder from 'react-select-geocoder'

// TODO: clear on close

const latlngShape = {
  lat: PropTypes.number,
  lng: PropTypes.number
}

export default class Geo extends Component {
  static propTypes = {
    maxLatlng: PropTypes.shape(latlngShape),
    minLatlng: PropTypes.shape(latlngShape),
    onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
  }

  render () {
    const {maxLatlng, minLatlng, onChange, onClose} = this.props
    return (
      <Modal
        isOpen
        onRequestClose={onClose}
        style={{
          overlay: {
            zIndex: 2500,
            backgroundColor: 'rgba(255, 255, 255, 0.5)'
          },
          content: {
            background: 'transparent',
            border: 'none',
            position: 'static',
            marginTop: '40px',
            marginLeft: 'auto',
            marginRight: 'auto',
            height: '300px',
            width: '500px'
          }
        }}
        >
        <Geocoder
          apiKey={process.env.MAPZEN_SEARCH_KEY}
          autofocus
          boundary={{
            rect: {
              maxLatlng,
              minLatlng
            }
          }}
          onChange={onChange}
          placeholder='Search for an address...'
          />
      </Modal>
    )
  }
}

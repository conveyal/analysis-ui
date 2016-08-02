import React, {Component, PropTypes} from 'react'
import Modal from 'react-modal'
import Geocoder from 'react-select-geocoder'

export default class Geo extends Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
  }

  render () {
    const {isOpen, onChange, onClose} = this.props

    return (
      <Modal
        isOpen={isOpen}
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
          onChange={onChange}
          placeholder='Search for an address...'
          {...this.props}
          />
      </Modal>
    )
  }
}

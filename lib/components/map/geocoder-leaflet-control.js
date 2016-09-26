import L, {Control} from 'leaflet'
import isEqual from 'lodash.isequal'
import React, {PropTypes} from 'react'
import {render} from 'react-dom'
import {MapControl} from 'react-leaflet'
import Geocoder from 'react-select-geocoder'

import {Button} from '../buttons'
import Icon from '../icon'

const EmptyControl = Control.extend({
  onAdd: function (map) {
    const div = document.createElement('div')
    const stop = L.DomEvent.stopPropagation

    L.DomEvent // Prevent click throughs to map
      .on(div, 'click', stop)
      .on(div, 'mousedown', stop)
      .on(div, 'dblclick', stop)
      .on(div, 'click', L.DomEvent.preventDefault)
      .on(div, 'click', this.options.onClick)

    return div
  }
})

export default class GeocoderControl extends MapControl {
  static contextTypes = {
    map: PropTypes.object
  }

  static defaultProps = {
    position: 'topright'
  }

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    position: PropTypes.string
  }

  state = {
    isOpen: false
  }

  shouldComponentUpdate (newProps, newState) {
    return !isEqual(newProps, this.props) || !isEqual(newState, this.state)
  }

  componentWillMount () {
    this.leafletElement = new EmptyControl({
      position: this.props.position,
      onClick: this._open
    })
  }

  componentDidMount () {
    super.componentDidMount()
    this.renderContent()
  }

  componentDidUpdate (next) {
    super.componentDidUpdate(next)
    this.renderContent()
  }

  _open = () => {
    this.setState({isOpen: true})
  }

  _close = () => {
    this.setState({isOpen: false})
  }

  _saveFeatureAndClose = () => {
    const focusedOption = this.geocoder.select.select._focusedOption // onChange never fires...
    if (focusedOption) {
      this.props.onChange(focusedOption.feature)
    }
    window.requestAnimationFrame(this._close) // clears before certain animations finish....
  }

  _saveRefToGeocoder = (geocoder) => {
    this.geocoder = geocoder
  }

  renderContent () {
    const container = this.leafletElement.getContainer()
    const {map} = this.context
    const {isOpen} = this.state
    render((
      <div>
        {isOpen
          ? <div
            style={{
              width: '400px'
            }}
            >
            <Geocoder
              apiKey={process.env.MAPZEN_SEARCH_KEY}
              autoBlur
              autofocus
              focusLatlng={map.getCenter()}
              onClose={this._saveFeatureAndClose}
              openOnFocus
              placeholder='Search for an address...'
              ref={this._saveRefToGeocoder}
              />
          </div>
          : <Button
            onClick={this._open}
            ><Icon type='search' />
          </Button>
        }
      </div>
    ), container)
  }

  render () {
    return null
  }
}

//
import {
  faBicycle,
  faBus,
  faCar,
  faMale,
  faShip,
  faSubway,
  faTrain
} from '@fortawesome/free-solid-svg-icons'
import message from 'lib/message'
import memoize from 'lodash/memoize'
import React, {Component} from 'react'
import without from 'lodash/without'

import {Button, Group as ButtonGroup} from '../buttons'
import Icon from '../icon'
import {Group} from '../input'

const WALK = 'WALK'
const BICYCLE = 'BICYCLE'
const CAR = 'CAR'
const CAR_PARK = 'CAR_PARK' // pahk your cah in havahd yahd

const BUS = 'BUS'
const RAIL = 'RAIL'
const TRAM = 'TRAM'
const SUBWAY = 'SUBWAY'
const FERRY = 'FERRY'
const CABLE_CAR = 'CABLE_CAR'
const GONDOLA = 'GONDOLA'
const FUNICULAR = 'FUNICULAR'
const ALL = 'ALL'
const ALL_TRANSIT_ARRAY = [
  BUS,
  RAIL,
  TRAM,
  SUBWAY,
  FERRY,
  CABLE_CAR,
  GONDOLA,
  FUNICULAR
]
const ALL_TRANSIT_STRING = ALL_TRANSIT_ARRAY.join(',')

/** Select modes of travel */
export default class ModeSelector extends Component {
  _hasTransit(mode) {
    return this.props.transitModes.indexOf(mode) !== -1
  }

  _hasAllTransit() {
    return ALL_TRANSIT_ARRAY.map(
      mode => this.props.transitModes.indexOf(mode) !== -1
    ).every(Boolean)
  }

  _setModes(modes) {
    this.props.update(modes)
  }

  _selectAccessMode = memoize(newMode => () => {
    // easiest to just overwrite both. Access mode is used in transit searches
    // and direct mode in non-transit searches; overwriting only one of them
    // however would require additional updates when toggling transit.
    this._setModes({
      accessModes: newMode,
      directModes: newMode
    })
  })

  _toggleTransitMode = memoize(mode => () => {
    let transitModes
    if (mode === ALL) {
      transitModes = this._hasAllTransit() ? '' : ALL_TRANSIT_STRING
    } else {
      transitModes = this._hasTransit(mode)
        ? without(this.props.transitModes.split(','), mode).join(',')
        : [this.props.transitModes, mode].filter(Boolean).join(',')
    }

    // park-and-ride requires transit. if it selected when transit is turned
    // off, switch access mode to walk
    const accessModes =
      transitModes === '' && this.props.accessModes === CAR_PARK
        ? WALK
        : this.props.accessModes

    this._setModes({
      accessModes,
      directModes: accessModes,
      transitModes
    })
  })

  render() {
    const {disabled, accessModes, directModes, transitModes} = this.props
    const transit = transitModes !== ''
    const nonTransitMode = transit ? accessModes : directModes

    return (
      <div className='row'>
        <Group
          label={transit ? message('mode.access') : message('mode.direct')}
          className='col-xs-4'
        >
          <ButtonGroup disabled={disabled} justified>
            <Button
              active={nonTransitMode === WALK}
              onClick={this._selectAccessMode(WALK)}
              title={message('analysis.modes.walk')}
            >
              <Icon icon={faMale} />
            </Button>
            <Button
              active={nonTransitMode === BICYCLE}
              onClick={this._selectAccessMode(BICYCLE)}
              title={message('analysis.modes.bicycle')}
            >
              <Icon icon={faBicycle} />
            </Button>
            <Button
              active={nonTransitMode === CAR}
              onClick={this._selectAccessMode(CAR)}
              title={message('analysis.modes.car')}
            >
              <Icon icon={faCar} />
            </Button>
            <Button
              active={nonTransitMode === CAR_PARK}
              onClick={this._selectAccessMode(CAR_PARK)}
              disabled={!transit}
              title={message('analysis.modes.carPark')}
            >
              <strong>P</strong>
            </Button>
          </ButtonGroup>
        </Group>
        <Group label='Transit modes' className='col-xs-8'>
          <ButtonGroup disabled={disabled} justified>
            <Button
              active={this._hasAllTransit()}
              onClick={this._toggleTransitMode(ALL)}
              title='All'
            >
              All
            </Button>
            <Button
              active={this._hasTransit(BUS)}
              onClick={this._toggleTransitMode(BUS)}
              title={message('mode.bus')}
            >
              <Icon icon={faBus} />
            </Button>
            <Button
              active={this._hasTransit(TRAM)}
              onClick={this._toggleTransitMode(TRAM)}
              title={message('mode.tram')}
            >
              <strong>T</strong>
            </Button>
            <Button
              active={this._hasTransit(SUBWAY)}
              onClick={this._toggleTransitMode(SUBWAY)}
              title={message('mode.subway')}
            >
              <Icon icon={faSubway} />
            </Button>
            <Button
              active={this._hasTransit(RAIL)}
              onClick={this._toggleTransitMode(RAIL)}
              title={message('mode.rail')}
            >
              <Icon icon={faTrain} />
            </Button>
            <Button
              active={this._hasTransit(FERRY)}
              onClick={this._toggleTransitMode(FERRY)}
              title={message('mode.ferry')}
            >
              <Icon icon={faShip} />
            </Button>
            <Button
              active={this._hasTransit(CABLE_CAR)}
              onClick={this._toggleTransitMode(CABLE_CAR)}
              title={message('mode.cableCar')}
            >
              <strong>C</strong>
            </Button>
            <Button
              active={this._hasTransit(GONDOLA)}
              onClick={this._toggleTransitMode(GONDOLA)}
              title={message('mode.gondola')}
            >
              <strong>G</strong>
            </Button>
            <Button
              active={this._hasTransit(FUNICULAR)}
              onClick={this._toggleTransitMode(FUNICULAR)}
              title={message('mode.funicular')}
            >
              <strong>F</strong>
            </Button>
          </ButtonGroup>
        </Group>
      </div>
    )
  }
}

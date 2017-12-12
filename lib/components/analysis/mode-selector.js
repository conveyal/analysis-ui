// @flow
import Icon from '@conveyal/woonerf/components/icon'
import memoize from 'lodash/memoize'
import React, {PureComponent} from 'react'
import without from 'lodash/without'

import {Button, Group as ButtonGroup} from '../buttons'
import {Group} from '../input'
import messages from '../../utils/messages'

import type {ProfileRequest} from '../../types'

type Props = {
  disabled: boolean,
  profileRequest: ProfileRequest,
  setProfileRequest(ProfileRequest): void
}

const WALK = 'WALK'
const BICYCLE = 'BICYCLE'
const CAR = 'CAR'
const CAR_PARK = 'CAR_PARK' // pahk your cah in havahd yahd

const BUS = 'BUS'
const RAIL = 'RAIL'
const TRAM = 'TRAM'
const SUBWAY = 'SUBWAY'
const ALL_TRANSIT = [BUS, RAIL, TRAM, SUBWAY].join(',')

/** Select modes of travel */
export default class ModeSelector extends PureComponent {
  props: Props

  _selectAccessMode = memoize(newMode => () => {
    const {profileRequest, setProfileRequest} = this.props
    // easiest to just overwrite both. Access mode is used in transit searches
    // and direct mode in non-transit searches; overwriting only one of them
    // however would require additional updates when toggling transit.
    setProfileRequest({
      ...profileRequest,
      accessModes: newMode,
      directModes: newMode,
      // when parking a car, transit is required
      transitModes: newMode === CAR_PARK
        ? ALL_TRANSIT
        : profileRequest.transitModes
    })
  })

  _hasTransit (mode: string) {
    return this.props.profileRequest.transitModes.indexOf(mode) !== -1
  }

  _toggleTransitMode = memoize(mode => () => {
    const {profileRequest, setProfileRequest} = this.props
    const transitModes = this._hasTransit(mode)
      ? without(profileRequest.transitModes.split(','), mode).join(',')
      : [profileRequest.transitModes, mode].filter(Boolean).join(',')

    setProfileRequest({
      ...profileRequest,
      transitModes
    })
  })

  render () {
    const {disabled, profileRequest} = this.props
    const transit = profileRequest.transitModes !== ''
    const nonTransitMode = transit
      ? profileRequest.accessModes
      : profileRequest.directModes

    return (
      <div className='row'>
        <Group label='Access modes' className='col-xs-6'>
          <ButtonGroup disabled={disabled} justified>
            <Button
              active={nonTransitMode === WALK}
              onClick={this._selectAccessMode(WALK)}
              title={messages.analysis.modes.walk}
            >
              <Icon type='male' />
            </Button>
            <Button
              active={nonTransitMode === BICYCLE}
              onClick={this._selectAccessMode(BICYCLE)}
              title={messages.analysis.modes.bicycle}
            >
              <Icon type='bicycle' />
            </Button>
            <Button
              active={nonTransitMode === CAR}
              onClick={this._selectAccessMode(CAR)}
              title={messages.analysis.modes.car}
            >
              <Icon type='car' />
            </Button>
            <Button
              active={nonTransitMode === CAR_PARK}
              onClick={this._selectAccessMode(CAR_PARK)}
              title={messages.analysis.modes.carPark}
            >
              <strong>P</strong>
            </Button>
          </ButtonGroup>
        </Group>
        <Group label='Transit modes' className='col-xs-6'>
          <ButtonGroup disabled={disabled} justified>
            <Button
              active={this._hasTransit(BUS)}
              onClick={this._toggleTransitMode(BUS)}
              title='Bus'
            >
              <Icon type='bus' />
            </Button>
            <Button
              active={this._hasTransit(TRAM)}
              onClick={this._toggleTransitMode(TRAM)}
              title='Tram'
            >Tram
            </Button>
            <Button
              active={this._hasTransit(SUBWAY)}
              onClick={this._toggleTransitMode(SUBWAY)}
              title='Subway'
            ><Icon type='subway' />
            </Button>
            <Button
              active={this._hasTransit(RAIL)}
              onClick={this._toggleTransitMode(RAIL)}
              title='Rail'
            >
              <Icon type='train' />
            </Button>
          </ButtonGroup>
        </Group>
      </div>
    )
  }
}

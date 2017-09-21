// @flow
import Icon from '@conveyal/woonerf/components/icon'
import memoize from 'lodash/memoize'
import React, {PureComponent} from 'react'

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

/** Select modes of travel */
export default class ModeSelector extends PureComponent {
  props: Props

  _selectAccessMode = memoize((newMode) => () => {
    const {profileRequest, setProfileRequest} = this.props
    // easiest to just overwrite both. Access mode is used in transit searches
    // and direct mode in non-transit searches; overwriting only one of them
    // however would require additional updates when toggling transit.
    setProfileRequest({
      ...profileRequest,
      accessModes: newMode,
      directModes: newMode,
      // when parking a car, transit is required
      transitModes:
        newMode === CAR_PARK ? 'TRANSIT' : profileRequest.transitModes
    })
  })

  _toggleTransit = () => {
    const {profileRequest, setProfileRequest} = this.props
    setProfileRequest({
      ...profileRequest,
      transitModes: profileRequest.transitModes === 'TRANSIT' ? '' : 'TRANSIT'
    })
  }

  render () {
    const {disabled, profileRequest} = this.props

    const transit = profileRequest.transitModes !== ''
    const nonTransitMode = transit
      ? profileRequest.accessModes
      : profileRequest.directModes

    return (
      <Group label='Modes'>
        <br />
        <ButtonGroup disabled={disabled} justified>
          <Button
            active={nonTransitMode === WALK}
            onClick={this._selectAccessMode(WALK)}
            title={messages.analysis.modes.walk}
            ><Icon type='male' />
          </Button>
          <Button
            active={nonTransitMode === BICYCLE}
            onClick={this._selectAccessMode(BICYCLE)}
            title={messages.analysis.modes.bicycle}
            ><Icon type='bicycle' />
          </Button>
          <Button
            active={nonTransitMode === CAR}
            onClick={this._selectAccessMode(CAR)}
            title={messages.analysis.modes.car}
            ><Icon type='car' />
          </Button>
          <Button
            active={nonTransitMode === CAR_PARK}
            onClick={this._selectAccessMode(CAR_PARK)}
            title={messages.analysis.modes.carPark}
            ><strong>P</strong>
          </Button>
          <Button
            active={!!transit}
            onClick={this._toggleTransit}
            title={messages.analysis.modes.transit}
            ><Icon type='bus' />
          </Button>
        </ButtonGroup>
      </Group>
    )
  }
}

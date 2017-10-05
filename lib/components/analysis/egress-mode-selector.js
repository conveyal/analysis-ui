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

/** Select modes of travel */
export default class EgressModeSelector extends PureComponent {
  props: Props

  _selectEgressMode = memoize(newMode => () => {
    const {profileRequest, setProfileRequest} = this.props
    setProfileRequest({
      ...profileRequest,
      egressModes: newMode
    })
  })

  render () {
    const {disabled, profileRequest} = this.props

    const transit = profileRequest.transitModes !== ''
    const nonTransitMode = transit
      ? profileRequest.egressModes
      : profileRequest.directModes

    return (
      <Group label='Egress Modes'>
        <br />
        <ButtonGroup disabled={disabled}>
          <Button
            active={nonTransitMode === WALK}
            onClick={this._selectEgressMode(WALK)}
            title={messages.analysis.modes.walk}
          >
            <Icon type='male' />
          </Button>
          <Button
            active={nonTransitMode === BICYCLE}
            disabled
            onClick={this._selectEgressMode(BICYCLE)}
            title={messages.analysis.modes.bicycle}
          >
            <Icon type='bicycle' />
          </Button>
        </ButtonGroup>
      </Group>
    )
  }
}

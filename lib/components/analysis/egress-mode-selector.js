import {faBicycle, faWalking} from '@fortawesome/free-solid-svg-icons'
import React from 'react'

import message from 'lib/message'

import {Button, Group as ButtonGroup} from '../buttons'
import Icon from '../icon'
import {Group} from '../input'

const WALK = 'WALK'
const BICYCLE = 'BICYCLE'

/** Select modes of travel */
export default function EgressModeSelector(p) {
  function selectEgressMode(newMode) {
    p.update({egressModes: newMode})
  }

  return (
    <Group label='Egress Modes'>
      <br />
      <ButtonGroup>
        <Button
          active={p.egressModes === WALK}
          disabled={p.disabled}
          onClick={() => selectEgressMode(WALK)}
          title={message('analysis.modes.walk')}
        >
          <Icon icon={faWalking} />
        </Button>
        <Button
          active={p.egressModes === BICYCLE}
          disabled={p.disabled}
          onClick={() => selectEgressMode(BICYCLE)}
          title={message('analysis.modes.bicycle')}
        >
          <Icon icon={faBicycle} />
        </Button>
      </ButtonGroup>
    </Group>
  )
}

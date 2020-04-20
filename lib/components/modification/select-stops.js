import {faExclamationCircle} from '@fortawesome/free-solid-svg-icons'
import React from 'react'

import {MAP_STATE_STOP_SELECTION} from 'lib/constants'
import message from 'lib/message'

import {Button, Group} from '../buttons'
import Icon from '../icon'

/**
 * Select stops on a particular route
 */
export default function SelectStops(p) {
  const onAction = (action) => () => {
    p.setMapState({
      action,
      routeStops: p.routeStops,
      state: MAP_STATE_STOP_SELECTION
    })
  }

  function onClear() {
    p.update({stops: null})
  }

  return (
    <div className='form-group'>
      <label htmlFor='Selection'>Selection</label>
      {p.selectedStops.length < 1 ? (
        <>
          <div className='alert alert-info' role='alert'>
            <Icon icon={faExclamationCircle} />{' '}
            {message('modification.selectStopInstructions')}
          </div>
          <Button block onClick={onAction('new')} style='primary'>
            New
          </Button>
        </>
      ) : (
        <>
          <Group justified>
            <Button onClick={onAction('add')}>Add to</Button>
            <Button onClick={onAction('remove')}>Remove from</Button>
            <Button onClick={onClear}>Clear</Button>
          </Group>
          <br />
          <SelectedStops selectedStops={p.selectedStops} />
        </>
      )}
    </div>
  )
}

function SelectedStops({selectedStops}) {
  return (
    <ul>
      {selectedStops.map((stop) => (
        <li data-id={stop.stop_id} key={stop.stop_id}>
          {stop.stop_name}
        </li>
      ))}
    </ul>
  )
}

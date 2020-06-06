import {List, ListItem} from '@chakra-ui/core'
import {faExclamationCircle} from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import {useSelector} from 'react-redux'

import {MAP_STATE_STOP_SELECTION} from 'lib/constants'
import message from 'lib/message'
import selectRouteStops from 'lib/selectors/route-stops'
import selectSelectedStops from 'lib/selectors/selected-stops'

import {Button, Group} from '../buttons'
import Icon from '../icon'

/**
 * Select stops on a particular route
 */
export default function SelectStops(p) {
  const routeStops = useSelector(selectRouteStops)
  const selectedStops = useSelector(selectSelectedStops)

  const onAction = (action) => () => {
    p.setMapState({
      action,
      routeStops: routeStops,
      state: MAP_STATE_STOP_SELECTION
    })
  }

  function onClear() {
    p.update({stops: null})
  }

  return (
    <div className='form-group'>
      <label htmlFor='Selection'>Selection</label>
      {selectedStops.length < 1 ? (
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
          <SelectedStops selectedStops={selectedStops} />
        </>
      )}
    </div>
  )
}

function SelectedStops({selectedStops}) {
  return (
    <List styleType='disc'>
      {selectedStops.map((stop) => (
        <ListItem data-id={stop.stop_id} key={stop.stop_id}>
          {stop.stop_name}
        </ListItem>
      ))}
    </List>
  )
}

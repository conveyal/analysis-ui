import {Alert, AlertIcon, Stack, Flex} from '@chakra-ui/core'
import {
  faDrawPolygon,
  faPlusSquare,
  faMinusSquare,
  faBan
} from '@fortawesome/free-solid-svg-icons'
import get from 'lodash/get'
import dynamic from 'next/dynamic'
import {useCallback} from 'react'
import {useSelector} from 'react-redux'

import message from 'lib/message'
import selectModificationFeed from 'lib/selectors/modification-feed'

import {MAP_STATE_HOP_SELECTION} from '../../constants'
import IconButton from '../icon-button'
import NumberInput from '../number-input'

import SelectPatterns from './select-patterns'
import SelectFeedAndRoutes from './select-feed-and-routes'

const MapLayer = dynamic(() =>
  import('../modifications-map/adjust-speed-layer')
)

// Test for valid speed value
const testSpeed = (s) => s >= 0

/**
 * Adjust speed on a route
 */
export default function AdjustSpeedComponent({
  modification,
  setMapState,
  update,
  updateAndRetrieveFeedData
}) {
  const selectedFeed = useSelector(selectModificationFeed)

  function onSelectorChange(value) {
    const {feed, routes, trips} = value
    updateAndRetrieveFeedData({feed, routes, trips, hops: null})
  }

  function newSelection() {
    setMapState({
      state: MAP_STATE_HOP_SELECTION,
      action: 'new'
    })
  }

  function addToSelection() {
    setMapState({
      state: MAP_STATE_HOP_SELECTION,
      action: 'add'
    })
  }

  function removeFromSelection() {
    setMapState({
      state: MAP_STATE_HOP_SELECTION,
      action: 'remove'
    })
  }

  function clearSegment() {
    update({hops: null})
  }

  /**
   * Set the factor by which we are scaling, or the speed which we are
   * replacing.
   */
  const setScale = useCallback((scale) => update({scale}), [update])

  return (
    <>
      <MapLayer feed={selectedFeed} modification={modification} />

      <Stack spacing={4} mb={4}>
        <SelectFeedAndRoutes
          allowMultipleRoutes
          onChange={onSelectorChange}
          selectedRouteIds={modification.routes}
        />

        {get(modification, 'routes.length') === 1 && (
          <Stack spacing={4}>
            <SelectPatterns
              onChange={(trips) => updateAndRetrieveFeedData({trips})}
              trips={modification.trips}
            />

            <Alert status='info'>
              <AlertIcon />
              {message('report.adjustSpeed.selectInstructions')}
            </Alert>

            <Flex justify='space-between'>
              <IconButton
                icon={faDrawPolygon}
                label={message('common.select')}
                onClick={newSelection}
                size='lg'
                variantColor='green'
              />
              <IconButton
                icon={faPlusSquare}
                label={message('common.addTo')}
                onClick={addToSelection}
                size='lg'
              />
              <IconButton
                icon={faMinusSquare}
                label={message('common.removeFrom')}
                onClick={removeFromSelection}
                size='lg'
                variantColor='yellow'
              />
              <IconButton
                icon={faBan}
                label={message('common.clear')}
                onClick={clearSegment}
                size='lg'
                variantColor='red'
              />
            </Flex>
          </Stack>
        )}

        <NumberInput
          label={message('report.adjustSpeed.scaleLabel')}
          onChange={setScale}
          test={testSpeed}
          value={modification.scale}
        />
      </Stack>
    </>
  )
}

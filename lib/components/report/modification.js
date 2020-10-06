import {Box, Flex, Heading, Stack} from '@chakra-ui/core'
import React from 'react'

import {
  ADD_TRIP_PATTERN,
  ADJUST_DWELL_TIME,
  ADJUST_SPEED,
  CONVERT_TO_FREQUENCY,
  REMOVE_STOPS,
  REMOVE_TRIPS,
  REROUTE
} from 'lib/constants'
import message from 'lib/message'

import AdjustFrequency from './adjust-frequency'
import AddTrips from './add-trips'
import RemoveTrips from './remove-trips'
import RemoveStops from './remove-stops'
import Reroute from './reroute'
import AdjustDwellTime from './adjust-dwell-time'
import AdjustSpeed from './adjust-speed'

/** A Modification in a report */
export default function Modification(props) {
  const {modification, feedsById, index, total} = props
  const {type} = modification
  if (type !== ADD_TRIP_PATTERN && feedsById[modification.feed] === undefined) {
    return null
  }

  return (
    <Stack
      borderBottomWidth='1px'
      pb={2}
      spacing={2}
      style={{pageBreakBefore: 'always'}}
    >
      <Flex justify='space-between'>
        <Heading size='md'>{modification.name}</Heading>
        <Box>
          ({index} / {total}) {message(`modificationType.${type}`) || type}
        </Box>
      </Flex>

      {modification.description && <Box>{modification.description}</Box>}

      <Box>
        {type === CONVERT_TO_FREQUENCY && <AdjustFrequency {...props} />}
        {type === ADD_TRIP_PATTERN && <AddTrips {...props} />}
        {type === REMOVE_TRIPS && <RemoveTrips {...props} />}
        {type === REMOVE_STOPS && <RemoveStops {...props} />}
        {type === REROUTE && <Reroute {...props} />}
        {type === ADJUST_DWELL_TIME && <AdjustDwellTime {...props} />}
        {type === ADJUST_SPEED && <AdjustSpeed {...props} />}
      </Box>
    </Stack>
  )
}

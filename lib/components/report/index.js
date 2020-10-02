import {Box, Heading, Stack} from '@chakra-ui/core'
import dynamic from 'next/dynamic'
import React from 'react'
import {useSelector} from 'react-redux'

import message from 'lib/message'
import selectFeedsById from 'lib/selectors/feeds-by-id'
import selectFeedScopedStops from 'lib/selectors/feed-scoped-stops'
import selectProjectTimetables from 'lib/selectors/project-timetables'

const ModificationReport = dynamic(() => import('./modification'), {ssr: false})
const attribution = '© Mapbox © OpenStreetMap'

/**
 * Main report generation component
 */
export function Report(p) {
  return (
    <Stack spacing={6}>
      <Heading>
        {p.project.name}{' '}
        <small>{message('report.variant', {variant: p.variant})}</small>
      </Heading>
      <Box>{message('report.bundle', {name: p.bundle.name})}</Box>

      {p.modifications.map((m, index) => (
        <ModificationReport
          key={m._id}
          modification={m}
          feedsById={p.feedsById}
          projectTimetables={p.projectTimetables}
          feedScopedStops={p.feedScopedStops}
          index={index + 1} // correct for 0-based array indices
          total={p.modifications.length}
        />
      ))}

      <Box>Map data: {attribution}</Box>
    </Stack>
  )
}

export default function WrappedReport(p) {
  const feedsById = useSelector(selectFeedsById)
  const feedScopedStops = useSelector(selectFeedScopedStops)
  const projectTimetables = useSelector(selectProjectTimetables)

  return (
    <Report
      {...p}
      feedsById={feedsById}
      feedScopedStops={feedScopedStops}
      projectTimetables={projectTimetables}
    />
  )
}

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
    <div className='container'>
      <div className='row'>
        <div className='col-xs-12' style={{float: 'none'}}>
          <div className='page-header'>
            <h1>
              {p.project.name}{' '}
              <small>{message('report.variant', {variant: p.variant})}</small>
            </h1>
          </div>
          <p>{message('report.bundle', {name: p.bundle.name})}</p>
        </div>
      </div>

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

      <div className='row'>
        <div className='col-xs-12'>
          <p>Map data: {attribution}</p>
        </div>
      </div>
    </div>
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

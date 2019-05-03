import dynamic from 'next/dynamic'
import React, {Component} from 'react'
import {useSelector} from 'react-redux'

import message from 'lib/message'
import selectFeedScopedStops from 'lib/selectors/feed-scoped-stops'
import selectProjectTimetables from 'lib/selectors/project-timetables'

const ModificationReport = dynamic(() => import('./modification'), {ssr: false})

/**
 * Main report generation component
 */
export default function Report(p) {
  const feedsById = useSelector(state => state.project.feedsById)
  const feedScopedStops = useSelector(selectFeedScopedStops)
  const projectTimetables = useSelector(selectProjectTimetables)

  return (
    <div className='container' id='report'>
      <div className='row'>
        <div className='col-md-6 col-offset-2' style={{float: 'none'}}>
          <h1>{p.project.name}</h1>
          <h2>{message('report.variant', {variant: p.variant})}</h2>
          {message('report.bundle', {name: p.bundle.name})}

          {/* TODO have a map of all modifications here */}

          {p.modifications.map((mod, index) => (
            <ModificationReport
              key={mod._id}
              modification={mod}
              feedsById={feedsById}
              projectTimetables={projectTimetables}
              feedScopedStops={feedScopedStops}
              index={index + 1} // correct for 0-based array indices
              total={p.modifications.length}
            />
          ))}
          <i>
            Map data:{' '}
            <span
              dangerouslySetInnerHTML={{
                __html: process.env.LEAFLET_ATTRIBUTION
              }}
            />
          </i>
        </div>
      </div>
    </div>
  )
}

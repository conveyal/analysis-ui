// @flow
import React, {Component} from 'react'
import {sprintf} from 'sprintf-js'

import ModificationComponent from './modification'
import messages from '../../utils/messages'

import type {
  Bundle,
  Feed,
  Modification,
  Scenario,
  Stop,
  Timetable
} from '../../types'

type Props = {
  allFeedIds: string[],
  scenarioId: string,
  projectId: string,
  modifications?: Modification[],
  scenario?: Scenario,
  bundle?: Bundle,
  feedsById: {
    [id: string]: Feed
  },
  variant: string,
  loadScenario(string): void,
  loadProject(string): void,
  feedScopedStops: Stop[],
  scenarioTimetables: Timetable[]
}

function alertOnError (error: {message?: string, reason?: string}) {
  window.alert(
    `Error while rendering report! ${error.message || error.reason || ''}`
  )
}

/**
 * Main report generation component
 */
export default class Report extends Component<void, Props, void> {
  componentWillMount () {
    window.addEventListener('error', alertOnError)
    window.addEventListener('unhandledrejection', alertOnError)
  }

  componentDidMount () {
    const {loadScenario, loadProject, projectId, scenarioId} = this.props
    loadScenario(scenarioId)
    loadProject(projectId)
  }

  render () {
    const {
      allFeedIds,
      modifications,
      feedsById,
      scenario,
      bundle,
      variant,
      scenarioTimetables,
      feedScopedStops
    } = this.props

    if (modifications == null || scenario == null || bundle == null) {
      return <div />
    }

    if (!allFeedIds.every(feedId => !!feedsById[feedId])) return <div />

    return (
      <div className='container' id='report'>
        <div className='row'>
          <div className='col-md-6 col-offset-2' style={{float: 'none'}}>
            <h1>
              {scenario.name}
            </h1>
            <h2>
              {sprintf(messages.report.variant, variant)}
            </h2>
            {sprintf(messages.report.bundle, bundle.name)}

            {/* TODO it'd be really cool to have a map of all modifications here but the scenario editor is not yet fast enough */}

            {modifications.map((mod, index) => (
              <ModificationComponent
                key={mod._id}
                modification={mod}
                feedsById={feedsById}
                scenarioTimetables={scenarioTimetables}
                feedScopedStops={feedScopedStops}
                index={index + 1} // correct for 0-based array indices
                total={modifications.length}
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
}

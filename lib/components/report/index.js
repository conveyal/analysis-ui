/** Main report generation component */

import React, { Component, PropTypes } from 'react'
import Modification from './modification'
import {sprintf} from 'sprintf-js'

import messages from '../../utils/messages'

export default class Report extends Component {
  static propTypes = {
    scenarioId: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    modifications: PropTypes.array,
    scenario: PropTypes.object,
    bundle: PropTypes.object,
    feedsById: PropTypes.object,
    variant: PropTypes.string.isRequired,
    loadScenario: PropTypes.func.isRequired,
    loadProject: PropTypes.func.isRequired
  }

  componentWillMount () {
    const { loadScenario, loadProject, projectId, scenarioId } = this.props
    loadScenario(scenarioId)
    loadProject(projectId)
  }

  render () {
    const { modifications, feedsById, scenario, bundle, variant } = this.props

    if (modifications == null || scenario == null || bundle == null) return <div />

    return <div className='container' id='report'>
      <div className='row'>
        <div className='col-md-6 col-offset-2'>

          <h1>{scenario.name}</h1>
          <h2>{sprintf(messages.report.variant, variant)}</h2>
          {sprintf(messages.report.bundle, bundle.name)}

          {/* TODO it'd be really cool to have a map of all modifications here but the scenario editor is not yet fast enough */}

          {modifications.map(mod => <Modification modification={mod} feedsById={feedsById} />)}
          <i>Map data: <span dangerouslySetInnerHTML={{__html: process.env.LEAFLET_ATTRIBUTION}} /></i>
        </div>
      </div>
    </div>
  }
}

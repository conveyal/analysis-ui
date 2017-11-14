// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React, {Component} from 'react'

import messages from '../utils/messages'

import type {Project} from '../types'

type Props = {
  children: ?any,
  project?: Project,

  clearCurrentProject: () => void,
}

export default class ProjectComponent extends Component {
  props: Props

  componentWillUnmount () {
    this.props.clearCurrentProject()
  }

  render () {
    const {children, project} = this.props

    return project
      ? <div>
        <div className='ApplicationDockTitle'>
          <Icon type='cubes' /> {project.name}
        </div>

        {children}
      </div>
      : <div className='block'>
        {messages.region.loadingRegion}
      </div>
  }
}

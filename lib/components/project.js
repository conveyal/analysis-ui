// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React, {Component} from 'react'
import {Link} from 'react-router'

import messages from '../utils/messages'

type Props = {
  availableR5Versions?: string[],
  children: ?any,
  project?: {
    _id: string,
    description: ?string,
    name: ?string,
    r5Version: string
  },

  loadR5Versions(): void
}

export default class Project extends Component<void, Props, void> {
  componentDidMount () {
    if (!this.props.availableR5Versions) {
      this.props.loadR5Versions()
    }
  }

  render () {
    const {availableR5Versions, children, project} = this.props
    const r5VersionUnsupported =
      project &&
      availableR5Versions &&
      !availableR5Versions.includes(project.r5Version)

    return project
      ? <div>
        <div className='ApplicationDockTitle'>
          <Icon type='cubes' /> {project.name}
        </div>

        {r5VersionUnsupported &&
        <div className='panel-body'>
          <div className='alert alert-danger' role='alert'>
            {messages.region.versionOutdated}{' '}
            <Link to={`/projects/${project._id}/edit`}>
              {messages.region.editProject}
            </Link>
          </div>
        </div>}

        {children}
      </div>
      : <div className='block'>{messages.region.loadingProject}</div>
  }
}

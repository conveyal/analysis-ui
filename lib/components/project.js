// @flow

import Icon from '@conveyal/woonerf/components/icon'
import React, {Component} from 'react'
import {Link} from 'react-router'

import messages from '../utils/messages'

import type {Project} from '../types'

type Props = {
  availableR5Versions?: string[],
  children?: any,
  project?: Project,

  clearCurrentProject: () => void,
  loadR5Versions: () => void
}

export default class ProjectComponent extends Component {
  props: Props

  componentDidMount () {
    if (!this.props.availableR5Versions || this.props.availableR5Versions.length === 0) {
      this.props.loadR5Versions()
    }
  }

  componentWillUnmount () {
    this.props.clearCurrentProject()
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
        <div className='block'>
          <div className='alert alert-danger' role='alert'>
            {messages.region.versionOutdated}{' '}
            <Link to={`/projects/${project._id}/edit`}>
              {messages.region.editRegion}
            </Link>
          </div>
        </div>}

        {children}
      </div>
      : <div className='block'>
        {messages.region.loadingRegion}
      </div>
  }
}

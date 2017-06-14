// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React, {Component} from 'react'
import {Link} from 'react-router'

import {Body as PanelBody} from './panel'
import messages from '../utils/messages'

type Props = {
  children: ?any,
  isLoaded: boolean,
  project?: {
    description: ?string,
    id: string,
    name: ?string
  },
  r5VersionUnsupported: boolean,

  loadR5Versions(): void
}

export default class Project extends Component<void, Props, void> {
  componentDidMount () {
    this.props.loadR5Versions()
  }

  render () {
    const {children, project, r5VersionUnsupported} = this.props

    return project
      ? <div>
        <div
          className='ApplicationDockTitle'
          ><Icon type='cubes' /> {project.name}
          <Link
            className='pull-right'
            title='Edit project settings'
            to={`/projects/${project.id}/edit`}
            ><Icon type='pencil' />
          </Link>
        </div>

        <div className='InnerDock'>
          {r5VersionUnsupported && <div className='alert alert-danger' role='alert'>
            {messages.project.versionOutdated} <Link to={`/projects/${project.id}/edit`}>{messages.project.editProject}</Link>
          </div>}

          {children}
        </div>
      </div>
      : <PanelBody>Loading project...</PanelBody>
  }
}

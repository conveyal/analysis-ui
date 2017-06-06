// @flow
import React from 'react'
import {Link} from 'react-router'

import DeepEqualComponent from './deep-equal'
import Icon from './icon'
import messages from '../utils/messages'

type Props = {
  children: ?any,
  description: ?string,
  id: string,
  isLoaded: boolean,
  name: ?string,
  r5VersionUnsupported: boolean,

  load: (string) => void
}

export default class Project extends DeepEqualComponent<void, Props, void> {
  componentWillMount () {
    const {id, load} = this.props
    load(id)
  }

  componentWillReceiveProps (newProps) {
    const {id, load} = this.props
    const isNewProjectId = id !== newProps.id
    if (isNewProjectId) load()
  }

  render () {
    const {children, id, isLoaded, name, r5VersionUnsupported} = this.props

    return (
      <div>
        <div
          className='DockTitle'
          >Project:
          <Link
            to={`/projects/${id}`}
            ><span> {name}</span>
          </Link>
          <Link
            className='pull-right'
            to={`/projects/${id}/edit`}
            ><Icon type='pencil' />
          </Link>
        </div>

        {r5VersionUnsupported && <div className='alert alert-danger' role='alert'>
          {messages.project.versionOutdated} <Link to={`/projects/${id}/edit`}>{messages.project.editProject}</Link>
        </div>}

        {isLoaded && children}
      </div>
    )
  }
}
